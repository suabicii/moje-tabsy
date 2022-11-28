<?php

namespace App\Controller\API;

use App\Entity\Drug;
use App\Entity\MobileAppUser;
use Exception;
use FOS\RestBundle\Controller\Annotations\Route as Rest;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\User\UserInterface;

#[Rest('/api')]
class DrugApiController extends ApiController
{
    #[Rest('/drug-list', name: 'drug_list', methods: ['GET'])]
    public function drugList(): JsonResponse
    {
        $user = $this->getUser();
        if ($user) {
            $userFromDb = $this->getUserFromDb($user);
            $drugList = $this->doctrine->getRepository(Drug::class)->findDrugsRelatedToUser($userFromDb);
            return $this->json($drugList);
        } else {
            return $this->json(['error' => 'Permission denied'], 401);
        }
    }

    #[Rest('/add-drug', name: 'add_drug', methods: ['POST'])]
    public function addDrug(Request $request): JsonResponse
    {
        $user = $this->getUser();
        if ($user) {
            $content = json_decode($request->getContent(), true); // data retrieved from front-end
            if (!$content) {
                return $this->json(['error' => 'Method not allowed'], 405);
            }
            $this->saveNewDrugInDatabase($user, $content);

            return $this->json([
                'status' => 'OK',
                'addedDrug' => $content
            ]);
        } else {
            return $this->json(['error' => 'Adding drug failed'], 401);
        }
    }

    #[Rest('/delete-drug/{drugId}', name: 'delete_drug', methods: ['DELETE'])]
    public function deleteDrug(int $drugId): JsonResponse
    {
        $user = $this->getUser();
        if ($user) {
            $drug = $this->doctrine->getRepository(Drug::class)->find($drugId);

            if ($drug) {
                $entityManager = $this->doctrine->getManager();
                $entityManager->remove($drug);
                $entityManager->flush();

                return $this->json([
                    'status' => 'OK',
                    'message' => 'Drug removed'
                ]);
            } else {
                return $this->json(['error' => 'Drug with id: ' . $drugId . ' not found'], 404);
            }
        } else {
            return $this->json(['error' => 'Removing drug failed'], 401);
        }
    }

    #[Rest('/edit-drug/{drugId}', name: 'edit_drug', methods: ['PUT'])]
    public function editDrug(Request $request, int $drugId): JsonResponse
    {
        $user = $this->getUser();
        if ($user) {
            $drug = $this->doctrine->getRepository(Drug::class)->find($drugId);
            if ($drug) {
                $entityManager = $this->doctrine->getManager();
                $content = json_decode($request->getContent(), true);
                if (!$content) {
                    return $this->json(['error' => 'Method not allowed'], 405);
                }
                foreach ($content as $updateKey => $updateValue) {
                    $this->changeDrugData($drug, $updateKey, $updateValue);
                }
                $entityManager->flush();
                return $this->json(['status' => 'OK', 'updates' => $content]);
            } else {
                return $this->json(['error' => 'Drug with id: ' . $drugId . ' not found'], 404);
            }
        } else {
            return $this->json(['error' => 'Only logged users can edit drugs'], 401);
        }
    }

    /**
     * @throws Exception
     */
    #[Rest('/drug-notify/{token}', name: 'drug_notify', methods: ['GET'])]
    public function getDrugDataForNotifications(string $token): JsonResponse
    {
        $mobileAppUser = $this->doctrine->getRepository(MobileAppUser::class)->findOneBy([
            'token' => $token
        ]);
        if ($mobileAppUser) {
            $drugs = $this->doctrine->getRepository(Drug::class)->findDrugsRelatedToUser(
                $mobileAppUser->getUser()
            );
            $response = $this->prepareDrugDataForNotifications($drugs);
            return $this->json($response);
        } else {
            return $this->json(['error' => 'User is not logged in'], 404);
        }
    }

    /**
     * @param Drug $drug
     * @param string $updateKey Column name in table
     * @param mixed $updateValue Column value
     * @return void
     */
    private function changeDrugData(Drug $drug, string $updateKey, mixed $updateValue): void
    {
        switch ($updateKey) {
            case 'name':
                $drug->setName($updateValue);
                break;
            case 'quantity':
                $drug->setQuantity($updateValue);
                break;
            case 'quantityMax':
                $drug->setQuantityMax($updateValue);
                break;
            case 'unit':
                $drug->setUnit($updateValue);
                break;
            case 'dosing':
                $drug->setDosing($updateValue);
                break;
            case 'dosingMoments':
                $drug->setDosingMoments($updateValue);
                break;
            default:
                throw new \Error('Column ' . '"' . $updateKey . '"' . ' does not exist in table');
        }
    }

    /**
     * @param UserInterface $user
     * @param mixed $content
     * @return void
     */
    private function saveNewDrugInDatabase(UserInterface $user, mixed $content): void
    {
        $drug = new Drug();
        $userFromDb = $this->getUserFromDb($user);
        $drug->setUser($userFromDb);
        $drug->setName($content['name']);
        $drug->setQuantity($content['quantity']);
        $drug->setQuantityMax($content['quantityMax']);
        $drug->setUnit($content['unit']);
        $drug->setDosing($content['dosing']);
        $drug->setDosingMoments($content['dosingMoments']);

        $entityManager = $this->doctrine->getManager();
        $entityManager->persist($drug);
        $entityManager->flush();
    }

    /**
     * @param array $drugs
     * @return array
     * @throws Exception
     */
    private function prepareDrugDataForNotifications(array $drugs): array
    {
        $response = [];
        $now = $_ENV['APP_ENV'] === 'test' ? new \DateTime('12:00') : new \DateTime();
        foreach ($drugs as $drug) {
            $dosingMoments = [];
            foreach ($drug['dosingMoments'] as $key => $value) {
                $dosingDateTime = new \DateTime($value);
                if ($dosingDateTime >= $now) {
                    $dosingMoments[$key] = $value;
                }
            }
            if (!empty($dosingMoments)) {
                $response[] = [
                    'name' => $drug['name'],
                    'dosing' => $drug['dosing'],
                    'unit' => $drug['unit'],
                    'dosingMoments' => $dosingMoments
                ];
            }
        }
        return $response;
    }
}
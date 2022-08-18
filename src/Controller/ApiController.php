<?php

namespace App\Controller;

use App\Entity\Drug;
use App\Entity\User;
use Doctrine\Persistence\ManagerRegistry;
use FOS\RestBundle\Controller\AbstractFOSRestController;
use FOS\RestBundle\Controller\Annotations\Route as Rest;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Serializer;

/**
 * @property ManagerRegistry $doctrine
 * @property Serializer $serializer
 */
#[Rest('/api')]
class ApiController extends AbstractFOSRestController
{
    public function __construct(ManagerRegistry $doctrine)
    {
        $this->doctrine = $doctrine;
    }

    #[Rest('/user-data', name: 'user_data', methods: ['GET'])]
    public function userData(): JsonResponse
    {
        $user = $this->getUser();
        if ($user) {
            $userFromDb = $this->getUserFromDb($user);
            return $this->json([
                'name' => $userFromDb->getName(),
                'email' => $userFromDb->getEmail(),
                'tel_prefix' => $userFromDb->getTelPrefix(),
                'tel' => $userFromDb->getTel()
            ]);
        } else {
            return $this->json(['error' => 'No user was found']);
        }
    }

    #[Rest('/drug-list', name: 'drug_list', methods: ['GET'])]
    public function drugList(): Response
    {
        $user = $this->getUser();
        if ($user) {
            $userFromDb = $this->getUserFromDb($user);
            $drugList = $this->doctrine->getRepository(Drug::class)->findDrugsRelatedToUser($userFromDb);
            return $this->json($drugList);
        } else {
            return $this->json(['error' => 'Permission denied']);
        }
    }

    /**
     * @param UserInterface $user
     * @return mixed
     */
    private function getUserFromDb(UserInterface $user): mixed
    {
        return $this->doctrine->getRepository(User::class)->findOneBy([
            'email' => $user->getUserIdentifier()
        ]);
    }
}

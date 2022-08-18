<?php

namespace App\Controller;

use App\Entity\Drug;
use App\Entity\User;
use Doctrine\Persistence\ManagerRegistry;
use FOS\RestBundle\Controller\AbstractFOSRestController;
use FOS\RestBundle\Controller\Annotations\Route as Rest;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
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
            $userRepository = $this->doctrine->getRepository(User::class)->findOneBy([
                'email' => $user->getUserIdentifier()
            ]);
            return $this->json([
                'name' => $userRepository->getName(),
                'email' => $userRepository->getEmail(),
                'tel_prefix' => $userRepository->getTelPrefix(),
                'tel' => $userRepository->getTel()
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
            $userRepository = $this->doctrine->getRepository(User::class)->findOneBy([
                'email' => $user->getUserIdentifier()
            ]);
            $drugList = $this->doctrine->getRepository(Drug::class)->findDrugsRelatedToUser($userRepository);
            return $this->json($drugList);
        } else {
            return $this->json(['error' => 'Permission denied']);
        }
    }
}

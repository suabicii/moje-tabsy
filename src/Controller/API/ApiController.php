<?php

namespace App\Controller\API;

use App\Entity\Drug;
use App\Entity\User;
use Doctrine\Persistence\ManagerRegistry;
use FOS\RestBundle\Controller\AbstractFOSRestController;
use FOS\RestBundle\Controller\Annotations\Route as Rest;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * @property ManagerRegistry $doctrine
 */
class ApiController extends AbstractFOSRestController
{
    public function __construct(ManagerRegistry $doctrine)
    {
        $this->doctrine = $doctrine;
    }

    /**
     * @param UserInterface $user Logged user
     * @return mixed
     */
    protected function getUserFromDb(UserInterface $user): mixed
    {
        return $this->doctrine->getRepository(User::class)->findOneBy([
            'email' => $user->getUserIdentifier()
        ]);
    }
}

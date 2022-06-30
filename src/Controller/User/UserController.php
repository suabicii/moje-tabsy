<?php

namespace App\Controller\User;

use App\Service\CookieCleanerService;
use App\Service\EmailService;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

/**
 * @property ManagerRegistry $doctrine
 * @property UserPasswordHasherInterface $passwordHasher
 * @property EmailService $emailService
 * @property CookieCleanerService $cookieCleaner
 */
class UserController extends AbstractController
{
    public function __construct(ManagerRegistry $doctrine, EmailService $emailService, UserPasswordHasherInterface $passwordHasher, CookieCleanerService $cookieCleaner)
    {
        $this->doctrine = $doctrine;
        $this->passwordHasher = $passwordHasher;
        $this->emailService = $emailService;
        $this->cookieCleaner = $cookieCleaner;
    }

    /**
     * @return string
     */
    protected function generateToken(): string
    {
        $rand_token = openssl_random_pseudo_bytes(16);
        return bin2hex($rand_token);
    }
}

<?php

namespace App\Controller\User;

use App\Entity\UserDataUpdates;
use App\Service\CookieCleanerService;
use App\Service\EmailService;
use App\Service\TokenGeneratorService;
use DateTimeImmutable;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @property ManagerRegistry $doctrine
 * @property UserPasswordHasherInterface $passwordHasher
 * @property EmailService $emailService
 * @property CookieCleanerService $cookieCleaner
 * @property TokenGeneratorService $tokenGenerator
 */
class UserController extends AbstractController
{
    public function __construct(
        ManagerRegistry             $doctrine,
        EmailService                $emailService,
        UserPasswordHasherInterface $passwordHasher,
        CookieCleanerService        $cookieCleaner,
        TokenGeneratorService       $tokenGenerator
    )
    {
        $this->doctrine = $doctrine;
        $this->passwordHasher = $passwordHasher;
        $this->emailService = $emailService;
        $this->cookieCleaner = $cookieCleaner;
        $this->tokenGenerator = $tokenGenerator;
    }

    #[Route('/user-data-change/{token}', name: 'user_data_change_page')]
    public function user_data_change_page(string $token): Response
    {
        $updates = $this->doctrine->getRepository(UserDataUpdates::class)->findOneBy([
            'token' => $token
        ]);
        if ($updates) {
            if (new DateTimeImmutable() > $updates->getExpiresAt()) {
                return $this->render('user/user_data_change_failed.html.twig', [
                    'error' => 'Sesja zmiany danych wygasła. Aby zmienić swoje dane, w panelu klienta przejdź do zakładki 
                    "Mój profil", następnie ponownie prześlij widoczny na stronie formularz wypełniony danymi, które chcesz zmienić'
                ]);
            }
            return $this->render('user/user_data_change.html.twig');
        } else {
            return $this->render('user/user_data_change_failed.html.twig', [
                'error' => 'Nie znaleziono użytkownika'
            ]);
        }
    }
}

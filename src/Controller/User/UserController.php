<?php

namespace App\Controller\User;

use App\Entity\User;
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
use Symfony\Component\Serializer\Exception\ExceptionInterface;
use Symfony\Component\Serializer\SerializerInterface;

/**
 * @property ManagerRegistry $doctrine
 * @property UserPasswordHasherInterface $passwordHasher
 * @property EmailService $emailService
 * @property CookieCleanerService $cookieCleaner
 * @property TokenGeneratorService $tokenGenerator
 * @property SerializerInterface $serializer
 */
class UserController extends AbstractController
{
    public function __construct(
        ManagerRegistry             $doctrine,
        EmailService                $emailService,
        UserPasswordHasherInterface $passwordHasher,
        CookieCleanerService        $cookieCleaner,
        TokenGeneratorService       $tokenGenerator,
        SerializerInterface         $serializer
    )
    {
        $this->doctrine = $doctrine;
        $this->passwordHasher = $passwordHasher;
        $this->emailService = $emailService;
        $this->cookieCleaner = $cookieCleaner;
        $this->tokenGenerator = $tokenGenerator;
        $this->serializer = $serializer;
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
            $this->updateUserData($updates);
            $this->removeTemporaryData($updates);
            return $this->render('user/user_data_change.html.twig');
        } else {
            return $this->render('user/user_data_change_failed.html.twig', [
                'error' => 'Nie znaleziono użytkownika'
            ]);
        }
    }

    /**
     * @param UserDataUpdates $updates
     * @return void
     */
    private function updateUserData(UserDataUpdates $updates): void
    {
        $entityManager = $this->doctrine->getManager();
        $user = $updates->getUser();
        try {
            $updatesArray = $this->serializer->normalize($updates);
            foreach ($updatesArray as $updateKey => $updateValue) {
                if ($this->isUpdateKeyExcluded($updateKey)) {
                    continue;
                }
                $this->moveUpdateToUserEntity($updateKey, $updateValue, $user);
            }
        } catch (ExceptionInterface $e) {
            exit('Error ' . $e->getCode() . ': ' . $e->getMessage());
        }
        $entityManager->flush();
    }

    /**
     * @param string $updateKey
     * @return bool
     */
    private function isUpdateKeyExcluded(string $updateKey): bool
    {
        return $updateKey === 'user' || $updateKey === 'id' || $updateKey === 'token' || $updateKey === 'expiresAt';
    }

    /**
     * @param string $updateKey
     * @param string|null $updateValue
     * @param User $user
     * @return void
     */
    private function moveUpdateToUserEntity(string $updateKey, ?string $updateValue, User $user): void
    {
        switch ($updateKey) {
            case 'name':
                $user->setName($updateValue);
                break;
            case 'email':
                $user->setEmail($updateValue);
                break;
            case 'password':
                if ($updateValue) {
                    $user->setPassword($updateValue);
                }
                break;
            case 'tel_prefix':
                $user->setTelPrefix($updateValue);
                break;
            case 'tel':
                $user->setTel($updateValue);
                break;
        }
    }

    /**
     * @param UserDataUpdates $updates
     * @return void
     */
    private function removeTemporaryData(UserDataUpdates $updates): void
    {
        $entityManager = $this->doctrine->getManager();
        $entityManager->remove($updates);
        $entityManager->flush();
    }
}

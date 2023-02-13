<?php

namespace App\Controller\API;

use App\Entity\UserDataUpdates;
use App\Service\EmailService;
use App\Service\TokenGeneratorService;
use DateTimeImmutable;
use Doctrine\Persistence\ManagerRegistry;
use Error;
use Exception;
use FOS\RestBundle\Controller\Annotations\Route as Rest;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * @property EmailService $emailService
 * @property TokenGeneratorService $tokenGenerator
 * @property SerializerInterface $serializer
 */
#[Rest('/api')]
class UserApiController extends ApiController
{
    public function __construct(
        ManagerRegistry       $doctrine,
        EmailService          $emailService,
        TokenGeneratorService $tokenGenerator,
        SerializerInterface   $serializer
    )
    {
        parent::__construct($doctrine);
        $this->emailService = $emailService;
        $this->tokenGenerator = $tokenGenerator;
        $this->serializer = $serializer;
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
            return $this->json(['error' => 'Permission denied'], 401);
        }
    }

    #[Rest('/change-user-data', name: 'user_data_change', methods: ['POST'])]
    public function userDataChange(Request $request): JsonResponse
    {
        $user = $this->getUser();
        if ($user) {
            $content = json_decode($request->getContent(), true);
            if (!$content) {
                return $this->json(['error' => 'Method not allowed'], 405);
            }


            if ($this->passwordFieldsExist($content)) {
                $passwordValidationError = $this->validateNewPassword($content['newPassword'], $content['newPasswordRepeated']);
                if ($passwordValidationError) {
                    return $this->json(['error' => $passwordValidationError], 400);
                }
            }

            $this->saveUserDataUpdatesInDb($user, $content);
            $savedUpdates = $this->doctrine->getRepository(UserDataUpdates::class)->findOneBy([
                'user' => $user
            ]);

            if ($_ENV['APP_ENV'] !== 'test') {
                try {
                    $this->sendUserDataChangeConfirmationEmail($user->getUserIdentifier(), $savedUpdates);
                } catch (TransportExceptionInterface $e) {
                    exit('Error ' . $e->getCode() . ': ' . $e->getMessage() . ': ');
                }
            }

            return $this->json(['status' => 200]);
        } else {
            return $this->json(['error' => 'Permission denied'], 401);
        }
    }

    /**
     * @param array $content
     * @return bool
     */
    private function passwordFieldsExist(array $content): bool
    {
        return array_key_exists('oldPassword', $content) && array_key_exists('newPassword', $content)
            && array_key_exists('newPasswordRepeated', $content);
    }

    /**
     * @param string $newPassword
     * @param string $newPasswordRepeated
     * @return string|null
     */
    private function validateNewPassword(string $newPassword, string $newPasswordRepeated): ?string
    {
        if ($newPassword !== $newPasswordRepeated) {
            return 'New password and repeated new password must be the same';
        } elseif (!$this->validatePasswordFormat($newPassword)) {
            return 'Incorrect password format. Password must have at least eight characters and one or more: lowercase letter, uppercase letter, digit, special sign.';
        } else {
            return null;
        }
    }

    /**
     * @param string $password
     * @return bool
     */
    private function validatePasswordFormat(string $password): bool
    {
        if (strlen($password) < 8) {
            return false;
        } elseif (!preg_match('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).*$/', $password)) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * @param UserDataUpdates $updates
     * @param string $updateKey Column name in table
     * @param string|null $updateValue Column value
     * @return void
     */
    private function setUserDataUpdate(UserDataUpdates $updates, string $updateKey, ?string $updateValue): void
    {
        switch ($updateKey) {
            case 'name':
                $updates->setName($updateValue);
                break;
            case 'email':
                $updates->setEmail($updateValue);
                break;
            case 'tel_prefix':
                $updates->setTelPrefix($updateValue);
                break;
            case 'tel':
                $updates->setTel($updateValue);
                break;
            default:
                throw new Error('Column ' . '"' . $updateKey . '"' . ' does not exist in table');
        }
    }

    /**
     * @param UserInterface $user
     * @param array $content
     * @return void
     */
    private function saveUserDataUpdatesInDb(UserInterface $user, array $content): void
    {
        $updates = new UserDataUpdates();
        $userFromDb = $this->getUserFromDb($user);
        $updates->setUser($userFromDb);
        foreach ($content as $updateKey => $updateValue) {
            if ($updateKey === 'oldPassword' || $updateKey === 'newPassword' || $updateKey === 'newPasswordRepeated') {
                continue;
            }
            $this->setUserDataUpdate($updates, $updateKey, $updateValue);
        }
        $updates->setName($content['name']);
        $updates->setEmail($content['email']);
        $updates->setTelPrefix($content['tel_prefix']);
        $updates->setTel($content['tel']);
        if (array_key_exists('newPassword', $content)) {
            if ($_ENV['APP_ENV'] === 'test') {
                $updates->setPassword($content['newPassword']);
            } else {
                $hashedPassword = password_hash($content['newPassword'], PASSWORD_DEFAULT);
                $updates->setPassword($hashedPassword);
            }
        }
        $updates->setExpiresAt((new DateTimeImmutable())->modify('+2 hours'));
        $updates->setToken($this->tokenGenerator->generateToken());

        $entityManager = $this->doctrine->getManager();
        $entityManager->persist($updates);
        $entityManager->flush();
    }

    /**
     * @param string $userEmail
     * @param UserDataUpdates $updates
     * @return void
     * @throws TransportExceptionInterface
     */
    private function sendUserDataChangeConfirmationEmail(string $userEmail, UserDataUpdates $updates): void
    {
        $updatesToShow = [];
        $updatesArr = $this->serializer->normalize(
            $updates,
            null,
            [AbstractNormalizer::IGNORED_ATTRIBUTES => [
                'id',
                'user',
                'tel',
                'token',
                'expiresAt'
            ]]
        );
        foreach ($updatesArr as $updateKey => $updateValue) {
            try {
                $this->setUserDataUpdatesToShowInEmailTemplate($updates, $updateKey, $updateValue, $updatesToShow);
            } catch (Exception $e) {
                exit('Error: ' . $e->getMessage());
            }
        }

        $this->emailService->sendMessageToUser(
            $userEmail,
            'Moje-Tabsy.pl – zmiana danych użytkownika',
            'emails/user_data_change.txt.twig',
            'emails/user_data_change.html.twig',
            [
                'user_data_change_url' => $_ENV['HOST_URL'] . '/user-data-change/' . $updates->getToken(),
                'updates' => $updatesToShow
            ]
        );
    }

    /**
     * @param UserDataUpdates $updates
     * @param string $updateKey
     * @param string|null $updateValue
     * @param array $updatesToShow
     * @return void
     * @throws Exception
     */
    private function setUserDataUpdatesToShowInEmailTemplate(UserDataUpdates $updates, string $updateKey, ?string $updateValue, array &$updatesToShow): void
    {
        switch ($updateKey) {
            case 'name':
                $updatesToShow[] = ['Imię' => $updateValue];
                break;
            case 'email':
                $updatesToShow[] = ['Adres email' => $updateValue];
                break;
            case 'password':
                if ($updateValue) {
                    $updatesToShow[] = ['Hasło' => '*********'];
                }
                break;
            case 'telPrefix':
                if ($updateValue) {
                    $updatesToShow[] = ['Nr tel' => '+' . $updates->getTelPrefix() . ' ' . $updates->getTel()];
                }
                break;
            default:
                throw new Exception('Unexpected key ' . '"' . $updateKey . '"' . ' in user data updates array');
        }
    }
}
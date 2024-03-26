<?php

namespace App\Controller\API;

use App\Entity\MobileAppUser;
use App\Entity\QrLoginToken;
use App\Entity\User;
use FOS\RestBundle\Controller\Annotations\Route as Rest;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

#[Rest('/api')]
class MobileAppUserApiController extends ApiController
{
    #[Rest('/login', name: 'login_in_mobile_app', methods: ['POST'])]
    public function loginInMobileApp(Request $request): JsonResponse // connection with notifier mobile app
    {
        $content = json_decode($request->getContent(), true);
        if ($content) {
            $user = $this->doctrine->getRepository(User::class)->findOneBy([
                'email' => $content['email']
            ]);

            if (!$user) {
                return $this->json(['error' => 'Nie znaleziono użytkownika'], 400);
            } else {
                if (!$this->verifyUserPasswordFromMobileApp($content['email'], $content['password'], $user)) {
                    return $this->json(['error' => 'Nieprawidłowe hasło'], 400);
                } elseif (!$this->checkIfAccountIsActive($user)) {
                    return $this->json(['error' => 'Aby móc się zalogować, musisz aktywować swoje konto'], 400);
                }
            }

            $this->removeFromDbMobileAppUserLoggedEarlier($user);

            $this->saveMobileAppUserAppInDb($user, $content['token']);

            return $this->json([
                'status' => 200,
                'user_id' => $user->getEmail()
            ]);
        } else {
            return $this->json(['error' => 'Method not allowed'], 405);
        }
    }

    #[Rest('/logout', name: 'logout_in_mobile_app', methods: ['POST'])]
    public function logoutInMobileApp(Request $request): JsonResponse
    {
        $content = json_decode($request->getContent(), true);
        if ($content) {
            $user = $this->doctrine->getRepository(User::class)->findOneBy([
                'email' => $content['userId']
            ]);
            if (!$user) {
                return $this->json(['error' => 'User was not found'], 404);
            }

            $mobileAppUser = $this->doctrine->getRepository(MobileAppUser::class)->findOneBy([
                'user' => $user
            ]);
            if (!$mobileAppUser) {
                return $this->json(['error' => 'User is already logged out'], 400);
            }

            $this->removeFromDbMobileAppUser($mobileAppUser);

            return $this->json([
                'status' => 200,
                'message' => 'Successfully logged out'
            ]);
        } else {
            return $this->json(['error' => 'Method not allowed'], 405);
        }
    }

    #[Rest('/login-auto', name: 'login_in_mobile_app_auto', methods: ['POST'])]
    public function loginInMobileAppAutomatically(Request $request): JsonResponse
    {
        $content = json_decode($request->getContent(), true);
        if ($content) {
            $userEmail = $this->getEmailOfMobileAppUserLoggedInCurrentDevice($content['token']);
            if ($userEmail) {
                return $this->json([
                    'status' => 200,
                    'user_id' => $userEmail
                ]);
            }
            return $this->json([
                'status' => 200,
                'message' => 'Mobile app user is not logged in'
            ]);
        } else {
            return $this->json(['error' => 'Method not allowed'], 405);
        }
    }

    #[Rest('/login-qr', name: 'login_in_mobile_app_qr', methods: ['POST'], schemes: ['https'])]
    public function loginInMobileAppByQrCode(Request $request): JsonResponse
    {
        $token = $request->query->get('token');
        $requestedUserId = $request->query->get('userId');
        $savedToken = $this->doctrine->getRepository(QrLoginToken::class)->findOneBy(['token' => $token]);

        if ($savedToken) {
            $userId = $savedToken->getUser()->getEmail();
            $savedTokenContent = $savedToken->getToken();
            if ($userId === $requestedUserId && $savedTokenContent === $token) {
                $user = $savedToken->getUser();
                $this->removeFromDbMobileAppUserLoggedEarlier($user);

                $this->saveMobileAppUserAppInDb($user, $token);

                return $this->json([
                    'status' => 200,
                    'user_id' => $userId
                ]);
            }
        }

        return $this->json(['error' => 'Incorrect token or user id'], 400);
    }

    /**
     * @param User $user
     * @return bool
     */
    private function checkIfAccountIsActive(User $user): bool
    {
        return $user->isActivated() && !$user->isResetPassModeEnabled();
    }

    /**
     * @param string $email
     * @param string $password
     * @param User $foundUser
     * @return bool
     */
    private function verifyUserPasswordFromMobileApp(string $email, string $password, User $foundUser): bool
    {
        if ($_ENV['APP_ENV'] === 'test') {
            $verifiedUser = $this->doctrine->getRepository(User::class)->findByEmailAndPassword(
                $email,
                $password
            );
            return (bool)$verifiedUser;
        } else {
            return password_verify($password, $foundUser->getPassword());
        }
    }

    /**
     * @param User $user
     * @param string $token
     * @return void
     */
    private function saveMobileAppUserAppInDb(User $user, string $token): void
    {
        $mobileAppUser = new MobileAppUser();
        $mobileAppUser->setUser($user);
        $mobileAppUser->setToken($token);
        $entityManager = $this->doctrine->getManager();
        $entityManager->persist($mobileAppUser);
        $entityManager->flush();
    }

    /**
     * @param string $token
     * @return string|null
     */
    private function getEmailOfMobileAppUserLoggedInCurrentDevice(string $token): ?string
    {
        $mobileAppUser = $this->doctrine->getRepository(MobileAppUser::class)->findOneBy([
            'token' => $token
        ]);

        if ($mobileAppUser) {
            return $mobileAppUser->getUser()->getEmail();
        } else {
            return null;
        }
    }

    /**
     * @param MobileAppUser $mobileAppUser
     * @return void
     */
    private function removeFromDbMobileAppUser(MobileAppUser $mobileAppUser): void
    {
        $entityManager = $this->doctrine->getManager();
        $entityManager->remove($mobileAppUser);
        $entityManager->flush();
    }

    /**
     * @param User $user
     * @return void
     */
    private function removeFromDbMobileAppUserLoggedEarlier(User $user): void
    {
        $mobileAppUserLoggedEarlier = $this->doctrine->getRepository(MobileAppUser::class)->findOneBy([
            'user' => $user
        ]);
        if ($mobileAppUserLoggedEarlier) {
            $this->removeFromDbMobileAppUser($mobileAppUserLoggedEarlier);
        }
    }
}
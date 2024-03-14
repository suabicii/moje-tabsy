<?php

namespace App\Tests\Controller\API;

use App\Entity\MobileAppUser;
use App\Entity\User;
use App\Tests\ControllerTestTrait;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class MobileAppUserApiControllerTest extends WebTestCase
{
    use ControllerTestTrait;

    public function testLoginInMobileApp(): void
    {
        $userEmail = 'dummy@email3.com';
        $this->client->request(
            'POST',
            '/api/login',
            [],
            [],
            [],
            json_encode([
                'email' => $userEmail,
                'password' => 'Password123!',
                'token' => 'some_token'
            ])
        );

        $response = $this->client->getResponse();
        $responseData = json_decode($response->getContent(), true);

        $this->assertResponseIsSuccessful();
        $this->assertEquals(
            [
                'status' => 200,
                'user_id' => $userEmail
            ],
            $responseData
        );
    }

    public function testSaveInDbMobileAppUser(): void
    {
        $userEmail = 'dummy@email3.com';
        $this->client->request(
            'POST',
            '/api/login',
            [],
            [],
            [],
            json_encode([
                'email' => $userEmail,
                'password' => 'Password123!',
                'token' => 'another_token'
            ])
        );

        $user = $this->entityManager->getRepository(User::class)->findOneBy([
            'email' => $userEmail
        ]);
        $mobileAppUser = $this->entityManager->getRepository(MobileAppUser::class)->findOneBy([
            'user' => $user
        ]);

        $this->assertNotNull($mobileAppUser);
    }

    public function testRemoveMobileAppUserBeforeLoginIfUserLoggedEarlierInOtherDevice(): void
    {
        $userEmail = 'john@doe.com';
        $user = $this->entityManager->getRepository(User::class)->findOneBy([
            'email' => $userEmail
        ]);
        $mobileAppUserLoggedEarlier = $this->entityManager->getRepository(MobileAppUser::class)->findOneBy([
            'user' => $user
        ]);

        $this->client->request(
            'POST',
            '/api/login',
            [],
            [],
            [],
            json_encode([
                'email' => $userEmail,
                'password' => 'Password123!',
                'token' => 'new_token'
            ])
        );

        $mobileAppUserLoggedJustNow = $this->entityManager->getRepository(MobileAppUser::class)->findOneBy([
            'user' => $user
        ]);

        $this->assertResponseIsSuccessful();
        $this->assertNotEquals($mobileAppUserLoggedJustNow, $mobileAppUserLoggedEarlier);
    }

    public function testGetErrorIfUserSubmitWrongEmailInMobileApp(): void
    {
        $this->client->request(
            'POST',
            '/api/login',
            [],
            [],
            [],
            json_encode([
                'email' => 'this.mail.is@wrong.com',
                'password' => 'SomePassword123!',
                'token' => 'someToken'
            ])
        );

        $response = $this->client->getResponse();
        $responseData = json_decode($response->getContent(), true);

        $this->assertResponseStatusCodeSame(400);
        $this->assertEquals(['error' => 'Nie znaleziono użytkownika'], $responseData);
    }

    public function testGetErrorIfUserSubmitWrongPasswordInMobileApp(): void
    {
        $this->client->request(
            'POST',
            '/api/login',
            [],
            [],
            [],
            json_encode([
                'email' => 'john@doe.com',
                'password' => 'IncorrectPassword',
                'token' => 'someToken'
            ])
        );

        $response = $this->client->getResponse();
        $responseData = json_decode($response->getContent(), true);

        $this->assertResponseStatusCodeSame(400);
        $this->assertEquals(['error' => 'Nieprawidłowe hasło'], $responseData);
    }

    public function testGetErrorIfInactivateUserTriesToLogInInMobileApp(): void
    {
        $this->client->request(
            'POST',
            '/api/login',
            [],
            [],
            [],
            json_encode([
                'email' => 'dummy@email.com',
                'password' => 'Password123!',
                'token' => 'someToken'
            ])
        );

        $response = $this->client->getResponse();
        $responseData = json_decode($response->getContent(), true);

        $this->assertResponseStatusCodeSame(400);
        $this->assertEquals(['error' => 'Aby móc się zalogować, musisz aktywować swoje konto'], $responseData);
    }

    public function testGetErrorIfUserTriesToLogInInMobileAppBySendingEmptyObject(): void
    {
        $this->client->request('POST', '/api/login');

        $response = $this->client->getResponse();
        $responseData = json_decode($response->getContent(), true);

        $this->assertResponseStatusCodeSame(405);
        $this->assertEquals(['error' => 'Method not allowed'], $responseData);
    }

    public function testLogoutInMobileAppAndRemoveMobileUserFromDb(): void
    {
        $userEmail = 'dummy@email3.com';
        $this->client->request(
            'POST',
            '/api/logout',
            [],
            [],
            [],
            json_encode(['userId' => $userEmail])
        );

        $user = $this->entityManager->getRepository(User::class)->findOneBy([
            'email' => $userEmail
        ]);
        $mobileAppUser = $this->entityManager->getRepository(MobileAppUser::class)->findOneBy([
            'user' => $user
        ]);
        $response = $this->client->getResponse();
        $responseData = json_decode($response->getContent(), true);

        $this->assertResponseIsSuccessful();
        $this->assertEquals(
            [
                'status' => 200,
                'message' => 'Successfully logged out'
            ],
            $responseData
        );
        $this->assertNull($mobileAppUser);
    }

    public function testGetLogoutErrorIfNoDataWasSent(): void
    {
        $this->client->request('POST', '/api/logout');

        $response = $this->client->getResponse();
        $responseData = json_decode($response->getContent(), true);

        $this->assertResponseStatusCodeSame(405);
        $this->assertEquals(['error' => 'Method not allowed'], $responseData);
    }

    public function testGetLogoutErrorIfUserDoesNotExist(): void
    {
        $this->client->request(
            'POST',
            '/api/logout',
            [],
            [],
            [],
            json_encode(['userId' => 'this.should@fail.com'])
        );

        $response = $this->client->getResponse();
        $responseData = json_decode($response->getContent(), true);

        $this->assertResponseStatusCodeSame(404);
        $this->assertEquals(['error' => 'User was not found'], $responseData);
    }

    public function testGetLogoutErrorIfUserIsAlreadyLoggedOut(): void
    {
        $this->client->request(
            'POST',
            '/api/logout',
            [],
            [],
            [],
            json_encode(['userId' => 'john@doe.com'])
        );

        $response = $this->client->getResponse();
        $responseData = json_decode($response->getContent(), true);

        $this->assertResponseStatusCodeSame(400);
        $this->assertEquals(['error' => 'User is already logged out'], $responseData);
    }

    public function testLoginInMobileAppAutomatically(): void
    {
        $userEmail = 'dummy@email3.com';
        $this->client->request(
            'POST',
            '/api/login-auto',
            [],
            [],
            [],
            json_encode(['token' => '123xyz456abc'])
        );

        $response = $this->client->getResponse();
        $responseData = json_decode($response->getContent(), true);

        $this->assertResponseIsSuccessful();
        $this->assertEquals(
            [
                'status' => 200,
                'user_id' => $userEmail
            ],
            $responseData
        );
    }

    public function testDoNotLoginInMobileAppAutomaticallyIfTokenWasNotFound(): void
    {
        $this->client->request(
            'POST',
            '/api/login-auto',
            [],
            [],
            [],
            json_encode(['token' => 'this_token_does_not_exist_in_db'])
        );

        $response = $this->client->getResponse();
        $responseData = json_decode($response->getContent(), true);

        $this->assertResponseIsSuccessful();
        $this->assertEquals(
            [
                'status' => 200,
                'message' => 'Mobile app user is not logged in'
            ],
            $responseData
        );
    }

    public function testGetMobileAppUserAutoLoginErrorIfRequestDoesNotContainToken(): void
    {
        $this->client->request('POST', '/api/login-auto');

        $response = $this->client->getResponse();
        $responseData = json_decode($response->getContent(), true);

        $this->assertResponseStatusCodeSame(405);
        $this->assertEquals(['error' => 'Method not allowed'], $responseData);
    }

    public function testLoginInMobileAppByQrCode(): void
    {
        $token = '123abc321xyz';
        $userId = 'john@doe.com';
        $user = $this->entityManager->getRepository(User::class)->findOneBy(['email' => $userId]);
        $this->client->loginUser($user);
        $this->client->request(
            'POST',
            "/api/login-qr?token=$token&userId=$userId",
            [],
            [],
            ['HTTPS' => true]
        );

        $response = $this->client->getResponse();
        $responseData = json_decode($response->getContent(), true);

        $this->assertResponseIsSuccessful();
        $this->assertEquals(
            [
                'status' => 200,
                'user_id' => $userId
            ],
            $responseData
        );
    }

    public function testSaveUserLoggedByQrCodeInDatabase(): void
    {
        $token = '123abc321xyz';
        $userId = 'john@doe.com';
        $user = $this->entityManager->getRepository(User::class)->findOneBy(['email' => $userId]);
        $this->client->loginUser($user);
        $this->client->request(
            'POST',
            "/api/login-qr?token=$token&userId=$userId",
            [],
            [],
            ['HTTPS' => true]
        );

        $mobileAppUser = $this->entityManager->getRepository(MobileAppUser::class)->findOneBy(['token' => $token]);

        $this->assertResponseIsSuccessful();
        $this->assertNotNull($mobileAppUser);
    }

    public function testGetQrLoginErrorWhenUserIdAndTokenAreIncorrect(): void
    {
        $token = 'incorrect_token';
        $userId = 'incorrect@email.com';
        $this->client->request(
            'POST',
            "/api/login-qr?token=$token&userId=$userId",
            [],
            [],
            ['HTTPS' => true]
        );

        $response = $this->client->getResponse();
        $responseData = json_decode($response->getContent(), true);

        $this->assertResponseStatusCodeSame(400);
        $this->assertEquals(['error' => 'Incorrect token or user id'], $responseData);
    }
}

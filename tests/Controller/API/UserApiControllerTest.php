<?php

namespace App\Tests\Controller\API;

use App\Entity\UserDataUpdates;
use App\Tests\ApiControllerTestTrait;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class UserApiControllerTest extends WebTestCase
{
    use ApiControllerTestTrait;

    public function testGetLoggedUserDataFromApi(): void
    {
        $this->client->request('GET', '/api/user-data');

        $response = $this->client->getResponse();
        $responseData = json_decode($response->getContent(), true);

        $this->assertResponseIsSuccessful();
        $this->assertEquals([
            'name' => 'Evan',
            'email' => 'dummy@email3.com'
        ], $responseData);
    }

    public function testGetErrorWhenNotLoggedUserTriesToGetUserDataFromApi(): void
    {
        $this->client->request('GET', '/logout');

        $this->client->request('GET', '/api/user-data');
        $response = $this->client->getResponse();
        $responseData = json_decode($response->getContent(), true);

        $this->assertResponseStatusCodeSame(401);
        $this->assertEquals(['error' => 'Permission denied'], $responseData);
    }

    public function testSaveTemporarilyUserDataUpdatesInSeparateTable(): void
    {
        $newUserData = $this->getNewUserData();

        $this->client->request(
            'POST',
            '/api/change-user-data',
            [],
            [],
            [],
            json_encode($newUserData),
        );
        $updates = $this->entityManager->getRepository(UserDataUpdates::class)->findOneBy([
            'user' => $this->user
        ]);

        $this->assertResponseIsSuccessful();
        $this->assertNotNull($updates);
    }

    public function testGetErrorIfNotLoggedUserTriesToEditUserData(): void
    {
        $this->client->request('GET', '/logout');
        $newUserData = [
            'name' => 'Devan',
            'email' => 'new@email.com',
        ];

        $this->client->request(
            'POST',
            '/api/change-user-data',
            [],
            [],
            [],
            json_encode($newUserData)
        );
        $response = $this->client->getResponse();
        $responseData = json_decode($response->getContent(), true);


        $this->assertResponseStatusCodeSame(401);
        $this->assertEquals(['error' => 'Permission denied'], $responseData);
    }

    public function testGetErrorIfUserTriesToEditUserDataBySendingEmptyObject(): void
    {
        $this->client->request('POST', '/api/change-user-data');

        $response = $this->client->getResponse();
        $responseData = json_decode($response->getContent(), true);


        $this->assertResponseStatusCodeSame(405);
        $this->assertEquals(['error' => 'Method not allowed'], $responseData);
    }

    /**
     * @return array
     */
    private function getNewUserData(): array
    {
        return [
            'name' => 'Devan',
            'email' => 'new@email.com',
            'oldPassword' => 'Password123!',
            'newPassword' => 'Password321!',
            'newPasswordRepeated' => 'Password321!'
        ];
    }
}

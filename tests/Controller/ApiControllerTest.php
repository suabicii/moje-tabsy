<?php

namespace App\Tests\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManager;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * @property KernelBrowser $client
 * @property ContainerInterface $container
 * @property EntityManager $entityManager
 */
class ApiControllerTest extends WebTestCase
{
    protected function setUp(): void
    {
        $this->client = static::createClient();
        $this->container = $this->client->getContainer();
        $this->entityManager = $this->container->get('doctrine.orm.entity_manager');
        $this->createAuthorizedClient();
    }

    public function testGetLoggedUserDataFromApi(): void
    {
        $this->client->request('GET', '/api/user-data');

        $response = $this->client->getResponse();
        $responseData = json_decode($response->getContent(), true);

        $this->assertResponseIsSuccessful();
        $this->assertEquals([
            'name' => 'Evan',
            'email' => 'dummy@email3.com',
            'tel_prefix' => null,
            'tel' => null
        ], $responseData);
    }

    public function testGetErrorWhenNotLoggedUserTriesToGetUserDataFromApi(): void
    {
        $this->client->request('GET', '/logout');

        $this->client->request('GET', '/api/user-data');
        $response = $this->client->getResponse();
        $responseData = json_decode($response->getContent(), true);

        $this->assertResponseIsSuccessful();
        $this->assertEquals(['error' => 'No user was found'], $responseData);
    }

    protected function tearDown(): void
    {
        parent::tearDown();

        // avoid memory leaks
        $this->entityManager->close();
        $this->entityManager = null;
    }

    private function createAuthorizedClient()
    {
        $user = $this->entityManager->getRepository(User::class)->findOneBy(['email' => 'dummy@email3.com']);
        $this->client->loginUser($user);
    }
}

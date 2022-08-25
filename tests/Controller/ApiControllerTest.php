<?php

namespace App\Tests\Controller;

use App\Entity\Drug;
use App\Entity\User;
use Doctrine\ORM\EntityManager;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * @property KernelBrowser $client
 * @property ContainerInterface $container
 * @property EntityManager $entityManager
 * @property User $user
 */
class ApiControllerTest extends WebTestCase
{
    protected function setUp(): void
    {
        $this->client = static::createClient();
        $this->container = $this->client->getContainer();
        $this->entityManager = $this->container->get('doctrine.orm.entity_manager');
        $this->user = $this->createAuthorizedClient();
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

    public function testGetDrugListRelatedToLoggedUser(): void
    {
        $this->client->request('GET', '/api/drug-list');

        $response = $this->client->getResponse();
        $responseData = json_decode($response->getContent(), true);
        $drugList = $this->entityManager->getRepository(Drug::class)->findDrugsRelatedToUser($this->user);

        $this->assertResponseIsSuccessful();
        $this->assertEquals($drugList, $responseData);
    }

    public function testGetErrorIfNotLoggedUserTriesToGetDrugList(): void
    {
        $this->client->request('GET', '/logout');

        $this->client->request('GET', '/api/drug-list');
        $response = $this->client->getResponse();
        $responseData = json_decode($response->getContent(), true);

        $this->assertResponseIsSuccessful();
        $this->assertEquals(['error' => 'Permission denied'], $responseData);
    }

    public function testAddNewDrug(): void
    {
        $drugs = $this->entityManager->getRepository(Drug::class)->findDrugsRelatedToUser($this->user);
        $drugsAmountBeforeAdding = sizeof($drugs);

        $newDrug = $this->getNewDrugData();
        $this->client->request(
            'POST',
            '/api/add-drug',
            [],
            [],
            [],
            json_encode($newDrug)
        );
        $drugs = $this->entityManager->getRepository(Drug::class)->findDrugsRelatedToUser($this->user);
        $drugsAmountAfterAdding = sizeof($drugs);

        $this->assertResponseIsSuccessful();
        $this->assertGreaterThan($drugsAmountBeforeAdding, $drugsAmountAfterAdding);
    }

    public function testGetErrorIfNotLoggedUserTriesToAddNewDrug(): void
    {
        $this->client->request('GET', '/logout');

        $this->client->request('POST', '/api/add-drug');
        $response = $this->client->getResponse();
        $responseData = json_decode($response->getContent(), true);

        $this->assertResponseIsSuccessful();
        $this->assertEquals(['error' => 'Adding drug failed'], $responseData);
    }

    public function testEditDrug(): void
    {
        $updates = [
            'name' => 'Potassium',
            'quantity' => 50
        ];

        $this->client->request(
            'PUT',
            '/api/edit-drug/1',
            [],
            [],
            [],
            json_encode($updates)
        );
        $drug = $this->entityManager->getRepository(Drug::class)->find(1);
        $updatedData = [
            'name' => $drug->getName(),
            'quantity' => $drug->getQuantity()
        ];

        $this->assertResponseIsSuccessful();
        $this->assertEquals($updates, $updatedData);
    }

    public function testGetErrorIfNotLoggedUserTriesToEditDrug(): void
    {
        $this->client->request('GET', '/logout');
        $update = ['name' => "It won't work"];

        $this->client->request(
            'PUT',
            '/api/edit-drug/1',
            [],
            [],
            [],
            json_encode($update)
        );
        $response = $this->client->getResponse();
        $responseData = json_decode($response->getContent(), true);

        $this->assertResponseIsSuccessful();
        $this->assertEquals(['error' => 'Only logged users can edit drugs'], $responseData);
    }

    public function testGetErrorIfDrugIdIsNotFound(): void
    {
        $update = ['name' => "It won't work"];
        $incorrectDrugId = '2077';
        $this->client->request(
            'PUT',
            '/api/edit-drug/' . $incorrectDrugId,
            [],
            [],
            [],
            json_encode($update)
        );
        $response = $this->client->getResponse();
        $responseData = json_decode($response->getContent(), true);

        $this->assertResponseIsSuccessful();
        $this->assertEquals(['error' => 'Drug with id: ' . $incorrectDrugId . ' not found'], $responseData);
    }

    protected function tearDown(): void
    {
        parent::tearDown();

        // avoid memory leaks
        $this->entityManager->close();
        $this->entityManager = null;
    }

    /**
     * @return array
     */
    private function getNewDrugData(): array
    {
        return [
            'name' => 'CBD Oil',
            'quantity' => 25,
            'quantityMax' => 30,
            'unit' => 'ml.',
            'dosing' => 3,
            'dosingMoments' => [
                'hour1' => '08:00',
                'hour2' => '18:00',
                'hour3' => '22:00'
            ]
        ];
    }

    private function createAuthorizedClient()
    {
        $user = $this->entityManager->getRepository(User::class)->findOneBy(['email' => 'dummy@email3.com']);
        $this->client->loginUser($user);
        return $user;
    }
}

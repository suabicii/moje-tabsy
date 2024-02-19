<?php

namespace App\Tests\Controller\API;

use App\Entity\Drug;
use App\Entity\User;
use App\Tests\ControllerTestTrait;
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
class DrugApiControllerTest extends WebTestCase
{
    use ControllerTestTrait;

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

        $this->assertResponseStatusCodeSame(401);
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

        $this->assertResponseStatusCodeSame(401);
        $this->assertEquals(['error' => 'Adding drug failed'], $responseData);
    }

    public function testGetErrorIfUserTriesToAddNewDrugWithEmptyObject(): void
    {
        $this->client->request('POST', '/api/add-drug');
        $response = $this->client->getResponse();
        $responseData = json_decode($response->getContent(), true);

        $this->assertResponseStatusCodeSame(405);
        $this->assertEquals(['error' => 'Method not allowed'], $responseData);
    }

    public function testGetErrorIfUserTriesToAddNewDrugWithIncorrectData(): void
    {
        $incorrectData = [
            'incorrectData1' => 'value1',
            'incorrectData2' => 'value2'
        ];

        $this->client->request(
            'POST',
            '/api/add-drug',
            [],
            [],
            [],
            json_encode($incorrectData)
        );

        $this->assertResponseStatusCodeSame(500);
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

        $this->assertResponseStatusCodeSame(401);
        $this->assertEquals(['error' => 'Only logged users can edit drugs'], $responseData);
    }

    public function testGetErrorIfDrugIdFromEditUrlIsNotFound(): void
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

        $this->assertResponseStatusCodeSame(404);
        $this->assertEquals(['error' => 'Drug with id: ' . $incorrectDrugId . ' not found'], $responseData);
    }

    public function testGetErrorIfUserTriesToEditDrugDataBySendingEmptyObject()
    {
        $this->client->request('PUT', '/api/edit-drug/1');
        $response = $this->client->getResponse();
        $responseData = json_decode($response->getContent(), true);

        $this->assertResponseStatusCodeSame(405);
        $this->assertEquals(['error' => 'Method not allowed'], $responseData);
    }

    public function testDeleteDrug(): void
    {
        $drugs = $this->entityManager->getRepository(Drug::class)->findDrugsRelatedToUser($this->user);
        $drugsAmountBeforeDelete = sizeof($drugs);

        $this->client->request('DELETE', '/api/delete-drug/1');
        $drugs = $this->entityManager->getRepository(Drug::class)->findDrugsRelatedToUser($this->user);
        $drugsAmountAfterDelete = sizeof($drugs);

        $this->assertResponseIsSuccessful();
        $this->assertLessThan($drugsAmountBeforeDelete, $drugsAmountAfterDelete);
    }

    public function testGetErrorWhenNotLoggedUserTriesToDeleteDrug(): void
    {
        $this->client->request('GET', '/logout');

        $this->client->request('DELETE', '/api/delete-drug/1');
        $response = $this->client->getResponse();
        $responseData = json_decode($response->getContent(), true);

        $this->assertResponseStatusCodeSame(401);
        $this->assertEquals(['error' => 'Removing drug failed'], $responseData);
    }

    public function testGetErrorIfDrugIdFromDeleteUrlIsNotFound(): void
    {
        $incorrectDrugId = '2077';

        $this->client->request('DELETE', '/api/delete-drug/' . $incorrectDrugId);
        $response = $this->client->getResponse();
        $responseData = json_decode($response->getContent(), true);

        $this->assertResponseStatusCodeSame(404);
        $this->assertEquals(['error' => 'Drug with id: ' . $incorrectDrugId . ' not found'], $responseData);
    }

    public function testGetDrugDataForNotifications(): void
    {
        $this->client->request('GET', '/api/drug-notify/123xyz456abc');

        $response = $this->client->getResponse();
        $responseData = json_decode($response->getContent(), true);
        $drugDataForNotifications = $this->getMockDrugDataForNotifications();

        $this->assertResponseIsSuccessful();
        $this->assertEquals($drugDataForNotifications, $responseData);
    }

    public function testGetErrorIfUserTriesToGetDrugDataForNotificationsWithIncorrectToken(): void
    {
        $this->client->request('GET', '/api/drug-notify/incorrect123Token456xyz');

        $response = $this->client->getResponse();
        $responseData = json_decode($response->getContent(), true);

        $this->assertResponseStatusCodeSame(404);
        $this->assertEquals(['error' => 'User is not logged in'], $responseData);
    }

    public function testConfirmThatGivenDrugHasBeenAlreadyTakenByReducingQuantity(): void
    {
        $drug = $this->entityManager->getRepository(Drug::class)->find(1);
        $drugQuantityBeforeConfirmation = $drug->getQuantity();
        $this->client->request('PUT', '/api/drug-taken/123xyz456abc/1');

        $response = $this->client->getResponse();
        $responseData = json_decode($response->getContent(), true);

        $this->assertResponseIsSuccessful();
        $this->assertEquals(['status' => 200], $responseData);
        $this->assertLessThan($drugQuantityBeforeConfirmation, $drug->getQuantity());
    }

    public function testDoNotReduceDrugQuantityInDrugDoseConfirmationIfQuantityIsNotGreaterThanZero(): void
    {
        $drug = $this->entityManager->getRepository(Drug::class)->find(4);
        $drugQuantityBeforeConfirmation = $drug->getQuantity();
        $this->client->request('PUT', '/api/drug-taken/123xyz456abc/4');

        $response = $this->client->getResponse();
        $responseData = json_decode($response->getContent(), true);

        $this->assertResponseIsSuccessful();
        $this->assertEquals(['status' => 200], $responseData);
        $this->assertEquals($drugQuantityBeforeConfirmation, $drug->getQuantity());
    }

    public function testGetErrorIfNotLoggedUserTriesToConfirmAboutDose(): void
    {
        $this->client->request('PUT', '/api/drug-taken/incorrect123Token456xyz/1');

        $response = $this->client->getResponse();
        $responseData = json_decode($response->getContent(), true);

        $this->assertResponseStatusCodeSame(404);
        $this->assertEquals(['error' => 'User is not logged in'], $responseData);
    }

    public function testGetErrorIfUserTriesToConfirmAboutDoseWithIncorrectDrugId(): void
    {
        $incorrectDrugId = 1000;
        $this->client->request('PUT', '/api/drug-taken/123xyz456abc/' . $incorrectDrugId);

        $response = $this->client->getResponse();
        $responseData = json_decode($response->getContent(), true);

        $this->assertResponseStatusCodeSame(404);
        $this->assertEquals(['error' => 'Drug related to given user with id: ' . $incorrectDrugId . ' not found'], $responseData);
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

    /**
     * @return array
     */
    private function getMockDrugDataForNotifications(): array
    {

        return json_decode('[
            {
                "id": 1,
                "name": "Magnesium",
                "dosing": 1,
                "unit": "pcs.",
                "dosingMoments":{
                    "hour1": "08:00",
                    "hour2": "18:00"
                }
            },
            {
                "id": 2,
                "name": "Vit. C",
                "dosing": 2,
                "unit": "pcs.",
                "dosingMoments":{
                    "hour1": "18:00"
                }
            },
            {
                "id": 3,
                "name": "Cough syrup",
                "dosing": 10,
                "unit": "ml.",
                "dosingMoments":{
                    "hour1": "18:00"
                }
            },
            {
                "id": 4,
                "name": "Vit. D",
                "dosing": 1,
                "unit": "pcs.",
                "dosingMoments":{
                    "hour1": "16:00"
                }
            }
        ]', true);
    }
}

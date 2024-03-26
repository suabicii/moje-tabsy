<?php

namespace App\Tests\Controller;

use App\Entity\QrLoginToken;
use App\Tests\ControllerTestTrait;
use Doctrine\ORM\Exception\ORMException;
use Doctrine\ORM\OptimisticLockException;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class QrCodeGeneratorControllerTest extends WebTestCase
{
    use ControllerTestTrait;

    public function testGenerateQrCode(): void
    {
        $crawler = $this->client->request('GET', '/qr-code');

        $this->assertStringContainsString('img', $crawler->html());
    }

    public function testShowErrorIfNotLoggedUserTriesToGetQrCode(): void
    {
        $this->client->request('GET', '/logout');
        $this->client->request('GET', '/qr-code');

        $this->assertResponseStatusCodeSame(401);
    }

    /**
     * @throws OptimisticLockException
     * @throws ORMException
     */
    public function testRemovePreviouslySavedTokenAndCreateNew(): void
    {
        $tokenContent = '043rehj89fwy';
        $this->createQrLoginTokenAndSaveInDb($tokenContent);

        $crawler = $this->client->request('GET', '/qr-code');
        $tokenAfterDeletion = $this->entityManager->getRepository(QrLoginToken::class)->findOneBy(['token' => $tokenContent]);

        $this->assertStringContainsString('img', $crawler->html());
        $this->assertNull($tokenAfterDeletion);
    }

    /**
     * @param string $tokenContent
     * @return void
     * @throws ORMException
     * @throws OptimisticLockException
     */
    private function createQrLoginTokenAndSaveInDb(string $tokenContent): void
    {
        $prevToken = new QrLoginToken();
        $prevToken->setToken($tokenContent);
        $prevToken->setUser($this->user);
        $this->entityManager->persist($prevToken);
        $this->entityManager->flush();
    }
}

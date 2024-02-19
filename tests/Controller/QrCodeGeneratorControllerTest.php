<?php

namespace App\Tests\Controller;

use App\Tests\ControllerTestTrait;
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
}

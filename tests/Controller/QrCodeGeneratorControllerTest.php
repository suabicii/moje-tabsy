<?php

namespace App\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class QrCodeGeneratorControllerTest extends WebTestCase
{
    public function testGenerateQrCode(): void
    {
        $client = $this->createClient();

        $crawler = $client->request('GET', '/qr-code');

        $this->assertStringContainsString('img', $crawler->html());
    }
}

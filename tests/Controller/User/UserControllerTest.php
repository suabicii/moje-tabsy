<?php

namespace App\Tests\Controller\User;

use App\Entity\User;
use Doctrine\ORM\EntityManager;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

/**
 * @property EntityManager $entityManager
 */
class UserControllerTest extends WebTestCase
{
    protected function setUp(): void
    {
        $this->client = static::createClient();
        $kernel = self::bootKernel();
        $this->entityManager = $kernel->getContainer()->get('doctrine')->getManager();
    }

    /**
     * @dataProvider provideUrls
     */
    public function testRedirectFromAnyUserControllerRouteToDashboardIfUserIsLoggedIn(string $url): void
    {
        self::ensureKernelShutdown();
        $client = static::createClient();
        $user = $this->entityManager->getRepository(User::class)->findOneBy(['email' => 'dummy@email2.com']);

        $client->loginUser($user);
        $crawler = $client->request('GET', $url);

        $this->assertResponseRedirects('/dashboard');
    }

    public function provideUrls(): array
    {
        return [
            ['/login'],
            ['/register'],
            ['/resend-activation-email'],
            ['/password-reset']
        ];
    }

    protected function tearDown(): void
    {
        parent::tearDown();

        // avoid memory leaks
        $this->entityManager->close();
        $this->entityManager = null;
    }
}

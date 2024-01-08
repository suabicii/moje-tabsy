<?php

namespace App\Tests\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManager;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

/**
 * @property EntityManager $entityManager
 */
class HomepageControllerTest extends WebTestCase
{
    protected function setUp(): void
    {
        $this->client = static::createClient();
        $kernel = self::bootKernel();
        $this->entityManager = $kernel->getContainer()->get('doctrine')->getManager();
    }

    public function testRedirectAnonymousUserToRegisterPage(): void
    {
        $this->client->request('GET', '/');

        $this->assertResponseRedirects('/register');
    }

    public function testRedirectLoggedUserToDashboard(): void
    {
        self::ensureKernelShutdown(); // avoid LogicException
        $client = static::createClient();

        $user = $this->entityManager->getRepository(User::class)->findOneBy(['email' => 'dummy@email3.com']);
        $client->loginUser($user);
        $client->request('GET', '/');

        $this->assertResponseRedirects('/dashboard');
    }

    protected function tearDown(): void
    {
        parent::tearDown();

        // avoid memory leaks
        $this->entityManager->close();
        $this->entityManager = null;
    }
}

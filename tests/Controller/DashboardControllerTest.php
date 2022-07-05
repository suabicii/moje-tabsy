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
class DashboardControllerTest extends WebTestCase
{
    protected function setUp(): void
    {
        $this->client = static::createClient();
        $this->container = $this->client->getContainer();
        $this->entityManager = $this->container->get('doctrine.orm.entity_manager');
        $this->createAuthorizedClient();
    }

    public function testRenderDashboardPage(): void
    {
        $this->client->request('GET', '/dashboard');

        $this->assertResponseIsSuccessful();
    }

    /**
     * @dataProvider provideReactRoutes
     */
    public function testRenderDashboardSubpageCreatedInReact(string $reactRoute): void
    {
        $this->client->request('GET', '/dashboard' . $reactRoute);

        $this->assertResponseIsSuccessful();
    }

    private function provideReactRoutes(): array
    {
        return [
            ['/drug-list'],
            ['/profile'],
            ['/settings']
        ];
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

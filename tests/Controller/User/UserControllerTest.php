<?php

namespace App\Tests\Controller\User;

use App\Entity\User;
use App\Entity\UserDataUpdates;
use DateTimeImmutable;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\Exception\ORMException;
use Doctrine\ORM\OptimisticLockException;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

/**
 * @property KernelBrowser $client
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
        $client->request('GET', $url);

        $this->assertResponseRedirects('/dashboard');
    }

    public function testChangeUserDataAfterConfirmationAndDeleteTemporaryData(): void
    {
        $updatedUserEmail = 'my.new@email.com';
        $this->client->request('GET', '/user-data-change/abc123xyz');
        $temporaryData = $this->entityManager->getRepository(UserDataUpdates::class)->findOneBy([
            'email' => $updatedUserEmail
        ]);
        $user = $this->entityManager->getRepository(User::class)->findOneBy([
            'email' => $updatedUserEmail
        ]);

        $this->assertResponseIsSuccessful();
        $this->assertNull($temporaryData);
        $this->assertNotNull($user);
    }

    public function testRenderAlertDivWithErrorIfUserDataChangeTokenIsIncorrect(): void
    {
        $crawler = $this->client->request('GET', '/user-data-change/incorrectToken');

        $this->assertResponseIsSuccessful();
        $this->assertCount(1, $crawler->filter('.alert'));
    }

    /**
     * @throws OptimisticLockException
     * @throws ORMException
     */
    public function testRenderAlertDivWithErrorIfTimeForUserDataChangeIsOver(): void
    {
        $updates = $this->entityManager->getRepository(UserDataUpdates::class)->findOneBy([
            'email' => 'my.new@email.com'
        ]);
        $updates->setExpiresAt((new DateTimeImmutable())->modify('-1 second'));
        $this->entityManager->flush();
        $crawler = $this->client->request('GET', '/user-data-change/abc123xyz');

        $this->assertResponseIsSuccessful();
        $this->assertCount(1, $crawler->filter('.alert'));
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

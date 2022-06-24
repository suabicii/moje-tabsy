<?php

namespace App\Tests\Controller;

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

    public function testRenderRegisterForm(): void
    {
        $crawler = $this->client->request('GET', '/register');

        $this->assertResponseIsSuccessful();
        $this->assertCount(1, $crawler->filter('form[name="register_form"]'));
    }

    public function testSubmitRegisterForm(): void
    {
        $crawler = $this->client->request('GET', '/register');

        $users = $this->entityManager->getRepository(User::class)->findAll();
        $usersCountBeforeFormSubmission = sizeof($users);
        $crawler = $this->client->submitForm('register_form_submit', [
            'register_form[name]' => 'Adam',
            'register_form[email]' => 'some.dummy@email.com',
            'register_form[password][first]' => 'Qwerty1!',
            'register_form[password][second]' => 'Qwerty1!'
        ]);
        $users = $this->entityManager->getRepository(User::class)->findAll();
        $usersCountAfterFormSubmission = sizeof($users);

        $this->assertResponseRedirects();
        $this->assertGreaterThan($usersCountBeforeFormSubmission, $usersCountAfterFormSubmission);
    }

    public function testRenderAccountCreatedPageForNewAccountOnly(): void
    {
        $crawler = $this->client->request('GET', '/account-created/123xyz456abc'); // token taken from DataFixtures/UserFixtures

        $this->assertResponseIsSuccessful();
    }

    public function testThrowNotFoundExceptionInAccountCreatedPageWhenTokenWasNotFound(): void
    {
        $crawler = $this->client->request('GET', '/account-created/this-should-fail');

        $this->assertResponseStatusCodeSame(404, 'The user account is activated or does not exist');
    }

    public function testActivateAccount(): void
    {
        $crawler = $this->client->request('GET', '/activated/123xyz456abc');
        $user = $this->entityManager->getRepository(User::class)->findOneBy(['email' => 'dummy@email.com']);

        $this->assertEquals(true, $user->isActivated());
    }

    public function testThrowNotFoundExceptionInActivatePageWhenTokenWasNotFound(): void
    {
        $crawler = $this->client->request('GET', '/activated/this-should-fail');

        $this->assertResponseStatusCodeSame(404, 'The user account is activated or does not exist');
    }

    public function testRenderLoginForm(): void
    {
        $crawler = $this->client->request('GET', '/login');

        $this->assertResponseIsSuccessful();
        $this->assertCount(1, $crawler->filter('form[name="login_form"]'));
    }

    public function testLoginUserWhenAccountIsActive(): void
    {
        self::ensureKernelShutdown(); // avoid LogicException
        $client = static::createClient();
        $user = $this->entityManager->getRepository(User::class)->findOneBy(['email' => 'dummy@email2.com']);

        $client->loginUser($user);
        $client->request('GET', '/dashboard');

        $this->assertResponseIsSuccessful();
    }

    public function testRedirectUserFromDashboardToLogoutRouteWhenAccountIsInactive(): void
    {
        self::ensureKernelShutdown();
        $client = static::createClient();
        $user = $this->entityManager->getRepository(User::class)->findOneBy(['email' => 'dummy@email.com']);

        $client->loginUser($user);
        $client->request('GET', '/dashboard');

        $this->assertResponseRedirects('/logout');
    }

    protected function tearDown(): void
    {
        parent::tearDown();

        // avoid memory leaks
        $this->entityManager->close();
        $this->entityManager = null;
    }
}

<?php

namespace App\Tests\Controller\User;

use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class RegisterControllerTest extends WebTestCase
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
        $this->client->request('GET', '/register');

        $users = $this->entityManager->getRepository(User::class)->findAll();
        $usersCountBeforeFormSubmission = sizeof($users);
        $this->client->submitForm('register_form_submit', [
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
        $this->client->request('GET', '/account-created/123xyz456abc'); // token taken from DataFixtures/UserFixtures

        $this->assertResponseIsSuccessful();
    }

    public function testThrowNotFoundExceptionInAccountCreatedPageWhenTokenWasNotFound(): void
    {
        $this->client->request('GET', '/account-created/this-should-fail');

        $this->assertResponseStatusCodeSame(404, 'The user account is activated or does not exist');
    }

    public function testActivateAccount(): void
    {
        $this->client->request('GET', '/activated/123xyz456abc');
        $user = $this->entityManager->getRepository(User::class)->findOneBy(['email' => 'dummy@email.com']);

        $this->assertTrue($user->isActivated());
    }

    public function testThrowNotFoundExceptionInActivatePageWhenTokenWasNotFound(): void
    {
        $this->client->request('GET', '/activated/this-should-fail');

        $this->assertResponseStatusCodeSame(404, 'The user account is activated or does not exist');
    }

    public function testRenderResendActivationEmailPage(): void
    {
        $crawler = $this->client->request('GET', '/resend-activation-email');

        $this->assertResponseIsSuccessful();
        $this->assertCount(1, $crawler->filter('form[name="resend_activation_email_form"]'));
    }

    public function testSubmitResendActivationEmailForm(): void
    {
        $this->client->request('GET', '/resend-activation-email');

        $this->client->submitForm('submit', [
            'email' => 'dummy@email.com'
        ]);

        $this->assertResponseRedirects('/account-created/123xyz456abc');
    }

    public function testSubmitResendActivationEmailFormWithActivatedUserEmailAndRenderAlertDivWithError(): void
    {
        $this->client->request('GET', '/resend-activation-email');

        $this->client->submitForm('submit', [
            'email' => 'dummy@email2.com',
        ]);
        $crawler = $this->client->followRedirect();

        $this->assertCount(1, $crawler->filter('.alert'));
    }

    protected function tearDown(): void
    {
        parent::tearDown();

        // avoid memory leaks
        $this->entityManager->close();
        $this->entityManager = null;
    }
}

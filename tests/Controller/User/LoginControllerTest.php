<?php

namespace App\Tests\Controller\User;

use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class LoginControllerTest extends WebTestCase
{
    protected function setUp(): void
    {
        $this->client = static::createClient();
        $kernel = self::bootKernel();
        $this->entityManager = $kernel->getContainer()->get('doctrine')->getManager();
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

    public function testRenderResetPasswordForm(): void
    {
        $crawler = $this->client->request('GET', '/password-reset');

        $this->assertResponseIsSuccessful();
        $this->assertCount(1, $crawler->filter('form[name="reset_password_form"]'));
    }

    public function testGenerateUserTokenWithExpirationDateOfTwoHoursAfterResetPasswordFormSubmitWasSuccessful(): void
    {
        $crawler = $this->client->request('GET', '/password-reset');
        $userData = ['email' => 'dummy@email3.com'];

        $this->client->submitForm('submit', $userData);
        $user = $this->entityManager->getRepository(User::class)->findOneBy($userData);

        $this->assertNotNull($user->getToken());
        $this->assertGreaterThanOrEqual($user->getTokenExpirationDate(), (new \DateTime())->modify('+2 hours'));
    }

    public function testSubmitResetPasswordFormWithIncorrectUserEmailAndRenderAlertDivWithError(): void
    {
        $crawler = $this->client->request('GET', '/password-reset');

        $crawler = $this->client->submitForm('submit', [
            'email' => 'dummy@emailwichdoesnotexistindb.com'
        ]);
        $crawler = $this->client->followRedirect();

        $this->assertCount(1, $crawler->filter('.alert'));
    }

    public function testRedirectToResetPasswordRequestedPageIfResetPasswordSubmissionWasSuccessful(): void
    {
        $crawler = $this->client->request('GET', '/password-reset');
        $userData = ['email' => 'dummy@email3.com'];

        $this->client->submitForm('submit', $userData);
        $user = $this->entityManager->getRepository(User::class)->findOneBy($userData);

        $this->assertResponseRedirects('/password-reset-requested/' . $user->getToken());
    }
    public function testRedirectFromResetPasswordRequestedPageToPasswordResetIfTokenIsIncorrectOrExpirationDateDoesNotExistAndRenderAlertDivWithError(): void
    {
        $crawler = $this->client->request('GET', '/password-reset-requested/this-should-fail');

        $crawler = $this->client->followRedirect();

        $this->assertCount(1, $crawler->filter('.alert'));
    }

    public function testRenderPasswordChangeForm(): void
    {
        $crawler = $this->client->request('GET', '/password-change/abc654xyz321');

        $this->assertResponseIsSuccessful();
        $this->assertCount(1, $crawler->filter('form[name="change_password_form"]'));
    }

    public function testPasswordChangeAfterPasswordChangeFormSubmission(): void
    {
        $crawler = $this->client->request('GET', '/password-change/abc654xyz321');

        $newPassword = 'Password456!';
        $crawler = $this->client->submitForm('submit', [
            'password' => $newPassword,
            'password_repeat' => $newPassword
        ]);
        $user = $this->entityManager->getRepository(User::class)->findOneBy(['email' => 'dummy@email4.com']);

        $this->assertEquals($newPassword, $user->getPassword());
    }

    public function testLogoutUserWhenPasswordResetModeIsEnabled(): void
    {
        self::ensureKernelShutdown();
        $client = static::createClient();
        $user = $this->entityManager->getRepository(User::class)->findOneBy(['email' => 'dummy@email4.com']);

        $client->loginUser($user);
        $crawler = $client->request('GET', '/dashboard');

        $this->assertResponseRedirects('/logout');
    }

    public function testDisableResetPasswordModeAfterPasswordChange(): void
    {
        $this->client->request('GET', '/password-change/abc654xyz321');

        $newPassword = 'Password456!';
        $crawler = $this->client->submitForm('submit', [
            'password' => $newPassword,
            'password_repeat' => $newPassword
        ]);
        $user = $this->entityManager->getRepository(User::class)->findOneBy(['email' => 'dummy@email4.com']);

        $this->assertFalse($user->isResetPassModeEnabled());
    }

    protected function tearDown(): void
    {
        parent::tearDown();

        // avoid memory leaks
        $this->entityManager->close();
        $this->entityManager = null;
    }
}

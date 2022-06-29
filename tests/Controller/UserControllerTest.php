<?php

namespace App\Tests\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManager;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\PasswordHasher\Hasher\PlaintextPasswordHasher;

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

    public function testRedirectToResetPasswordRequestedPageIfResetPasswordSubmitWasSuccessful(): void
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

    public function testRenderResendActivationEmailPage(): void
    {
        $crawler = $this->client->request('GET', '/resend-activation-email');

        $this->assertResponseIsSuccessful();
        $this->assertCount(1, $crawler->filter('form[name="resend_activation_email_form"]'));
    }

    public function testSubmitResendActivationEmailForm(): void
    {
        $crawler = $this->client->request('GET', '/resend-activation-email');

        $crawler = $this->client->submitForm('submit', [
            'email' => 'dummy@email.com'
        ]);

        $this->assertResponseRedirects('/account-created/123xyz456abc');
    }

    public function testSubmitResendActivationEmailFormWithActivatedUserEmailAndRenderAlertDivWithError(): void
    {
        $crawler = $this->client->request('GET', '/resend-activation-email');

        $crawler = $this->client->submitForm('submit', [
            'email' => 'dummy@email2.com',
        ]);
        $crawler = $this->client->followRedirect();

        $this->assertCount(1, $crawler->filter('.alert'));
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
            ['/'],
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

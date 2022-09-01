<?php

namespace App\Controller\User;

use App\Entity\User;
use DateTime;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;

class LoginController extends UserController
{
    #[Route('/login', name: 'login_page')]
    public function login_page(AuthenticationUtils $authenticationUtils, Request $request): Response
    {
        if ($this->getUser()) { // if user is logged
            return $this->redirectToRoute('app_dashboard');
        }

        list($authenticationError, $inactiveAccountError, $passwordResetError, $lastUsername) = $this->getLoginErrors($authenticationUtils, $request);

        return $this->render('user/login/login.html.twig', [
            'last_username' => $lastUsername,
            'authentication_error' => $authenticationError,
            'inactive_account_error' => $inactiveAccountError,
            'password_reset_error' => $passwordResetError
        ]);
    }

    #[Route('/password-reset', name: 'reset_password_page')]
    #[Route('/password-reset/submit', name: 'reset_password_submit', methods: ['POST'])]
    public function reset_password_page(Request $request): RedirectResponse|Response
    {
        if ($this->getUser()) {
            return $this->redirectToRoute('app_dashboard');
        }

        $route = $request->get('_route');
        $error = $request->get('error');

        if ($route === 'reset_password_page') {
            return $this->render('user/login/reset_password.html.twig', [
                'error' => $error
            ]);
        } else {
            return $this->redirectAfterPasswordResetFormSubmission($request);
        }
    }

    #[Route('/password-reset-requested/{token}', name: 'reset_password_requested_page')]
    public function reset_password_requested_page(string $token): Response
    {
        $user = $this->doctrine->getRepository(User::class)->findOneBy(['token' => $token]);
        if (!$user || $user->getTokenExpirationDate() === null) {
            return $this->redirectToRoute('reset_password_page', ['error' => 'Nieprawidłowe dane użytkownika']);
        }

        return $this->render('user/login/reset_password_requested.html.twig');
    }

    #[Route('/password-change/{token}', name: 'change_password_page')]
    #[Route('/password-change/{token}/submit', name: 'change_password_submit', methods: ['POST'])]
    public function change_password_page(string $token, Request $request): RedirectResponse|Response
    {
        $user = $this->doctrine->getRepository(User::class)->findOneBy(['token' => $token]);
        $tokenExpirationDate = $user->getTokenExpirationDate();
        if ($tokenExpirationDate === null) {
            return $this->redirectToRoute('reset_password_page', ['error' => 'Nieprawidłowe dane użytkownika']);
        } elseif (new DateTime() > $tokenExpirationDate) {
            return $this->redirectToRoute('reset_password_page', ['error' => 'Token resetowania hasła wygasł. Podaj adres e-mail jeszcze raz.']);
        }

        $route = $request->get('_route');
        $error = $request->get('error');

        if ($route === 'change_password_page') {
            return $this->render('user/login/change_password.html.twig', [
                'error' => $error
            ]);
        } else {
            return $this->redirectAfterPasswordChangeFormSubmission($request, $token, $user);
        }
    }

    /**
     * @param AuthenticationUtils $authenticationUtils
     * @param Request $request
     * @return array
     */
    private function getLoginErrors(AuthenticationUtils $authenticationUtils, Request $request): array
    {
        $authenticationError = $authenticationUtils->getLastAuthenticationError();
        $inactiveAccountError = null;
        $passwordResetError = null;
        $inactiveAccountCookieName = 'inactive_user';
        $passwordResetErrorCookieName = 'password_reset_error';
        $lastUsernameFromCookie = $request->cookies->get($inactiveAccountCookieName);
        $passwordResetErrorMessageFromCookie = $request->cookies->get($passwordResetErrorCookieName);
        // last username entered by the user
        $lastUsernameFromAuthenticationUtils = $authenticationUtils->getLastUsername();
        $lastUsername = $lastUsernameFromAuthenticationUtils ?: $lastUsernameFromCookie;

        if ($passwordResetErrorMessageFromCookie) {
            $passwordResetError = $passwordResetErrorMessageFromCookie;
            $this->cookieCleaner->cleanCookie($passwordResetErrorCookieName);
        }

        if ($lastUsernameFromCookie && $lastUsernameFromCookie === $lastUsername) {
            $inactiveAccountError = 'Aby móc się zalogować, musisz aktywować swoje konto.';
            $this->cookieCleaner->cleanCookie($inactiveAccountCookieName);
        }

        return array($authenticationError, $inactiveAccountError, $passwordResetError, $lastUsername);
    }

    /**
     * @param Request $request
     * @return RedirectResponse
     */
    private function redirectAfterPasswordResetFormSubmission(Request $request): RedirectResponse
    {
        $user = $this->doctrine->getRepository(User::class)->findOneBy(['email' => $request->get('email')]);
        if (!$user) {
            return $this->redirectToRoute('reset_password_page', ['error' => 'Nie znaleziono konta o podanym adresie e-mail']);
        }
        $entityManager = $this->doctrine->getManager();
        $user->setToken($this->tokenGenerator->generateToken());
        $user->setTokenExpirationDate((new DateTime())->modify('+2 hours'));
        $user->setResetPassModeEnabled(true);
        $entityManager->flush();
        try {
            $this->sendPasswordResetEmail($user->getEmail(), $user->getToken());
        } catch (TransportExceptionInterface $e) {
            $this->redirectToRoute('reset_password_page', ['error' => $e->getCode()]);
        }
        return $this->redirectToRoute('reset_password_requested_page', ['token' => $user->getToken()]);
    }

    /**
     * @param Request $request
     * @param string $token
     * @param User $user
     * @return RedirectResponse
     */
    public function redirectAfterPasswordChangeFormSubmission(Request $request, string $token, User $user): RedirectResponse
    {
        $password = $request->get('password');
        $passwordRepeated = $request->get('password_repeat');
        $error = $this->validatePasswordChange($password, $passwordRepeated);
        if ($error) {
            return $this->redirectToRoute('change_password_page', [
                'token' => $token,
                'error' => $error
            ]);
        }
        $entityManager = $this->doctrine->getManager();
        if ($_ENV['APP_ENV'] === 'test') {
            $user->setPassword($password);
        } else {
            $hashed_password = $this->passwordHasher->hashPassword($user, $password);
            $user->setPassword($hashed_password);
        }
        $user->setToken(null);
        $user->setTokenExpirationDate(null);
        $user->setResetPassModeEnabled(false);
        $entityManager->flush();
        $this->addFlash('info', 'Hasło zostało zmienione');
        return $this->redirectToRoute('login_page');
    }

    /**
     * @param string $password
     * @param string $passwordRepeated
     * @return string|null error message
     */
    private function validatePasswordChange(string $password, string $passwordRepeated): ?string
    {
        if (strlen($password) < 8) {
            return 'Hasło musi zawierać co najmniej 8 znaków.';
        } elseif ($password !== $passwordRepeated) {
            return 'Hasła w obu polach muszą być takie same.';
        } elseif (!preg_match('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).*$/', $password)) {
            return 'Hasło musi zawierać co najmniej jedną małą literę, co najmniej jedną wielką literę, co najmniej jedną cyfrę i co najmniej jeden znak specjalny.';
        } else {
            return null;
        }
    }

    /**
     * @param string $userEmail
     * @param string $token
     * @return void
     * @throws TransportExceptionInterface
     */
    private function sendPasswordResetEmail(string $userEmail, string $token): void
    {
        $this->emailService->sendMessageToUser(
            $userEmail,
            'Moje-Tabsy.pl – zmiana hasła',
            'emails/password_reset.txt.twig',
            'emails/password_reset.html.twig',
            ['reset_url' => $_ENV['HOST_URL'] . '/password-change/' . $token]
        );
    }
}

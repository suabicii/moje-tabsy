<?php

namespace App\Controller;

use App\Entity\User;
use App\Form\LoginFormType;
use App\Form\RegisterFormType;
use App\Service\EmailService;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;

/**
 * @property ManagerRegistry $doctrine
 * @property UserPasswordHasherInterface $passwordHasher
 * @property EmailService $emailService
 */
class UserController extends AbstractController
{
    public function __construct(ManagerRegistry $doctrine, EmailService $emailService, UserPasswordHasherInterface $passwordHasher)
    {
        $this->doctrine = $doctrine;
        $this->passwordHasher = $passwordHasher;
        $this->emailService = $emailService;
    }

    #[Route('/login', name: 'login_page')]
    public function login_page(AuthenticationUtils $authenticationUtils, Request $request): Response
    {
        $error = $authenticationUtils->getLastAuthenticationError();
        $inactiveAccountError = null;
        $cookie = $request->cookies->get('inactive_user');
        // last username entered by the user
        $lastUsername = $authenticationUtils->getLastUsername() ? $authenticationUtils->getLastUsername() : $cookie;

        if ($cookie && $cookie === $lastUsername) {
            $inactiveAccountError = 'Aby móc się zalogować, musisz aktywować swoje konto.';
            $res = new Response();
            $res->headers->clearCookie('inactive_user');
            $res->send();
        }

        return $this->render('user/login.html.twig', [
            'last_username' => $lastUsername,
            'error' => $error,
            'inactive_account_error' => $inactiveAccountError
        ]);
    }

    #[Route('/register', name: 'register_page')]
    public function register_page(Request $request): Response
    {
        $user = new User();
        $form = $this->createForm(RegisterFormType::class, $user);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            try {
                $this->createUser($form, $user);
            } catch (TransportExceptionInterface $e) {
                exit('Error ' . $e->getCode() . ': ' . $e->getMessage());
            }
            return $this->redirectToRoute('account_created', ['token' => $user->getToken()]);
        }

        return $this->render('user/register.html.twig', [
            'form' => $form->createView()
        ]);
    }

    #[Route('/account-created/{token}', name: 'account_created')]
    public function account_created_page(string $token): Response
    {
        $user = $this->doctrine->getRepository(User::class)->findOneBy(['token' => $token]);
        if ($user && !$user->isActivated()) {
            return $this->render('user/account_created.html.twig');
        } else {
            throw $this->createNotFoundException('The user account is activated or does not exist');
        }
    }

    #[Route('/activated/{token}', name: 'account_activated')]
    public function account_activated_page(string $token): Response
    {
        $user = $this->doctrine->getRepository(User::class)->findOneBy(['token' => $token]);

        if ($user) {
            $entityManager = $this->doctrine->getManager();
            $user->setActivated(true);
            $user->setToken(null);
            $entityManager->persist($user);
            $entityManager->flush();
            return $this->render('user/account_activated.html.twig');
        } else {
            throw $this->createNotFoundException('The user account is activated or does not exist');
        }
    }

    /**
     * @param FormInterface $form
     * @param User $user
     * @return void
     * @throws TransportExceptionInterface
     */
    private function createUser(FormInterface $form, User $user): void
    {
        $entityManager = $this->doctrine->getManager();
        $token = $this->generateToken();
        $this->setUserData($user, $form, $token);
        $this->emailService->sendMessageToUser(
            $user,
            'Moje-Tabsy.pl – aktywacja konta',
            'emails/signup_confirmation.txt.twig',
            'emails/signup_confirmation.html.twig',
            ['activation_url' => $_ENV['HOST_URL'] . '/activated/' . $token]
        );
        $entityManager->persist($user);
        $entityManager->flush();
    }

    /**
     * @param User $user
     * @param FormInterface $form
     * @param string $token
     * @return void
     */
    private function setUserData(User $user, FormInterface $form, string $token): void
    {
        $user->setRoles(['ROLE_USER']);
        $user->setActivated(false);
        $password = $form->get('password')->getData();
        $tel = $form->get('tel')->getData();
        if ($tel === null) {
            $user->setTelPrefix(null);
        }
        $hashed_password = $this->passwordHasher->hashPassword($user, $password);
        $user->setPassword($hashed_password);
        $user->setToken($token);
    }

    /**
     * @return string
     */
    private function generateToken(): string
    {
        $rand_token = openssl_random_pseudo_bytes(16);
        return bin2hex($rand_token);
    }
}

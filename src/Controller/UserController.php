<?php

namespace App\Controller;

use App\Entity\User;
use App\Form\RegisterFormType;
use App\Service\EmailService;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @property ManagerRegistry $doctrine
 * @property EmailService $emailService
 */
class UserController extends AbstractController
{
    public function __construct(ManagerRegistry $doctrine, EmailService $emailService)
    {
        $this->doctrine = $doctrine;
        $this->emailService = $emailService;
    }

    #[Route('/login', name: 'login_page')]
    public function login_page(): Response
    {
        return $this->render('user/login.html.twig');
    }

    #[Route('/register', name: 'register_page')]
    public function register_page(Request $request, UserPasswordHasherInterface $passwordHasher): Response
    {
        $user = new User();
        $form = $this->createForm(RegisterFormType::class, $user);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            try {
                $this->createUser($form, $user, $passwordHasher);
            } catch (TransportExceptionInterface $e) {
                exit('Error ' . $e->getCode() . ': ' . $e->getMessage());
            }
            return $this->redirectToRoute('account_created');
        }

        return $this->render('user/register.html.twig', [
            'form' => $form->createView()
        ]);
    }

    #[Route('/account-created', name: 'account_created')]
    public function account_created_page(): Response
    {
        return $this->render('user/account_created.html.twig');
    }

    #[Route('/activated/{token}', name: 'account_activated')]
    public function account_activated_page(string $token): Response
    {
        $user = $this->doctrine->getRepository(User::class)->findBy(['token' => $token]);

        if ($user) {
            return $this->render('user/account_activated.html.twig');
        } else {
            throw $this->createNotFoundException('The user does not exist');
        }
    }

    /**
     * @param FormInterface $form
     * @param User $user
     * @param UserPasswordHasherInterface $passwordHasher
     * @return void
     * @throws TransportExceptionInterface
     */
    private function createUser(FormInterface $form, User $user, UserPasswordHasherInterface $passwordHasher): void
    {
        $entityManager = $this->doctrine->getManager();
        $token = $this->generateToken();
        $this->setUserData($user, $form, $passwordHasher, $token);
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
     * @param UserPasswordHasherInterface $passwordHasher
     * @param string $token
     * @return void
     */
    public function setUserData(User $user, FormInterface $form, UserPasswordHasherInterface $passwordHasher, string $token): void
    {
        $user->setRoles(['ROLE_USER']);
        $user->setActivated(false);
        $password = $form->get('password')->getData();
        $tel = $form->get('tel')->getData();
        if ($tel === null) {
            $user->setTelPrefix(null);
        }
        $hashed_password = $passwordHasher->hashPassword($user, $password);
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

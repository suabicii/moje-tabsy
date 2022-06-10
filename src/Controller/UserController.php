<?php

namespace App\Controller;

use App\Entity\User;
use App\Form\RegisterFormType;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;

class UserController extends AbstractController
{
    #[Route('/login', name: 'login_page')]
    public function login_page(): Response
    {
        return $this->render('user/login.html.twig');
    }

    #[Route('/register', name: 'register_page')]
    public function register_page(Request $request, ManagerRegistry $doctrine, UserPasswordHasherInterface $passwordHasher): Response
    {
        $user = new User();
        $form = $this->createForm(RegisterFormType::class, $user);
        $form->handleRequest($request);

        $entityManager = $doctrine->getManager();
        $users = $entityManager->getRepository(User::class)->findAll();
        dump($users);

        if ($form->isSubmitted() && $form->isValid()) {
            $user->setRoles(['ROLE_USER']);
            $password = $form->get('password')->getData();
            $tel = $form->get('tel')->getData();
            if ($tel === null) {
                $user->setTelPrefix(null);
            }
            $hashed_password = $passwordHasher->hashPassword($user, $password);
            $user->setPassword($hashed_password);
            $entityManager->persist($user);
            $entityManager->flush();
        }

        return $this->render('user/register.html.twig', [
            'form' => $form->createView()
        ]);
    }
}

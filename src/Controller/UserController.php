<?php

namespace App\Controller;

use App\Entity\User;
use App\Form\RegisterFormType;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class UserController extends AbstractController
{
    #[Route('/login', name: 'login_page')]
    public function login_page(): Response
    {
        return $this->render('user/login.html.twig');
    }

    #[Route('/register', name: 'register_page')]
    public function register_page(Request $request): Response
    {
        $user = new User();
        $form = $this->createForm(RegisterFormType::class, $user);
        $form->handleRequest($request);
        return $this->render('user/register.html.twig', [
            'form' => $form->createView()
        ]);
    }
}

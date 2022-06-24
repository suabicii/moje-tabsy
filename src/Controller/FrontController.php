<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class FrontController extends AbstractController
{
    #[Route('/', name: 'front_page')]
    public function index(): Response
    {
        $user = $this->getUser();
        if ($user) {
            return $this->redirectToRoute('app_dashboard');
        }
        return $this->render('front_page/index.html.twig');
    }
}

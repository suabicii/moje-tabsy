<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class FrontPageController extends AbstractController
{
    #[Route('/', name: 'app_front_page')]
    public function index(): Response
    {
        return $this->render('front_page/index.html.twig', [
            'controller_name' => 'FrontPageController',
        ]);
    }
}

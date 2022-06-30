<?php

namespace App\Controller;

use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class DashboardController extends AbstractController
{
    #[Route('/dashboard', name: 'app_dashboard')]
    public function index(): Response
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user->isActivated()) {
            $cookie = new Cookie('inactive_user', $user->getEmail());
            return $this->setCookieAndLogout($cookie);
        } elseif ($user->isResetPassModeEnabled()) {
            $cookie = new Cookie(
                'password_reset_error',
                'Twoje hasło zostało zresetowane. 
                Aby odzyskać dostęp do konta musisz zmienić hasło – link do formularza znajdziesz w mailu resetującym hasło. 
                Jeśli nie możesz go znaleźć w skrzynce odbiorczej, kliknij jeszcze raz link "Nie pamiętam hasła".'
            );
            return $this->setCookieAndLogout($cookie);
        }

        return $this->render('dashboard/index.html.twig');
    }

    /**
     * @param Cookie $cookie
     * @return RedirectResponse
     */
    private function setCookieAndLogout(Cookie $cookie): RedirectResponse
    {
        $res = new Response();
        $res->headers->setCookie($cookie);
        $res->send();
        return $this->redirectToRoute('app_logout');
    }
}

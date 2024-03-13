<?php

namespace App\Controller;

use App\Entity\QrLoginToken;
use App\Entity\User;
use App\Service\TokenGeneratorService;
use Doctrine\Persistence\ManagerRegistry;
use Endroid\QrCode\QrCode;
use Endroid\QrCode\Writer\PngWriter;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

class QrCodeGeneratorController extends AbstractController
{
    #[Route('/qr-code', name: 'qr_code')]
    public function generateQrCode(UrlGeneratorInterface $urlGenerator, TokenGeneratorService $tokenGenerator, ManagerRegistry $doctrine): Response
    {
        $authenticatedUser = $this->getUser();
        if ($authenticatedUser) {
            $userId = $this->getUser()->getUserIdentifier();
            $user = $doctrine->getRepository(User::class)->findOneBy(['email' => $userId]);
            $token = $tokenGenerator->generateToken();

            $this->saveQrLoginTokenInDb($token, $user, $doctrine);

            $url = $urlGenerator->generate(
                'login_in_mobile_app_qr',
                [
                    'token' => $token,
                    'userId' => $this->getUser()->getUserIdentifier()
                ],
                UrlGeneratorInterface::NETWORK_PATH
            );
            $qrCode = QrCode::create($url);
            $writer = new PngWriter();
            $result = $writer->write($qrCode);

            return new Response("<img id='qr-code' src='{$result->getDataUri()}' alt='qr code'>");
        } else {
            return new Response('Permission denied', 401);
        }
    }

    /**
     * @param string $token
     * @param User $user
     * @param ManagerRegistry $doctrine
     * @return void
     */
    private function saveQrLoginTokenInDb(string $token, User $user, ManagerRegistry $doctrine): void
    {
        $qrLoginToken = new QrLoginToken();
        $qrLoginToken->setToken($token);
        $qrLoginToken->setUser($user);
        $entityManager = $doctrine->getManager();
        $entityManager->persist($qrLoginToken);
        $entityManager->flush();
    }
}

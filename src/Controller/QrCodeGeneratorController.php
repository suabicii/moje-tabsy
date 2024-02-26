<?php

namespace App\Controller;

use App\Service\TokenGeneratorService;
use Endroid\QrCode\QrCode;
use Endroid\QrCode\Writer\PngWriter;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

class QrCodeGeneratorController extends AbstractController
{
    #[Route('/qr-code', name: 'qr_code')]
    public function generateQrCode(UrlGeneratorInterface $urlGenerator, TokenGeneratorService $tokenGenerator): Response
    {
        if ($this->getUser()) {
            $token = $tokenGenerator->generateToken();
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
}

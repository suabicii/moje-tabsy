<?php

namespace App\Controller;

use Endroid\QrCode\QrCode;
use Endroid\QrCode\Writer\PngWriter;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class QrCodeGeneratorController extends AbstractController
{
    #[Route('/qr-code', name: 'qr_code')]
    public function generateQrCode(): Response
    {
        if ($this->getUser()) {
            $qrCode = QrCode::create('https://youtu.be/dQw4w9WgXcQ?si=EeirYQlIX9K67tim');
            $writer = new PngWriter();
            $result = $writer->write($qrCode);

            return new Response("<img id='qr-code' src='{$result->getDataUri()}' alt='qr code'>");
        } else {
            return new Response('Permission denied', 401);
        }
    }
}

<?php

namespace App\Service;

use App\Entity\User;
use App\Mailer\MailerClient;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Symfony\Component\Mime\Email;

class EmailService
{
    /**
     * @throws TransportExceptionInterface
     */
    public function sendMessageToUser(User $user, string $subject, string $textBody, string $htmlBody): void
    {
        $email = (new Email())
            ->from($_ENV['MAILER_ACCOUNT'])
            ->to($user->getEmail())
            ->subject($subject)
            ->text($textBody)
            ->html($htmlBody);

        $mailer = new MailerClient($_ENV['MAILER_DSN']);

        $mailer->send($email);
    }
}
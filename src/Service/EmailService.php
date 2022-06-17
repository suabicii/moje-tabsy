<?php

namespace App\Service;

use App\Entity\User;
use App\Mailer\MailerClient;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Symfony\Component\Mime\BodyRendererInterface;

/**
 * @property BodyRendererInterface $bodyRenderer
 */
class EmailService
{
    public function __construct(BodyRendererInterface $bodyRenderer)
    {
        $this->bodyRenderer = $bodyRenderer;
    }

    /**
     * @throws TransportExceptionInterface
     */
    public function sendMessageToUser(User $user, string $subject, string $textTemplate, string $htmlTemplate, array $context = null): void
    {
        $email = (new TemplatedEmail())
            ->from($_ENV['MAILER_ACCOUNT'])
            ->to($user->getEmail())
            ->subject($subject)
            ->htmlTemplate($htmlTemplate)
            ->textTemplate($textTemplate)
            ->context($context);

        $mailer = new MailerClient($_ENV['MAILER_DSN']);

        $this->bodyRenderer->render($email);

        $mailer->send($email);
    }
}
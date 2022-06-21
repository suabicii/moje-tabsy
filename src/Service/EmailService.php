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
     * @param User $user
     * @param string $subject
     * @param string $textTemplate
     * @param string $htmlTemplate
     * @param array $context Variables for Twig templates
     * @throws TransportExceptionInterface
     */
    public function sendMessageToUser(User $user, string $subject, string $textTemplate, string $htmlTemplate, array $context = []): void
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
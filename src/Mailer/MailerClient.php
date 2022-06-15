<?php

namespace App\Mailer;

use Symfony\Component\Mailer\Envelope;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mailer\Transport;
use Symfony\Component\Mailer\Transport\TransportInterface;
use Symfony\Component\Mime\RawMessage;

/**
 * @property TransportInterface $transport
 */
class MailerClient implements MailerInterface
{
    public function __construct(protected string $dsn)
    {
        $this->transport = Transport::fromDsn($dsn);
    }

    public function send(RawMessage $message, Envelope $envelope = null): void
    {
        $this->transport->send($message, $envelope);
    }
}
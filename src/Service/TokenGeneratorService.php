<?php

namespace App\Service;

class TokenGeneratorService
{
    public function generateToken(): string
    {
        $rand_token = openssl_random_pseudo_bytes(16);
        return bin2hex($rand_token);
    }
}
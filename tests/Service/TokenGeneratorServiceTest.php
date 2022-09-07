<?php

namespace App\Tests\Service;

use App\Service\TokenGeneratorService;
use PHPUnit\Framework\TestCase;

class TokenGeneratorServiceTest extends TestCase
{
    public function testGenerateTokenAsStringWith32Chars(): void
    {
        $tokenGenerator = new TokenGeneratorService();

        $this->assertIsString($tokenGenerator->generateToken());
        $this->assertEquals(32, strlen($tokenGenerator->generateToken()));
    }
}

<?php

namespace App\Service;

use Symfony\Component\HttpFoundation\Response;

class CookieCleanerService
{
    /**
     * @param string $name Cookie name
     * @return void
     */
    public function cleanCookie(string $name): void
    {
        $res = new Response();
        $res->headers->clearCookie($name);
        $res->send();
    }
}
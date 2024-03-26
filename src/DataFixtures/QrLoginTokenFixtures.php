<?php

namespace App\DataFixtures;

use App\Entity\QrLoginToken;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;

class QrLoginTokenFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        $qrLoginToken = new QrLoginToken();
        $user = $manager->getRepository(User::class)->findOneBy(['email' => 'john@doe.com']);
        $qrLoginToken->setToken('123abc321xyz');
        $qrLoginToken->setUser($user);

        $manager->persist($qrLoginToken);
        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [UserFixtures::class, MobileAppUserFixtures::class];
    }
}
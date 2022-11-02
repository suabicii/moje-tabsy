<?php

namespace App\DataFixtures;

use App\Entity\MobileAppUser;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;

class MobileAppUserFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager)
    {
        $mobileAppUser = new MobileAppUser();
        $user = $manager->getRepository(User::class)->findOneBy(['email' => 'john@doe.com']);
        $mobileAppUser->setUser($user);
        $manager->persist($mobileAppUser);
        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            UserFixtures::class,
            DrugFixtures::class,
            UserDataUpdatesFixtures::class
        ];
    }
}
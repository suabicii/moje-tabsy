<?php

namespace App\DataFixtures;

use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class UserFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $this->setUserData($manager, 'Adam', 'dummy@email.com', false);
        $this->setUserData($manager, 'Eva', 'dummy@email2.com', true);

        $manager->flush();
    }

    private function setUserData(ObjectManager $manager, string $name, string $email, bool $activated): void
    {
        $user = new User();
        $user->setName($name);
        $user->setEmail($email);
        $user->setPassword('Password123!');
        $user->setToken('123xyz456abc');
        $user->setActivated($activated);
        $user->setRoles(['ROLE_USER']);
        $manager->persist($user);
    }
}

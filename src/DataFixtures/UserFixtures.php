<?php

namespace App\DataFixtures;

use App\Entity\User;
use DateTime;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class UserFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $this->setUserData($manager, 'Adam', 'dummy@email.com', '123xyz456abc', null, false);
        $this->setUserData($manager, 'Eva', 'dummy@email2.com', '123xyz456abc', null, true);
        $this->setUserData($manager, 'Evan', 'dummy@email3.com', null, null,true);
        $this->setUserData($manager, 'Mary', 'dummy@email4.com', 'abc654xyz321', (new DateTime())->modify('+100 years'),true);

        $manager->flush();
    }

    private function setUserData(ObjectManager $manager, string $name, string $email, ?string $token, ?DateTime $tokenExpirationDate, bool $activated): void
    {
        $user = new User();
        $user->setName($name);
        $user->setEmail($email);
        $user->setPassword('Password123!');
        $user->setToken($token);
        $user->setTokenExpirationDate($tokenExpirationDate);
        $user->setActivated($activated);
        $user->setRoles(['ROLE_USER']);
        $manager->persist($user);
    }
}

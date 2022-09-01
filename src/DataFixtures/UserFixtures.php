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
        $this->setUserData($manager, 'Adam', 'dummy@email.com', '123xyz456abc', null, false, false);
        $this->setUserData($manager, 'Eva', 'dummy@email2.com', '123xyz456abc', null, true, false);
        $this->setUserData($manager, 'Evan', 'dummy@email3.com', null, null, true, false);
        $this->setUserData($manager, 'Mary', 'dummy@email4.com', 'abc654xyz321', (new DateTime())->modify('+100 years'), true, true);
        $this->setUserData($manager, 'John', 'john@doe.com', null, null, true, false);

        $manager->flush();
    }

    private function setUserData(ObjectManager $manager,
                                 string        $name,
                                 string        $email,
                                 ?string       $token,
                                 ?DateTime     $tokenExpirationDate,
                                 bool          $activated,
                                 bool          $resetPassModeEnabled): void
    {
        $user = new User();
        $user->setName($name);
        $user->setEmail($email);
        $user->setPassword('Password123!');
        $user->setToken($token);
        $user->setTokenExpirationDate($tokenExpirationDate);
        $user->setActivated($activated);
        $user->setResetPassModeEnabled($resetPassModeEnabled);
        $user->setRoles(['ROLE_USER']);
        $manager->persist($user);
    }
}

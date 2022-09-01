<?php

namespace App\DataFixtures;

use App\Entity\User;
use App\Entity\UserDataUpdates;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;

class UserDataUpdatesFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager)
    {
        $userDataUpdates = new UserDataUpdates();
        $user = $manager->getRepository(User::class)->findOneBy(['email' => 'john@doe.com']);
        $userDataUpdates->setUser($user);
        $userDataUpdates->setName('Mike');
        $userDataUpdates->setEmail('my.new@email.com');
        $userDataUpdates->setPassword('Password321!');
        $userDataUpdates->setTelPrefix('123');
        $userDataUpdates->setTel('111222333');
        $userDataUpdates->setExpiresAt((new \DateTimeImmutable())->modify('+2 hours'));

        $manager->persist($userDataUpdates);
        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [UserFixtures::class, DrugFixtures::class];
    }
}
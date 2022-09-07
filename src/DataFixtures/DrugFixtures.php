<?php

namespace App\DataFixtures;

use App\Entity\Drug;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;

class DrugFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager)
    {
        $user = $manager->getRepository(User::class)->findOneBy(['email' => 'dummy@email3.com']); // fully logged and activated user from UserFixtures

        $this->setDrugData(
            $manager,
            $user,
            'Magnesium',
            60,
            120,
            'pcs.',
            1,
            [
                'hour1' => '08:00',
                'hour2' => '18:00'
            ]
        );
        $this->setDrugData(
            $manager,
            $user,
            'Vit. C',
            80,
            100,
            'pcs.',
            2,
            ['hour1' => '18:00']
        );
        $this->setDrugData(
            $manager,
            $user,
            'Cough syrup',
            60,
            80,
            'ml.',
            10,
            ['hour1' => '18:00']
        );

        $manager->flush();
    }

    private function setDrugData(ObjectManager $manager,
                                 User          $user,
                                 string        $name,
                                 float         $quantity,
                                 float         $quantityMax,
                                 string        $unit,
                                 int           $dosing,
                                 array         $dosingMoments): void
    {
        $drug = new Drug();
        $drug->setUser($user);
        $drug->setName($name);
        $drug->setQuantity($quantity);
        $drug->setQuantityMax($quantityMax);
        $drug->setUnit($unit);
        $drug->setDosing($dosing);
        $drug->setDosingMoments($dosingMoments);
        $manager->persist($drug);
    }

    public function getDependencies(): array
    {
        return [UserFixtures::class];
    }
}
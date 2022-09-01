<?php

namespace App\Repository;

use App\Entity\User;
use App\Entity\UserDataUpdates;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<UserDataUpdates>
 *
 * @method UserDataUpdates|null find($id, $lockMode = null, $lockVersion = null)
 * @method UserDataUpdates|null findOneBy(array $criteria, array $orderBy = null)
 * @method UserDataUpdates[]    findAll()
 * @method UserDataUpdates[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class UserDataUpdatesRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, UserDataUpdates::class);
    }

    public function add(UserDataUpdates $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(UserDataUpdates $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function findUserDataUpdatesRelatedToConcreteUser(User $user): mixed
    {
        return $this->createQueryBuilder('u')
            ->select('u.email', 'u.name')
            ->andWhere('u.user = :user')
            ->setParameter('user', $user)
            ->getQuery()
            ->getResult();
    }

//    /**
//     * @return UserDataChanger[] Returns an array of UserDataChanger objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('u')
//            ->andWhere('u.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('u.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?UserDataChanger
//    {
//        return $this->createQueryBuilder('u')
//            ->andWhere('u.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}

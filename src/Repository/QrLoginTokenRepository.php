<?php

namespace App\Repository;

use App\Entity\QrLoginToken;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<QrLoginToken>
 *
 * @method QrLoginToken|null find($id, $lockMode = null, $lockVersion = null)
 * @method QrLoginToken|null findOneBy(array $criteria, array $orderBy = null)
 * @method QrLoginToken[]    findAll()
 * @method QrLoginToken[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class QrLoginTokenRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, QrLoginToken::class);
    }

    public function add(QrLoginToken $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(QrLoginToken $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }
}

<?php

namespace App\Entity;

use App\Repository\DrugRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: DrugRepository::class)]
class Drug
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private ?int $id;

    #[ORM\Column(type: 'string', length: 255)]
    private ?string $name;

    #[ORM\Column(type: 'float')]
    private ?float $quantity;

    #[ORM\Column(type: 'float')]
    private ?float $quantityMax;

    #[ORM\Column(type: 'string', length: 50)]
    private ?string $unit;

    #[ORM\Column(type: 'integer')]
    private ?int $dosing;

    #[ORM\Column(type: 'array')]
    private array $dosingMoments = [];

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'drugs')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getQuantity(): ?float
    {
        return $this->quantity;
    }

    public function setQuantity(string $quantity): self
    {
        $this->quantity = $quantity;

        return $this;
    }

    public function getQuantityMax(): ?float
    {
        return $this->quantityMax;
    }

    public function setQuantityMax(float $quantityMax): self
    {
        $this->quantityMax = $quantityMax;

        return $this;
    }

    public function getUnit(): ?string
    {
        return $this->unit;
    }

    public function setUnit(string $unit): self
    {
        $this->unit = $unit;

        return $this;
    }

    public function getDosing(): ?int
    {
        return $this->dosing;
    }

    public function setDosing(int $dosing): self
    {
        $this->dosing = $dosing;

        return $this;
    }

    public function getDosingMoments(): ?array
    {
        return $this->dosingMoments;
    }

    public function setDosingMoments(array $dosingMoments): self
    {
        $this->dosingMoments = $dosingMoments;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
    }
}

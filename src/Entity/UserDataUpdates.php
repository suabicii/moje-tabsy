<?php

namespace App\Entity;

use App\Repository\UserDataUpdatesRepository;
use Doctrine\ORM\Mapping as ORM;

// Entity for storing temporarily user data updates which will be deleted after confirmation by user
#[ORM\Entity(repositoryClass: UserDataUpdatesRepository::class)]
class UserDataUpdates
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private ?int $id;

    #[ORM\OneToOne(targetEntity: User::class, cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user;

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    private ?string $name;

    #[ORM\Column(type: 'string', length: 180, nullable: true)]
    private ?string $email;

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    private ?string $password;

    #[ORM\Column(type: 'string', length: 3, nullable: true)]
    private ?string $tel_prefix;

    #[ORM\Column(type: 'string', length: 9, nullable: true)]
    private ?string $tel;

    #[ORM\Column(type: 'datetime_immutable')]
    private ?\DateTimeImmutable $expires_at;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(User $user): self
    {
        $this->user = $user;

        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(?string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(?string $email): self
    {
        $this->email = $email;

        return $this;
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(?string $password): self
    {
        $this->password = $password;

        return $this;
    }

    public function getTelPrefix(): ?string
    {
        return $this->tel_prefix;
    }

    public function setTelPrefix(?string $tel_prefix): self
    {
        $this->tel_prefix = $tel_prefix;

        return $this;
    }

    public function getTel(): ?string
    {
        return $this->tel;
    }

    public function setTel(?string $tel): self
    {
        $this->tel = $tel;

        return $this;
    }

    public function getExpiresAt(): ?\DateTimeImmutable
    {
        return $this->expires_at;
    }

    public function setExpiresAt(\DateTimeImmutable $expires_at): self
    {
        $this->expires_at = $expires_at;

        return $this;
    }
}

<?php

namespace App\Entity;

use App\Repository\UserRepository;
use DateTimeInterface;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: UserRepository::class)]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private ?int $id;

    #[Assert\NotBlank(message: "Podaj imię.")]
    #[ORM\Column(type: 'string', length: 255)]
    private ?string $name;

    #[Assert\NotBlank(message: "Podaj adres e-mail.")]
    #[Assert\Email(message: "Podaj prawidłowy adres e-mail.")]
    #[ORM\Column(type: 'string', length: 180, unique: true)]
    private ?string $email;

    #[ORM\Column(type: 'json')]
    private array $roles = [];

    #[Assert\NotBlank(message: "Podaj hasło.")]
    #[Assert\Length(min: 8, minMessage: 'Hasło musi zawierać co najmniej 8 znaków.')]
    #[Assert\Regex('/[a-z]+/', message: 'Hasło musi zawierać co najmniej jedną małą literę')]
    #[Assert\Regex('/[A-Z]+/', message: 'Hasło musi zawierać co najmniej jedną wielką literę')]
    #[Assert\Regex('/[0-9]+/', message: 'Hasło musi zawierać co najmniej jedną cyfrę')]
    #[Assert\Regex('/[!@#$%^&*]+/', message: 'Hasło musi zawierać co najmniej jeden znak specjalny')]
    #[ORM\Column(type: 'string')]
    private string $password;

    #[Assert\GreaterThan(0)]
    #[ORM\Column(type: 'string', length: 3, nullable: true)]
    private ?string $tel_prefix;

    #[ORM\Column(type: 'string', length: 9, nullable: true)]
    private ?string $tel;

    #[ORM\Column(type: 'boolean')]
    private ?bool $activated;

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    private ?string $token;

    #[ORM\Column(type: 'datetime', nullable: true)]
    private ?DateTimeInterface $token_expiration_date;

    #[ORM\Column(type: 'boolean')]
    private bool $reset_pass_mode_enabled;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): string
    {
        return $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials()
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
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

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function isActivated(): ?bool
    {
        return $this->activated;
    }

    public function setActivated(bool $activated): self
    {
        $this->activated = $activated;

        return $this;
    }

    public function getToken(): ?string
    {
        return $this->token;
    }

    public function setToken(?string $token): self
    {
        $this->token = $token;

        return $this;
    }

    public function getTokenExpirationDate(): ?DateTimeInterface
    {
        return $this->token_expiration_date;
    }

    public function setTokenExpirationDate(?DateTimeInterface $token_expiration_date): self
    {
        $this->token_expiration_date = $token_expiration_date;

        return $this;
    }

    public function isResetPassModeEnabled(): ?bool
    {
        return $this->reset_pass_mode_enabled;
    }

    public function setResetPassModeEnabled(bool $reset_pass_mode_enabled): self
    {
        $this->reset_pass_mode_enabled = $reset_pass_mode_enabled;

        return $this;
    }
}

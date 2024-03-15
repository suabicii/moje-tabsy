<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240315150239 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE qr_login_token ADD user_id INT NOT NULL');
        $this->addSql('ALTER TABLE qr_login_token ADD CONSTRAINT FK_5CF005A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_5CF005A76ED395 ON qr_login_token (user_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE qr_login_token DROP FOREIGN KEY FK_5CF005A76ED395');
        $this->addSql('DROP INDEX UNIQ_5CF005A76ED395 ON qr_login_token');
        $this->addSql('ALTER TABLE qr_login_token DROP user_id');
    }
}

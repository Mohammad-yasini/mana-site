CREATE TABLE IF NOT EXISTS `representation_requests` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `full_name` VARCHAR(150) NOT NULL,
  `company_name` VARCHAR(200) NULL,
  `phone` VARCHAR(40) NOT NULL,
  `email` VARCHAR(191) NULL,
  `city` VARCHAR(120) NULL,
  `activity_field` VARCHAR(200) NULL,
  `message` TEXT NULL,
  `status` VARCHAR(30) NOT NULL DEFAULT 'new',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `representation_requests_status` (`status`),
  KEY `representation_requests_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `brands` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(150) NOT NULL,
  `name_en` VARCHAR(150) NULL,
  `slug` VARCHAR(191) NOT NULL,
  `logo` VARCHAR(500) NULL,
  `description` TEXT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `brands_slug_unique` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `products` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `brand_id` INT NULL,
  `name` VARCHAR(255) NOT NULL,
  `name_en` VARCHAR(255) NULL,
  `slug` VARCHAR(191) NOT NULL,
  `cover_image` VARCHAR(500) NULL,
  `short_description` VARCHAR(1000) NULL,
  `body` MEDIUMTEXT NULL,
  `price` VARCHAR(100) NULL,
  `seo_title` VARCHAR(255) NULL,
  `seo_meta_description` VARCHAR(500) NULL,
  `published` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `products_slug_unique` (`slug`),
  KEY `products_brand_id` (`brand_id`),
  KEY `products_published` (`published`),
  CONSTRAINT `products_brand_fk` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO `brands` (`name`, `name_en`, `slug`, `logo`, `description`) VALUES
  ('محصولات دهو', 'Dehu', 'dehu', '/assets/images/img/Layer_1.png', 'محصولات دهو (Dehu) شامل دوربین‌های دیجیتال و نظارتی با کیفیت بالا است.'),
  ('تجهیزات برق ذخیره و پاور', 'UTEC', 'utec', '/assets/images/img/Isolation_Mode.png', 'تجهیزات برق ذخیره و پاور یوتک برای تأمین برق پایدار تجهیزات نظارتی.'),
  ('Hoom Link', 'Hoom Link', 'hi-link', '/assets/images/img/Layer_2.png', 'محصولات Hoom Link برای انتقال پایدار تصویر و داده در سیستم‌های نظارتی.'),
  ('خدمات گارانتی مانا سرویس', 'Mana Service', 'mana-service', '/assets/images/img/Layer_3.png', 'خدمات گارانتی و پشتیبانی فنی مانا سرویس برای محصولات امنیتی و نظارت تصویری.');

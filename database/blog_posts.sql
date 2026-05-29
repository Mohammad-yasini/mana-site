-- جداول وبلاگ (دسته‌ها + پست‌ها). ابتدا admins باید وجود داشته باشد.

CREATE TABLE IF NOT EXISTS `blog_categories` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(191) NOT NULL,
  `seo_title` VARCHAR(255) NULL,
  `meta_description` VARCHAR(500) NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `blog_categories_slug_unique` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `blog_posts` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `admin_id` INT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(191) NOT NULL,
  `excerpt` VARCHAR(500) NULL,
  `cover_image` VARCHAR(500) NULL,
  `category_id` INT NULL,
  `body` MEDIUMTEXT NOT NULL,
  `seo_title` VARCHAR(255) NULL,
  `seo_meta_description` VARCHAR(500) NULL,
  `published` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `blog_posts_slug_unique` (`slug`),
  KEY `blog_posts_admin_id` (`admin_id`),
  KEY `blog_posts_category_id` (`category_id`),
  CONSTRAINT `blog_posts_admin_fk` FOREIGN KEY (`admin_id`) REFERENCES `admins` (`id`) ON DELETE CASCADE,
  CONSTRAINT `blog_posts_category_fk` FOREIGN KEY (`category_id`) REFERENCES `blog_categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

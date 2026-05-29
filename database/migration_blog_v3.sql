-- اجرای یک‌باره روی دیتابیس‌هایی که قبلاً blog_posts قدیمی دارند.
-- اگر خطای «ستون وجود دارد» گرفتید، همان بخش را رد کنید.

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

ALTER TABLE `blog_posts`
  ADD COLUMN `cover_image` VARCHAR(500) NULL AFTER `excerpt`,
  ADD COLUMN `category_id` INT NULL AFTER `cover_image`,
  ADD COLUMN `seo_title` VARCHAR(255) NULL AFTER `body`,
  ADD COLUMN `seo_meta_description` VARCHAR(500) NULL AFTER `seo_title`;

ALTER TABLE `blog_posts`
  ADD KEY `blog_posts_category_id` (`category_id`);

ALTER TABLE `blog_posts`
  ADD CONSTRAINT `blog_posts_category_fk` FOREIGN KEY (`category_id`) REFERENCES `blog_categories` (`id`) ON DELETE SET NULL;

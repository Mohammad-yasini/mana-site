-- جدول سئوی برگه‌ها (صفحات ثابت سایت)
CREATE TABLE IF NOT EXISTS `page_seo` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `page_key` VARCHAR(64) NOT NULL,
  `seo_title` VARCHAR(255) NULL,
  `meta_description` VARCHAR(500) NULL,
  `meta_keywords` VARCHAR(500) NULL,
  `og_title` VARCHAR(255) NULL,
  `og_description` VARCHAR(500) NULL,
  `og_image` VARCHAR(500) NULL,
  `canonical_url` VARCHAR(500) NULL,
  `no_index` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `page_seo_key_unique` (`page_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

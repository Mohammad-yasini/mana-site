-- محصولات Utec (utec)
-- این فایل را روی دیتابیس اجرا کن: mysql -u USER -p DATABASE < database/seed_utec_products.sql

-- حذف محصولات قدیمیِ قبلی
DELETE p
FROM `products` p
JOIN `brands` b ON p.brand_id = b.id
WHERE b.slug = 'utec'
  AND p.slug IN (
    'utec-adapter-12v-2a',
    'utec-power-5a',
    'utec-trans'
  );

INSERT INTO `products`
  (`brand_id`, `name`, `name_en`, `slug`, `cover_image`, `short_description`, `body`, `price`, `published`)
SELECT
  b.id,
  vals.name,
  vals.name_en,
  vals.slug,
  vals.cover_image,
  vals.short_description,
  vals.body,
  'تماس بگیرید' AS price,
  1 AS published
FROM `brands` b
JOIN (
  SELECT
    'دستگاه UT-1215A' AS name,
    'UTEC UT-1215A UPS 12V 15A' AS name_en,
    'utec-ut-1215a' AS slug,
    '/assets/images/img/catalog4.png' AS cover_image,
    'آی پی اس ۱۲ ولت ۱۵ آمپر' AS short_description,
    '<p><strong>دستگاه UT-1215A</strong></p><p>آی پی اس ۱۲ ولت ۱۵ آمپر</p>' AS body
  UNION ALL SELECT
    'دستگاه UT-1230A',
    'UTEC UT-1230A UPS 12V 30A',
    'utec-ut-1230a',
    '/assets/images/img/catalog4.png',
    'آی پی اس ۱۲ ولت ۳۰ آمپر',
    '<p><strong>دستگاه UT-1230A</strong></p><p>آی پی اس ۱۲ ولت ۳۰ آمپر</p>'
  UNION ALL SELECT
    'دستگاه UT-1215A-B',
    'UTEC UT-1215A-B UPS 12V 15A (Battery Enclosure)',
    'utec-ut-1215a-b',
    '/assets/images/img/catalog4.png',
    'آی پی اس ۱۲ ولت ۱۵ آمپر با محفظه باتری',
    '<p><strong>دستگاه UT-1215A-B</strong></p><p>آی پی اس ۱۲ ولت ۱۵ آمپر با محفظه باتری</p>'
  UNION ALL SELECT
    'دستگاه UT-1230A-B',
    'UTEC UT-1230A-B UPS 12V 30A (Battery Enclosure)',
    'utec-ut-1230a-b',
    '/assets/images/img/catalog4.png',
    'آی پی اس ۱۲ ولت ۳۰ آمپر با محفظه باتری',
    '<p><strong>دستگاه UT-1230A-B</strong></p><p>آی پی اس ۱۲ ولت ۳۰ آمپر با محفظه باتری</p>'
) AS vals
WHERE b.slug = 'utec'
ON DUPLICATE KEY UPDATE
  `brand_id` = VALUES(`brand_id`),
  `name` = VALUES(`name`),
  `name_en` = VALUES(`name_en`),
  `cover_image` = VALUES(`cover_image`),
  `short_description` = VALUES(`short_description`),
  `body` = VALUES(`body`),
  `price` = VALUES(`price`),
  `published` = VALUES(`published`);


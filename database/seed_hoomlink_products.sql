-- محصولات Hoom Link (hi-link)
-- این فایل را روی دیتابیس اجرا کن: mysql -u USER -p DATABASE < database/seed_hoomlink_products.sql

-- حذف محصولات قدیمیِ قبلی برای جلوگیری از نمایش نام‌های اشتباه
DELETE p
FROM `products` p
JOIN `brands` b ON p.brand_id = b.id
WHERE b.slug = 'hi-link'
  AND p.slug IN (
    'hi-link-rg59',
    'hi-link-cat6',
    'hi-link-bnc'
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
    'کابل ترکیبی 0.7cu×96 ccam + 2×0.50' AS name,
    'Hoom Link Combo 0.7cu x96 + 2 x0.50' AS name_en,
    'hi-link-combo-0-7cu-96-ccam-2x0-50' AS slug,
    '/assets/images/img/catalog1.png' AS cover_image,
    'مغز0.7 با شیلد96 و برق 2 در 0.5' AS short_description,
    '<p><strong>کابل ترکیبی 0.7cu×96 ccam + 2×0.50</strong></p><p>مغز0.7 با شیلد96 و برق 2 در 0.5</p>' AS body
  UNION ALL SELECT
    'کابل ترکیبی 0.7cu×96 ccam + 2×0.75',
    'Hoom Link Combo 0.7cu x96 + 2 x0.75',
    'hi-link-combo-0-7cu-96-ccam-2x0-75',
    '/assets/images/img/catalog1.png',
    'مغز0.7 با شیلد96 و برق 2 در 0.75',
    '<p><strong>کابل ترکیبی 0.7cu×96 ccam + 2×0.75</strong></p><p>مغز0.7 با شیلد96 و برق 2 در 0.75</p>'
  UNION ALL SELECT
    'کابل شبکه تمام مس cat6 utp 0.48',
    'Hoom Link Cat6 UTP Pure Copper 0.48',
    'hi-link-cat6-utp-0-48',
    '/assets/images/img/catalog2.png',
    'کابل شبکه تمام مس cat6 utp 0.48',
    '<p><strong>کابل شبکه تمام مس cat6 utp 0.48</strong></p>'
  UNION ALL SELECT
    'کابل شبکه تمام مس cat6 utp 0.50',
    'Hoom Link Cat6 UTP Pure Copper 0.50',
    'hi-link-cat6-utp-0-50',
    '/assets/images/img/catalog2.png',
    'کابل شبکه تمام مس cat6 utp 0.50',
    '<p><strong>کابل شبکه تمام مس cat6 utp 0.50</strong></p>'
  UNION ALL SELECT
    'کابل شبکه تمام مس cat6 sftp 0.50',
    'Hoom Link Cat6 SFTP Pure Copper 0.50',
    'hi-link-cat6-sftp-0-50',
    '/assets/images/img/catalog3.png',
    'کابل شبکه تمام مس cat6 sftp 0.50',
    '<p><strong>کابل شبکه تمام مس cat6 sftp 0.50</strong></p>'
  UNION ALL SELECT
    'کابل شیلد و فویل دار با ضخامت سطح مقطع 0.5میلیمتر',
    'Hoom Link Shielded Foil Cable 0.5mm²',
    'hi-link-sftp-0-5mm2',
    '/assets/images/img/catalog3.png',
    'کابل شیلد و فویل دار با ضخامت سطح مقطع 0.5میلیمتر',
    '<p><strong>کابل شیلد و فویل دار با ضخامت سطح مقطع 0.5میلیمتر</strong></p>'
  UNION ALL SELECT
    'کابل شبکه تمام مس cat6 sftp 0.52',
    'Hoom Link Cat6 SFTP Pure Copper 0.52',
    'hi-link-cat6-sftp-0-52',
    '/assets/images/img/catalog3.png',
    'کابل شبکه تمام مس cat6 sftp 0.52',
    '<p><strong>کابل شبکه تمام مس cat6 sftp 0.52</strong></p>'
  UNION ALL SELECT
    'کابل شیلد و فویل دار با ضخامت سطح مقطع 0.52میلیمتر',
    'Hoom Link Shielded Foil Cable 0.52mm²',
    'hi-link-sftp-0-52mm2',
    '/assets/images/img/catalog3.png',
    'کابل شیلد و فویل دار با ضخامت سطح مقطع 0.52میلیمتر',
    '<p><strong>کابل شیلد و فویل دار با ضخامت سطح مقطع 0.52میلیمتر</strong></p>'
) AS vals
WHERE b.slug = 'hi-link'
ON DUPLICATE KEY UPDATE
  `brand_id` = VALUES(`brand_id`),
  `name` = VALUES(`name`),
  `name_en` = VALUES(`name_en`),
  `cover_image` = VALUES(`cover_image`),
  `short_description` = VALUES(`short_description`),
  `body` = VALUES(`body`),
  `price` = VALUES(`price`),
  `published` = VALUES(`published`);


UPDATE `brands`
SET
  `name` = 'محصولات دهو',
  `name_en` = 'Dehu',
  `description` = 'محصولات دهو (Dehu) شامل دوربین‌های دیجیتال و نظارتی با کیفیت بالا است.'
WHERE `slug` = 'dehu';

UPDATE `brands`
SET
  `name` = 'تجهیزات برق ذخیره و پاور',
  `name_en` = 'UTEC',
  `description` = 'تجهیزات برق ذخیره و پاور یوتک برای تأمین برق پایدار تجهیزات نظارتی.'
WHERE `slug` = 'utec';

UPDATE `brands`
SET
  `name` = 'Hoom Link',
  `name_en` = 'Hoom Link',
  `description` = 'محصولات Hoom Link برای انتقال پایدار تصویر و داده در سیستم‌های نظارتی.'
WHERE `slug` = 'hi-link';

UPDATE `products`
SET `name_en` = REPLACE(`name_en`, 'Hi-Link', 'Hoom Link')
WHERE `name_en` LIKE '%Hi-Link%';

UPDATE `products`
SET `name` = REPLACE(`name`, 'های‌لینک', 'Hoom Link')
WHERE `name` LIKE '%های‌لینک%';

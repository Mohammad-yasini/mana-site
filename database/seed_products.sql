-- محصولات نمونه برای برندها. اجرای دوباره امن است (slug یکتا + INSERT IGNORE).

-- محصولات Dehu: database/seed_dehu_products.sql

-- یوتک (تجهیزات برق ذخیره و پاور)
INSERT IGNORE INTO `products` (`brand_id`, `name`, `name_en`, `slug`, `cover_image`, `short_description`, `body`, `price`, `published`)
SELECT b.id, 'آداپتور ۱۲ ولت ۲ آمپر یوتک', 'UTEC 12V 2A Adapter', 'utec-adapter-12v-2a', '/assets/images/img/catalog2.png',
       'آداپتور پایدار ۱۲ ولت برای تغذیه دوربین مداربسته.',
       '<p>آداپتور ۱۲ ولت ۲ آمپر یوتک با خروجی پایدار و محافظت در برابر نوسانات برق.</p>',
       'تماس بگیرید', 1
FROM `brands` b WHERE b.slug = 'utec';

INSERT IGNORE INTO `products` (`brand_id`, `name`, `name_en`, `slug`, `cover_image`, `short_description`, `body`, `price`, `published`)
SELECT b.id, 'منبع تغذیه سوئیچینگ یوتک ۵ آمپر', 'UTEC Switching 5A', 'utec-power-5a', '/assets/images/img/catalog3.png',
       'منبع تغذیه مرکزی برای تغذیه هم‌زمان چند دوربین.',
       '<p>منبع تغذیه سوئیچینگ یوتک ۵ آمپر مناسب پروژه‌های چنددوربینه با خروجی پایدار.</p>',
       'تماس بگیرید', 1
FROM `brands` b WHERE b.slug = 'utec';

INSERT IGNORE INTO `products` (`brand_id`, `name`, `name_en`, `slug`, `cover_image`, `short_description`, `body`, `price`, `published`)
SELECT b.id, 'ترانس برق صنعتی یوتک', 'UTEC Industrial Transformer', 'utec-trans', '/assets/images/img/catalog4.png',
       'ترانس برق صنعتی با دوام بالا برای تأسیسات.',
       '<p>ترانس برق صنعتی یوتک برای تأمین برق پایدار تجهیزات نظارتی در محیط‌های صنعتی.</p>',
       'تماس بگیرید', 1
FROM `brands` b WHERE b.slug = 'utec';

-- Hoom Link (کابل و اتصالات)
INSERT IGNORE INTO `products` (`brand_id`, `name`, `name_en`, `slug`, `cover_image`, `short_description`, `body`, `price`, `published`)
SELECT b.id, 'کابل کواکسیال Hoom Link RG59', 'Hoom Link RG59', 'hi-link-rg59', '/assets/images/img/catalog1.png',
       'کابل کواکسیال باکیفیت برای انتقال تصویر آنالوگ.',
       '<p>کابل کواکسیال Hoom Link RG59 با هادی مرغوب برای انتقال پایدار تصویر دوربین‌های آنالوگ.</p>',
       'تماس بگیرید', 1
FROM `brands` b WHERE b.slug = 'hi-link';

INSERT IGNORE INTO `products` (`brand_id`, `name`, `name_en`, `slug`, `cover_image`, `short_description`, `body`, `price`, `published`)
SELECT b.id, 'کابل شبکه CAT6 Hoom Link', 'Hoom Link CAT6', 'hi-link-cat6', '/assets/images/img/catalog2.png',
       'کابل شبکه CAT6 برای دوربین‌های تحت شبکه.',
       '<p>کابل شبکه CAT6 Hoom Link مناسب انتقال داده و تصویر دوربین‌های IP با سرعت بالا.</p>',
       'تماس بگیرید', 1
FROM `brands` b WHERE b.slug = 'hi-link';

INSERT IGNORE INTO `products` (`brand_id`, `name`, `name_en`, `slug`, `cover_image`, `short_description`, `body`, `price`, `published`)
SELECT b.id, 'کانکتور BNC Hoom Link', 'Hoom Link BNC Connector', 'hi-link-bnc', '/assets/images/img/catalog3.png',
       'کانکتور BNC مرغوب برای اتصال کابل کواکسیال.',
       '<p>کانکتور BNC Hoom Link برای اتصال مطمئن کابل کواکسیال به دوربین و دستگاه ضبط.</p>',
       'تماس بگیرید', 1
FROM `brands` b WHERE b.slug = 'hi-link';

-- مانا سرویس (خدمات)
INSERT IGNORE INTO `products` (`brand_id`, `name`, `name_en`, `slug`, `cover_image`, `short_description`, `body`, `price`, `published`)
SELECT b.id, 'نصب و راه‌اندازی سیستم نظارتی', 'Installation Service', 'mana-service-installation', '/assets/images/img/banner2.png',
       'خدمات نصب حرفه‌ای دوربین و تجهیزات نظارتی.',
       '<p>خدمات نصب و راه‌اندازی سیستم نظارت تصویری توسط کارشناسان مانا سرویس، همراه با تنظیم و آموزش.</p>',
       'تماس بگیرید', 1
FROM `brands` b WHERE b.slug = 'mana-service';

INSERT IGNORE INTO `products` (`brand_id`, `name`, `name_en`, `slug`, `cover_image`, `short_description`, `body`, `price`, `published`)
SELECT b.id, 'گارانتی و تعمیر دوربین مداربسته', 'Warranty & Repair', 'mana-service-warranty', '/assets/images/img/banner1.png',
       'خدمات گارانتی و تعمیر تخصصی تجهیزات نظارتی.',
       '<p>خدمات گارانتی و تعمیر تخصصی دوربین مداربسته و تجهیزات جانبی با قطعات اصلی.</p>',
       'تماس بگیرید', 1
FROM `brands` b WHERE b.slug = 'mana-service';

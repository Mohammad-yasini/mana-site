-- کاتالوگ محصولات Dehu. اجرای دوباره با ON DUPLICATE KEY UPDATE امن است.

DELETE FROM `products`
WHERE `slug` IN ('dehu-dh-2200', 'dehu-ip-pro', 'dehu-ahd-1080', 'dehu-nvr-8ch');

INSERT INTO `products` (`brand_id`, `name`, `name_en`, `slug`, `cover_image`, `short_description`, `body`, `price`, `published`)
SELECT b.id, vals.name, vals.name_en, vals.slug, vals.cover_image, vals.short_description, vals.body, 'تماس بگیرید', 1
FROM `brands` b
JOIN (
  SELECT 'دو مگ بالت' AS name, 'Du-H-1200SB-L4' AS name_en, 'dehu-du-h-1200sb-l4' AS slug,
         '/assets/images/img/Cameras1.png' AS cover_image,
         'دوربین AHD دهو — دو مگاپیکسل بالت' AS short_description,
         '<p>مدل <strong>Du-H-1200SB-L4</strong> از سری <strong>محصولات AHD</strong> برند Dehu.</p>' AS body
  UNION ALL SELECT 'دو مگ بالت', 'Du-H-1200KB-L4', 'dehu-du-h-1200kb-l4', '/assets/images/img/Cameras1.png',
         'دوربین AHD دهو — دو مگاپیکسل بالت',
         '<p>مدل <strong>Du-H-1200KB-L4</strong> از سری <strong>محصولات AHD</strong> برند Dehu.</p>'
  UNION ALL SELECT 'دو مگ دام', 'Du-H-1200TD-L2', 'dehu-du-h-1200td-l2', '/assets/images/img/Cameras1.png',
         'دوربین AHD دهو — دو مگاپیکسل دام',
         '<p>مدل <strong>Du-H-1200TD-L2</strong> از سری <strong>محصولات AHD</strong> برند Dehu.</p>'
  UNION ALL SELECT 'دو مگ بالت صدادار', 'Du-H-1200AD-L2A', 'dehu-du-h-1200ad-l2a', '/assets/images/img/Cameras1.png',
         'دوربین AHD دهو — دو مگاپیکسل بالت صدادار',
         '<p>مدل <strong>Du-H-1200AD-L2A</strong> از سری <strong>محصولات AHD</strong> برند Dehu.</p>'
  UNION ALL SELECT 'پنج مگ بالت', 'Du-H-1500DB-L2', 'dehu-du-h-1500db-l2', '/assets/images/img/Cameras1.png',
         'دوربین AHD دهو — پنج مگاپیکسل بالت',
         '<p>مدل <strong>Du-H-1500DB-L2</strong> از سری <strong>محصولات AHD</strong> برند Dehu.</p>'
  UNION ALL SELECT 'پنج مگ بالت صدادار', 'Du-H-1500AD-L2A', 'dehu-du-h-1500ad-l2a', '/assets/images/img/Cameras1.png',
         'دوربین AHD دهو — پنج مگاپیکسل بالت صدادار',
         '<p>مدل <strong>Du-H-1500AD-L2A</strong> از سری <strong>محصولات AHD</strong> برند Dehu.</p>'
  UNION ALL SELECT 'پنج مگ بالت سنسور سونی', 'Du-H-1510GB-L4', 'dehu-du-h-1510gb-l4', '/assets/images/img/Cameras1.png',
         'دوربین AHD دهو — پنج مگاپیکسل بالت با سنسور سونی',
         '<p>مدل <strong>Du-H-1510GB-L4</strong> از سری <strong>محصولات AHD</strong> برند Dehu.</p>'
  UNION ALL SELECT 'چهار کاناله هوش مصنوعی', 'Du-XVR5045J-ai', 'dehu-du-xvr5045j-ai', '/assets/images/img/CamBox.png',
         'دستگاه ضبط AHD دهو — چهار کاناله هوش مصنوعی',
         '<p>مدل <strong>Du-XVR5045J-ai</strong> از سری <strong>AHD Digital Video Recorder</strong> برند Dehu.</p>'
  UNION ALL SELECT 'هشت کاناله هوش مصنوعی', 'Du-XVR5085J-ai', 'dehu-du-xvr5085j-ai', '/assets/images/img/CamBox.png',
         'دستگاه ضبط AHD دهو — هشت کاناله هوش مصنوعی',
         '<p>مدل <strong>Du-XVR5085J-ai</strong> از سری <strong>AHD Digital Video Recorder</strong> برند Dehu.</p>'
  UNION ALL SELECT 'شانزده کاناله هوش مصنوعی', 'Du-XVR5016J-ai', 'dehu-du-xvr5016j-ai', '/assets/images/img/CamBox.png',
         'دستگاه ضبط AHD دهو — شانزده کاناله هوش مصنوعی',
         '<p>مدل <strong>Du-XVR5016J-ai</strong> از سری <strong>AHD Digital Video Recorder</strong> برند Dehu.</p>'
  UNION ALL SELECT 'شانزده کاناله معمولی', 'Du-DVR5016-5H', 'dehu-du-dvr5016-5h', '/assets/images/img/CamBox.png',
         'دستگاه ضبط AHD دهو — شانزده کاناله معمولی',
         '<p>مدل <strong>Du-DVR5016-5H</strong> از سری <strong>AHD Digital Video Recorder</strong> برند Dehu.</p>'
  UNION ALL SELECT 'پنج مگ اقتصادی بالت', 'Du-P-2500DB-L2', 'dehu-du-p-2500db-l2', '/assets/images/img/camera2.png',
         'دوربین IP دهو — پنج مگاپیکسل اقتصادی بالت',
         '<p>مدل <strong>Du-P-2500DB-L2</strong> از سری <strong>محصولات IP</strong> برند Dehu.</p>'
  UNION ALL SELECT 'پنج مگ بالت سنسور سونی', 'Du-P-2510SB-L4', 'dehu-du-p-2510sb-l4', '/assets/images/img/camera2.png',
         'دوربین IP دهو — پنج مگاپیکسل بالت با سنسور سونی',
         '<p>مدل <strong>Du-P-2510SB-L4</strong> از سری <strong>محصولات IP</strong> برند Dehu.</p>'
  UNION ALL SELECT 'پنج مگ دام سنسور سونی', 'Du-P-2510PD-L4', 'dehu-du-p-2510pd-l4', '/assets/images/img/camera2.png',
         'دوربین IP دهو — پنج مگاپیکسل دام با سنسور سونی',
         '<p>مدل <strong>Du-P-2510PD-L4</strong> از سری <strong>محصولات IP</strong> برند Dehu.</p>'
  UNION ALL SELECT 'پنج مگ بالت بزرگ سنسور سونی', 'Du-P-2510HB-L6', 'dehu-du-p-2510hb-l6', '/assets/images/img/camera2.png',
         'دوربین IP دهو — پنج مگاپیکسل بالت بزرگ با سنسور سونی',
         '<p>مدل <strong>Du-P-2510HB-L6</strong> از سری <strong>محصولات IP</strong> برند Dehu.</p>'
  UNION ALL SELECT 'پنج مگ بالت بزرگ موتورایز سنسور سونی', 'Du-P-2510HB-L6-Z', 'dehu-du-p-2510hb-l6-z', '/assets/images/img/camera2.png',
         'دوربین IP دهو — پنج مگاپیکسل بالت بزرگ موتورایز با سنسور سونی',
         '<p>مدل <strong>Du-P-2510HB-L6-Z</strong> از سری <strong>محصولات IP</strong> برند Dehu.</p>'
  UNION ALL SELECT 'هشت مگ بالت سنسور سونی', 'Du-P-2811SB-L4', 'dehu-du-p-2811sb-l4', '/assets/images/img/camera2.png',
         'دوربین IP دهو — هشت مگاپیکسل بالت با سنسور سونی',
         '<p>مدل <strong>Du-P-2811SB-L4</strong> از سری <strong>محصولات IP</strong> برند Dehu.</p>'
  UNION ALL SELECT 'هشت مگ دام سنسور سونی', 'Du-P-2811PD-L4', 'dehu-du-p-2811pd-l4', '/assets/images/img/camera2.png',
         'دوربین IP دهو — هشت مگاپیکسل دام با سنسور سونی',
         '<p>مدل <strong>Du-P-2811PD-L4</strong> از سری <strong>محصولات IP</strong> برند Dehu.</p>'
  UNION ALL SELECT 'هشت مگ بالت بزرگ سنسور سونی', 'Du-P-2811HB-L6', 'dehu-du-p-2811hb-l6', '/assets/images/img/camera2.png',
         'دوربین IP دهو — هشت مگاپیکسل بالت بزرگ با سنسور سونی',
         '<p>مدل <strong>Du-P-2811HB-L6</strong> از سری <strong>محصولات IP</strong> برند Dehu.</p>'
  UNION ALL SELECT 'پنج مگ تشخیص چهره', 'Du-P-3500KB-L4-F-S', 'dehu-du-p-3500kb-l4-f-s', '/assets/images/img/camera2.png',
         'دوربین IP دهو — پنج مگاپیکسل با قابلیت تشخیص چهره',
         '<p>مدل <strong>Du-P-3500KB-L4-F-S</strong> از سری <strong>محصولات IP</strong> برند Dehu.</p>'
  UNION ALL SELECT 'پنج مگ پلاک خوان', 'Du-P-3500HB-L6-LP', 'dehu-du-p-3500hb-l6-lp', '/assets/images/img/camera2.png',
         'دوربین IP دهو — پنج مگاپیکسل پلاک‌خوان',
         '<p>مدل <strong>Du-P-3500HB-L6-LP</strong> از سری <strong>محصولات IP</strong> برند Dehu.</p>'
  UNION ALL SELECT 'ده کاناله هوش مصنوعی یک هارد', 'Du-NVR7110J-4K-1S', 'dehu-du-nvr7110j-4k-1s', '/assets/images/img/CamBox.png',
         'دستگاه ضبط NVR دهو — ده کاناله هوش مصنوعی با یک هارد',
         '<p>مدل <strong>Du-NVR7110J-4K-1S</strong> از سری <strong>Network AI Video Recorder</strong> برند Dehu.</p>'
  UNION ALL SELECT 'شانزده کاناله هوش مصنوعی یک هارد', 'Du-NVR7116J-4K-1S', 'dehu-du-nvr7116j-4k-1s', '/assets/images/img/CamBox.png',
         'دستگاه ضبط NVR دهو — شانزده کاناله هوش مصنوعی با یک هارد',
         '<p>مدل <strong>Du-NVR7116J-4K-1S</strong> از سری <strong>Network AI Video Recorder</strong> برند Dehu.</p>'
  UNION ALL SELECT 'شانزده کاناله هوش مصنوعی دو هارد', 'Du-NVR7116J-4K-2S', 'dehu-du-nvr7116j-4k-2s', '/assets/images/img/CamBox.png',
         'دستگاه ضبط NVR دهو — شانزده کاناله هوش مصنوعی با دو هارد',
         '<p>مدل <strong>Du-NVR7116J-4K-2S</strong> از سری <strong>Network AI Video Recorder</strong> برند Dehu.</p>'
  UNION ALL SELECT 'سی و شش کاناله هوش مصنوعی دو هارد', 'Du-NVR7136J-4K-2S', 'dehu-du-nvr7136j-4k-2s', '/assets/images/img/CamBox.png',
         'دستگاه ضبط NVR دهو — سی‌و‌شش کاناله هوش مصنوعی با دو هارد',
         '<p>مدل <strong>Du-NVR7136J-4K-2S</strong> از سری <strong>Network AI Video Recorder</strong> برند Dehu.</p>'
) AS vals
WHERE b.slug = 'dehu'
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `name_en` = VALUES(`name_en`),
  `cover_image` = VALUES(`cover_image`),
  `short_description` = VALUES(`short_description`),
  `body` = VALUES(`body`),
  `brand_id` = VALUES(`brand_id`),
  `published` = 1;

UPDATE `brands`
SET
  `description` = 'محصولات Dehu شامل دوربین‌های AHD، دوربین‌های IP، دستگاه ضبط XVR/DVR و NVR هوش مصنوعی است.'
WHERE `slug` = 'dehu';

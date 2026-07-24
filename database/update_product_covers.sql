-- Set product cover images from Desktop «محصولات مانا» folders (optimized webp).
UPDATE `products` SET `cover_image` = '/uploads/products/folder1-1.webp' WHERE `slug` IN (
  'dehu-du-nvr7110j-4k-1s','dehu-du-nvr7116j-4k-1s','dehu-du-nvr7116j-4k-2s','dehu-du-nvr7136j-4k-2s'
);
UPDATE `products` SET `cover_image` = '/uploads/products/folder2-1.webp' WHERE `slug` = 'dehu-du-dvr5016-5h';
UPDATE `products` SET `cover_image` = '/uploads/products/folder3-1.webp' WHERE `slug` IN (
  'dehu-du-xvr5045j-ai','dehu-du-xvr5085j-ai','dehu-du-xvr5016j-ai'
);
UPDATE `products` SET `cover_image` = '/uploads/products/folder4-1.webp' WHERE `slug` = 'utec-ut-1215a';
UPDATE `products` SET `cover_image` = '/uploads/products/folder5-1.webp' WHERE `slug` IN (
  'dehu-du-h-1200sb-l4','dehu-du-p-2510sb-l4','dehu-du-p-2811sb-l4'
);
UPDATE `products` SET `cover_image` = '/uploads/products/folder6-1.webp' WHERE `slug` IN (
  'dehu-du-h-1200kb-l4','dehu-du-p-3500kb-l4-f-s'
);
UPDATE `products` SET `cover_image` = '/uploads/products/folder7-1.webp' WHERE `slug` IN (
  'dehu-du-h-1200ad-l2a','dehu-du-h-1500db-l2','dehu-du-h-1500ad-l2a','dehu-du-p-2500db-l2'
);
UPDATE `products` SET `cover_image` = '/uploads/products/folder8-1.webp' WHERE `slug` IN (
  'dehu-du-p-2510hb-l6','dehu-du-p-2510hb-l6-z','dehu-du-p-2811hb-l6','dehu-du-p-3500hb-l6-lp'
);
UPDATE `products` SET `cover_image` = '/uploads/products/folder9-1.webp' WHERE `slug` = 'dehu-du-h-1510gb-l4';
UPDATE `products` SET `cover_image` = '/uploads/products/folder10-1.webp' WHERE `slug` = 'dehu-du-h-1200td-l2';
UPDATE `products` SET `cover_image` = '/uploads/products/folder11-1.webp' WHERE `slug` IN (
  'dehu-du-p-2510pd-l4','dehu-du-p-2811pd-l4'
);
UPDATE `products` SET `cover_image` = '/uploads/products/folder12-1.webp' WHERE `slug` IN (
  'utec-ut-1215a-b','utec-ut-1230a-b'
);
UPDATE `products` SET `cover_image` = '/uploads/products/folder13-1.webp' WHERE `slug` = 'utec-ut-1230a';

-- Append gallery images into body (only when not already present)
UPDATE `products`
SET `body` = CONCAT(
  COALESCE(`body`, ''),
  '<div class="product-gallery">',
  '<img src="/uploads/products/folder1-1.webp" alt="" loading="lazy" />',
  '<img src="/uploads/products/folder1-2.webp" alt="" loading="lazy" />',
  '</div>'
)
WHERE `slug` IN ('dehu-du-nvr7110j-4k-1s','dehu-du-nvr7116j-4k-1s','dehu-du-nvr7116j-4k-2s','dehu-du-nvr7136j-4k-2s')
  AND (`body` IS NULL OR `body` NOT LIKE '%folder1-1.webp%');

UPDATE `products`
SET `body` = CONCAT(
  COALESCE(`body`, ''),
  '<div class="product-gallery">',
  '<img src="/uploads/products/folder2-1.webp" alt="" loading="lazy" />',
  '<img src="/uploads/products/folder2-2.webp" alt="" loading="lazy" />',
  '</div>'
)
WHERE `slug` = 'dehu-du-dvr5016-5h'
  AND (`body` IS NULL OR `body` NOT LIKE '%folder2-1.webp%');

UPDATE `products`
SET `body` = CONCAT(
  COALESCE(`body`, ''),
  '<div class="product-gallery">',
  '<img src="/uploads/products/folder3-1.webp" alt="" loading="lazy" />',
  '<img src="/uploads/products/folder3-2.webp" alt="" loading="lazy" />',
  '<img src="/uploads/products/folder3-3.webp" alt="" loading="lazy" />',
  '</div>'
)
WHERE `slug` IN ('dehu-du-xvr5045j-ai','dehu-du-xvr5085j-ai','dehu-du-xvr5016j-ai')
  AND (`body` IS NULL OR `body` NOT LIKE '%folder3-1.webp%');

UPDATE `products`
SET `body` = CONCAT(
  COALESCE(`body`, ''),
  '<div class="product-gallery">',
  '<img src="/uploads/products/folder4-1.webp" alt="" loading="lazy" />',
  '<img src="/uploads/products/folder4-2.webp" alt="" loading="lazy" />',
  '</div>'
)
WHERE `slug` = 'utec-ut-1215a'
  AND (`body` IS NULL OR `body` NOT LIKE '%folder4-1.webp%');

UPDATE `products`
SET `body` = CONCAT(
  COALESCE(`body`, ''),
  '<div class="product-gallery">',
  '<img src="/uploads/products/folder5-1.webp" alt="" loading="lazy" />',
  '<img src="/uploads/products/folder5-2.webp" alt="" loading="lazy" />',
  '</div>'
)
WHERE `slug` IN ('dehu-du-h-1200sb-l4','dehu-du-p-2510sb-l4','dehu-du-p-2811sb-l4')
  AND (`body` IS NULL OR `body` NOT LIKE '%folder5-1.webp%');

UPDATE `products`
SET `body` = CONCAT(
  COALESCE(`body`, ''),
  '<div class="product-gallery">',
  '<img src="/uploads/products/folder6-1.webp" alt="" loading="lazy" />',
  '<img src="/uploads/products/folder6-2.webp" alt="" loading="lazy" />',
  '</div>'
)
WHERE `slug` IN ('dehu-du-h-1200kb-l4','dehu-du-p-3500kb-l4-f-s')
  AND (`body` IS NULL OR `body` NOT LIKE '%folder6-1.webp%');

UPDATE `products`
SET `body` = CONCAT(
  COALESCE(`body`, ''),
  '<div class="product-gallery">',
  '<img src="/uploads/products/folder7-1.webp" alt="" loading="lazy" />',
  '</div>'
)
WHERE `slug` IN ('dehu-du-h-1200ad-l2a','dehu-du-h-1500db-l2','dehu-du-h-1500ad-l2a','dehu-du-p-2500db-l2')
  AND (`body` IS NULL OR `body` NOT LIKE '%folder7-1.webp%');

UPDATE `products`
SET `body` = CONCAT(
  COALESCE(`body`, ''),
  '<div class="product-gallery">',
  '<img src="/uploads/products/folder8-1.webp" alt="" loading="lazy" />',
  '<img src="/uploads/products/folder8-2.webp" alt="" loading="lazy" />',
  '</div>'
)
WHERE `slug` IN ('dehu-du-p-2510hb-l6','dehu-du-p-2510hb-l6-z','dehu-du-p-2811hb-l6','dehu-du-p-3500hb-l6-lp')
  AND (`body` IS NULL OR `body` NOT LIKE '%folder8-1.webp%');

UPDATE `products`
SET `body` = CONCAT(
  COALESCE(`body`, ''),
  '<div class="product-gallery">',
  '<img src="/uploads/products/folder9-1.webp" alt="" loading="lazy" />',
  '<img src="/uploads/products/folder9-2.webp" alt="" loading="lazy" />',
  '</div>'
)
WHERE `slug` = 'dehu-du-h-1510gb-l4'
  AND (`body` IS NULL OR `body` NOT LIKE '%folder9-1.webp%');

UPDATE `products`
SET `body` = CONCAT(
  COALESCE(`body`, ''),
  '<div class="product-gallery">',
  '<img src="/uploads/products/folder10-1.webp" alt="" loading="lazy" />',
  '<img src="/uploads/products/folder10-2.webp" alt="" loading="lazy" />',
  '</div>'
)
WHERE `slug` = 'dehu-du-h-1200td-l2'
  AND (`body` IS NULL OR `body` NOT LIKE '%folder10-1.webp%');

UPDATE `products`
SET `body` = CONCAT(
  COALESCE(`body`, ''),
  '<div class="product-gallery">',
  '<img src="/uploads/products/folder11-1.webp" alt="" loading="lazy" />',
  '<img src="/uploads/products/folder11-2.webp" alt="" loading="lazy" />',
  '</div>'
)
WHERE `slug` IN ('dehu-du-p-2510pd-l4','dehu-du-p-2811pd-l4')
  AND (`body` IS NULL OR `body` NOT LIKE '%folder11-1.webp%');

UPDATE `products`
SET `body` = CONCAT(
  COALESCE(`body`, ''),
  '<div class="product-gallery">',
  '<img src="/uploads/products/folder12-1.webp" alt="" loading="lazy" />',
  '<img src="/uploads/products/folder12-2.webp" alt="" loading="lazy" />',
  '</div>'
)
WHERE `slug` IN ('utec-ut-1215a-b','utec-ut-1230a-b')
  AND (`body` IS NULL OR `body` NOT LIKE '%folder12-1.webp%');

UPDATE `products`
SET `body` = CONCAT(
  COALESCE(`body`, ''),
  '<div class="product-gallery">',
  '<img src="/uploads/products/folder13-1.webp" alt="" loading="lazy" />',
  '<img src="/uploads/products/folder13-2.webp" alt="" loading="lazy" />',
  '</div>'
)
WHERE `slug` = 'utec-ut-1230a'
  AND (`body` IS NULL OR `body` NOT LIKE '%folder13-1.webp%');

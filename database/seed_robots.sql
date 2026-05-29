INSERT INTO `site_robots_config` (`id`, `content`) VALUES (
  1,
  'User-agent: *
Allow: /
Disallow: /dashboard
Disallow: /api/
Disallow: /login

Sitemap: https://manaelectronic.com/sitemap.xml
Host: https://manaelectronic.com'
)
ON DUPLICATE KEY UPDATE `content` = VALUES(`content`);

export const SITE_BASE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.SITE_URL ||
  "https://manaelectronic.com"
).replace(/\/$/, "");

export const DEFAULT_ROBOTS_TXT = `User-agent: *
Allow: /
Disallow: /dashboard
Disallow: /api/
Disallow: /login

Sitemap: ${SITE_BASE_URL}/sitemap.xml
Host: ${SITE_BASE_URL}
`;

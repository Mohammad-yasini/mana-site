import type { MetadataRoute } from "next";
import { getPool } from "@/lib/db";

const BASE_URL = (process.env.SITE_URL || "https://manaelectronic.com").replace(/\/$/, "");

export const dynamic = "force-dynamic";

async function rows(sql: string): Promise<{ slug: string }[]> {
  try {
    const pool = getPool();
    const [r] = await pool.query(sql);
    return (r as { slug: string }[]).filter((x) => x && x.slug);
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticPaths = ["", "/about", "/services", "/contact", "/blog", "/brands", "/representation"];

  const [brands, products, posts] = await Promise.all([
    rows("SELECT slug FROM brands ORDER BY id DESC"),
    rows("SELECT slug FROM products WHERE published = 1 ORDER BY id DESC"),
    rows("SELECT slug FROM blog_posts WHERE published = 1 ORDER BY id DESC"),
  ]);

  const urls: MetadataRoute.Sitemap = staticPaths.map((p) => ({
    url: `${BASE_URL}${p || "/"}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: p === "" ? 1 : 0.7,
  }));

  for (const b of brands) urls.push({ url: `${BASE_URL}/brand/${b.slug}`, lastModified: now, changeFrequency: "weekly", priority: 0.6 });
  for (const p of products) urls.push({ url: `${BASE_URL}/product/${p.slug}`, lastModified: now, changeFrequency: "weekly", priority: 0.6 });
  for (const p of posts) urls.push({ url: `${BASE_URL}/blog/${p.slug}`, lastModified: now, changeFrequency: "monthly", priority: 0.5 });

  return urls;
}

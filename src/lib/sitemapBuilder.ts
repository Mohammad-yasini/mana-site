import type { MetadataRoute } from "next";
import { getPool } from "@/lib/db";
import { BASE_URL, PAGE_DEFS } from "@/lib/pageSeo";
import type { RowDataPacket } from "mysql2";

type SlugRow = RowDataPacket & { slug: string; updated_at?: Date | string };

function toDate(v: unknown): Date {
  if (v instanceof Date && !Number.isNaN(v.getTime())) return v;
  if (typeof v === "string" || typeof v === "number") {
    const d = new Date(v);
    if (!Number.isNaN(d.getTime())) return d;
  }
  return new Date();
}

async function querySlugRows(sql: string): Promise<SlugRow[]> {
  try {
    const pool = getPool();
    const [rows] = await pool.execute<SlugRow[]>(sql);
    return rows.filter((r) => r?.slug);
  } catch {
    return [];
  }
}

async function getNoIndexPaths(): Promise<Set<string>> {
  const blocked = new Set<string>();
  try {
    const pool = getPool();
    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT page_key FROM page_seo WHERE no_index = 1",
    );
    for (const row of rows) {
      const key = String(row.page_key ?? "");
      const def = PAGE_DEFS.find((p) => p.key === key);
      if (def) blocked.add(def.path);
    }
  } catch {
    /* ignore */
  }
  return blocked;
}

type ChangeFreq = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";

function entry(
  path: string,
  lastModified: Date,
  changeFrequency: ChangeFreq,
  priority: number,
): MetadataRoute.Sitemap[number] {
  const url = path === "/" || path === "" ? `${BASE_URL}/` : `${BASE_URL}${path}`;
  return { url, lastModified, changeFrequency, priority };
}

export async function buildSitemapEntries(): Promise<MetadataRoute.Sitemap> {
  const noIndex = await getNoIndexPaths();
  const urls: MetadataRoute.Sitemap = [];

  for (const def of PAGE_DEFS) {
    if (noIndex.has(def.path)) continue;
    urls.push(
      entry(
        def.path,
        new Date(),
        def.key === "home" ? "daily" : "weekly",
        def.key === "home" ? 1 : def.path === "/blog" ? 0.9 : 0.8,
      ),
    );
  }

  const [categories, brands, products, posts] = await Promise.all([
    querySlugRows("SELECT slug, updated_at FROM blog_categories ORDER BY updated_at DESC"),
    querySlugRows("SELECT slug, updated_at FROM brands ORDER BY updated_at DESC"),
    querySlugRows(
      "SELECT slug, updated_at FROM products WHERE published = 1 ORDER BY updated_at DESC",
    ),
    querySlugRows(
      "SELECT slug, updated_at FROM blog_posts WHERE published = 1 ORDER BY updated_at DESC",
    ),
  ]);

  for (const c of categories) {
    urls.push(entry(`/blog-category/${c.slug}`, toDate(c.updated_at), "weekly", 0.65));
  }
  for (const b of brands) {
    urls.push(entry(`/brand/${b.slug}`, toDate(b.updated_at), "weekly", 0.7));
  }
  for (const p of products) {
    urls.push(entry(`/product/${p.slug}`, toDate(p.updated_at), "weekly", 0.7));
  }
  for (const p of posts) {
    urls.push(entry(`/blog/${p.slug}`, toDate(p.updated_at), "monthly", 0.6));
  }

  return urls;
}

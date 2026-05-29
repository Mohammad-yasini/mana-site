import type { Metadata } from "next";
import { getPool } from "@/lib/db";
import type { RowDataPacket } from "mysql2";

export type PageSeo = {
  pageKey: string;
  seoTitle: string;
  metaDescription: string;
  metaKeywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  canonicalUrl: string;
  noIndex: boolean;
};

export type PageDef = {
  key: string;
  label: string;
  path: string;
  fallbackTitle: string;
  fallbackDescription: string;
};

export const BASE_URL = (process.env.SITE_URL || "https://manaelectronic.com").replace(/\/$/, "");

export const PAGE_DEFS: PageDef[] = [
  {
    key: "home",
    label: "صفحه اصلی",
    path: "/",
    fallbackTitle: "مانا الکترونیک | تجهیزات امنیتی و نظارت تصویری",
    fallbackDescription:
      "فروش و پشتیبانی تجهیزات امنیتی، دوربین مداربسته و سیستم‌های نظارت تصویری در مانا الکترونیک.",
  },
  {
    key: "about",
    label: "درباره ما",
    path: "/about",
    fallbackTitle: "درباره ما - مانا الکترونیک",
    fallbackDescription: "آشنایی با مانا الکترونیک، فعالیت‌ها و خدمات تجهیزات امنیتی و نظارت تصویری.",
  },
  {
    key: "services",
    label: "خدمات",
    path: "/services",
    fallbackTitle: "خدمات - مانا الکترونیک",
    fallbackDescription: "خدمات مشاوره، فروش، نصب و پشتیبانی تجهیزات امنیتی و نظارت تصویری.",
  },
  {
    key: "contact",
    label: "ارتباط با ما",
    path: "/contact",
    fallbackTitle: "ارتباط با ما - مانا الکترونیک",
    fallbackDescription: "راه‌های ارتباطی، آدرس و شماره تماس مانا الکترونیک.",
  },
  {
    key: "blog",
    label: "وبلاگ",
    path: "/blog",
    fallbackTitle: "وبلاگ - مانا الکترونیک",
    fallbackDescription: "راهنماها، آموزش‌ها و نکات اجرایی حوزه امنیت و نظارت تصویری.",
  },
  {
    key: "brands",
    label: "برندها",
    path: "/brands",
    fallbackTitle: "برندها - مانا الکترونیک",
    fallbackDescription: "برندهای معتبر تجهیزات امنیتی و نظارت تصویری در مانا الکترونیک.",
  },
  {
    key: "representation",
    label: "اعطای نمایندگی",
    path: "/representation",
    fallbackTitle: "اعطای نمایندگی - مانا الکترونیک",
    fallbackDescription:
      "فرم درخواست نمایندگی و همکاری با مانا الکترونیک؛ تجهیزات امنیتی و نظارت تصویری.",
  },
];

export function getPageDef(key: string): PageDef | undefined {
  return PAGE_DEFS.find((p) => p.key === key);
}

export function emptyPageSeo(key: string): PageSeo {
  return {
    pageKey: key,
    seoTitle: "",
    metaDescription: "",
    metaKeywords: "",
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
    canonicalUrl: "",
    noIndex: false,
  };
}

function rowToSeo(row: RowDataPacket): PageSeo {
  const s = (v: unknown) => (v == null ? "" : String(v));
  return {
    pageKey: s(row.page_key),
    seoTitle: s(row.seo_title),
    metaDescription: s(row.meta_description),
    metaKeywords: s(row.meta_keywords),
    ogTitle: s(row.og_title),
    ogDescription: s(row.og_description),
    ogImage: s(row.og_image),
    canonicalUrl: s(row.canonical_url),
    noIndex: Number(row.no_index) === 1,
  };
}

export async function getPageSeo(key: string): Promise<PageSeo> {
  try {
    const pool = getPool();
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT page_key, seo_title, meta_description, meta_keywords, og_title,
              og_description, og_image, canonical_url, no_index
       FROM page_seo WHERE page_key = ? LIMIT 1`,
      [key],
    );
    const row = rows[0];
    return row ? rowToSeo(row) : emptyPageSeo(key);
  } catch {
    return emptyPageSeo(key);
  }
}

export async function getAllPageSeo(): Promise<Record<string, PageSeo>> {
  const result: Record<string, PageSeo> = {};
  for (const def of PAGE_DEFS) result[def.key] = emptyPageSeo(def.key);
  try {
    const pool = getPool();
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT page_key, seo_title, meta_description, meta_keywords, og_title,
              og_description, og_image, canonical_url, no_index
       FROM page_seo`,
    );
    for (const row of rows) {
      const seo = rowToSeo(row);
      result[seo.pageKey] = seo;
    }
  } catch {
    /* defaults already set */
  }
  return result;
}

function abs(url: string): string {
  const u = url.trim();
  if (!u) return u;
  if (/^https?:\/\//i.test(u)) return u;
  return `${BASE_URL}${u.startsWith("/") ? "" : "/"}${u}`;
}

export function buildPageMetadata(def: PageDef, seo: PageSeo): Metadata {
  const title = seo.seoTitle.trim() || def.fallbackTitle;
  const description = seo.metaDescription.trim() || def.fallbackDescription;
  const canonical = seo.canonicalUrl.trim() ? abs(seo.canonicalUrl) : `${BASE_URL}${def.path}`;

  const metadata: Metadata = {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title: seo.ogTitle.trim() || title,
      description: seo.ogDescription.trim() || description,
      url: canonical,
      type: "website",
      ...(seo.ogImage.trim() ? { images: [{ url: abs(seo.ogImage) }] } : {}),
    },
  };

  if (seo.metaKeywords.trim()) {
    metadata.keywords = seo.metaKeywords
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);
  }

  if (seo.noIndex) {
    metadata.robots = { index: false, follow: false };
  }

  return metadata;
}

export async function metadataForPage(key: string): Promise<Metadata> {
  const def = getPageDef(key);
  if (!def) return {};
  const seo = await getPageSeo(key);
  return buildPageMetadata(def, seo);
}

const MAX = {
  seoTitle: 255,
  metaDescription: 500,
  metaKeywords: 500,
  ogTitle: 255,
  ogDescription: 500,
  ogImage: 500,
  canonicalUrl: 500,
} as const;

export function sanitizePageSeoInput(key: string, raw: unknown): PageSeo {
  const o = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const str = (v: unknown, max: number) =>
    typeof v === "string" ? v.trim().slice(0, max) : "";
  return {
    pageKey: key,
    seoTitle: str(o.seoTitle, MAX.seoTitle),
    metaDescription: str(o.metaDescription, MAX.metaDescription),
    metaKeywords: str(o.metaKeywords, MAX.metaKeywords),
    ogTitle: str(o.ogTitle, MAX.ogTitle),
    ogDescription: str(o.ogDescription, MAX.ogDescription),
    ogImage: str(o.ogImage, MAX.ogImage),
    canonicalUrl: str(o.canonicalUrl, MAX.canonicalUrl),
    noIndex: o.noIndex === true || o.noIndex === 1 || o.noIndex === "1",
  };
}

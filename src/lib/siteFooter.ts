import { getPool } from "@/lib/db";
import {
  DEFAULT_FOOTER_PHONES,
  DEFAULT_FOOTER_QUICK_LINKS,
  DEFAULT_FOOTER_USER_LINKS,
  STATIC_BRAND_LINKS,
  isPlaceholderHref,
  linksArePlaceholders,
} from "@/lib/internalLinks";
import type { RowDataPacket } from "mysql2";

export type FooterColumnLink = { label: string; href: string };

export type FooterPhoneItem = {
  icon: string;
  text: string;
  href: string;
};

export type FooterBadgeItem = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
};

const BADGE_NATURAL: Record<string, { width: number; height: number }> = {
  "image5.png": { width: 70, height: 87 },
  "image6.png": { width: 70, height: 92 },
  "image9.png": { width: 70, height: 88 },
};

export function badgeDimensions(src: string): { width?: number; height?: number } {
  const file = src.split("/").pop() ?? "";
  return BADGE_NATURAL[file] ?? {};
}

export type SiteFooterConfig = {
  brandsColumnTitle: string;
  brandsLinks: FooterColumnLink[];
  userColumnTitle: string;
  userLinks: FooterColumnLink[];
  quickColumnTitle: string;
  quickLinks: FooterColumnLink[];
  logoTagline: string;
  logoPhoneDisplay: string;
  rightDescription: string;
  phones: FooterPhoneItem[];
  badges: FooterBadgeItem[];
  copyrightText: string;
};

export const DEFAULT_SITE_FOOTER: SiteFooterConfig = {
  brandsColumnTitle: "برند ها",
  brandsLinks: [...STATIC_BRAND_LINKS],
  userColumnTitle: "دسترسی کاربری",
  userLinks: [...DEFAULT_FOOTER_USER_LINKS],
  quickColumnTitle: "دسترسی سریع",
  quickLinks: [...DEFAULT_FOOTER_QUICK_LINKS],
  logoTagline: "تجهیزات امنیتی و نظارت تصویری",
  logoPhoneDisplay: '<small>021</small> <span class="color1">91300930</span>',
  rightDescription:
    "این دوربین‌ها قابلیت ثبت تصاویر رنگی در شب و تاریکی مطلق، تشخیص چهره و شناسایی افراد، زوم اپتیکال و دیجیتال، پشتیبانی از شبکه‌های بی‌سیم و سیمی، انتقال تصویر به صورت زنده و ذخیره‌سازی در ابر و... را دارند.",
  phones: DEFAULT_FOOTER_PHONES.map((p) => ({ ...p })),
  badges: [
    { src: "/assets/images/img/image5.png", alt: "SSL" },
    { src: "/assets/images/img/image6.png", alt: "Enamad" },
    { src: "/assets/images/img/image9.png", alt: "Samandehi" },
  ],
  copyrightText:
    "کلیه حقوق مادی و معنوی برای مانا الکترونیک محفوظ است. طراحی و توسعه: مانا الکترونیک",
};

function isLink(x: unknown): x is FooterColumnLink {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return typeof o.label === "string" && typeof o.href === "string";
}

function isPhone(x: unknown): x is FooterPhoneItem {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return typeof o.icon === "string" && typeof o.text === "string" && typeof o.href === "string";
}

function isBadge(x: unknown): x is FooterBadgeItem {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return typeof o.src === "string" && typeof o.alt === "string";
}

export function mergeFooterDefaults(raw: unknown): SiteFooterConfig {
  const d = DEFAULT_SITE_FOOTER;
  if (!raw || typeof raw !== "object") return { ...d, brandsLinks: [...d.brandsLinks] };
  const o = raw as Record<string, unknown>;

  const brandsLinks = Array.isArray(o.brandsLinks)
    ? (o.brandsLinks as unknown[]).filter(isLink)
    : [];
  const userLinks = Array.isArray(o.userLinks) ? (o.userLinks as unknown[]).filter(isLink) : [];
  const quickLinks = Array.isArray(o.quickLinks) ? (o.quickLinks as unknown[]).filter(isLink) : [];
  const phones = Array.isArray(o.phones) ? (o.phones as unknown[]).filter(isPhone) : null;
  const badges = Array.isArray(o.badges) ? (o.badges as unknown[]).filter(isBadge) : null;

  return {
    brandsColumnTitle:
      typeof o.brandsColumnTitle === "string" && o.brandsColumnTitle.trim()
        ? o.brandsColumnTitle.trim().slice(0, 100)
        : d.brandsColumnTitle,
    brandsLinks: brandsLinks.length ? brandsLinks : [...d.brandsLinks],
    userColumnTitle:
      typeof o.userColumnTitle === "string" && o.userColumnTitle.trim()
        ? o.userColumnTitle.trim().slice(0, 100)
        : d.userColumnTitle,
    userLinks: userLinks.length ? userLinks : [...d.userLinks],
    quickColumnTitle:
      typeof o.quickColumnTitle === "string" && o.quickColumnTitle.trim()
        ? o.quickColumnTitle.trim().slice(0, 100)
        : d.quickColumnTitle,
    quickLinks: quickLinks.length ? quickLinks : [...d.quickLinks],
    logoTagline:
      typeof o.logoTagline === "string" ? o.logoTagline.slice(0, 200) : d.logoTagline,
    logoPhoneDisplay:
      typeof o.logoPhoneDisplay === "string" ? o.logoPhoneDisplay.slice(0, 500) : d.logoPhoneDisplay,
    rightDescription:
      typeof o.rightDescription === "string" && o.rightDescription.trim()
        ? o.rightDescription.trim().slice(0, 5000)
        : d.rightDescription,
    phones: phones !== null ? phones : [...d.phones],
    badges: badges !== null ? badges : [...d.badges],
    copyrightText:
      typeof o.copyrightText === "string" && o.copyrightText.trim()
        ? o.copyrightText.trim().slice(0, 500)
        : d.copyrightText,
  };
}

async function loadBrandLinksFromDb(): Promise<FooterColumnLink[]> {
  try {
    const pool = getPool();
    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT name, slug FROM brands ORDER BY name ASC LIMIT 8",
    );
    if (!rows.length) return [...STATIC_BRAND_LINKS];
    return rows.map((row) => ({
      label: String(row.name),
      href: `/brand/${String(row.slug)}`,
    }));
  } catch {
    return [...STATIC_BRAND_LINKS];
  }
}

function patchLinkList(
  links: FooterColumnLink[],
  defaults: FooterColumnLink[],
): FooterColumnLink[] {
  if (linksArePlaceholders(links)) return [...defaults];
  return links.map((link, i) =>
    isPlaceholderHref(link.href) && defaults[i] ? { ...link, href: defaults[i].href } : link,
  );
}

function patchPhones(phones: FooterPhoneItem[]): FooterPhoneItem[] {
  const defaults = DEFAULT_FOOTER_PHONES.map((p) => ({ ...p }));
  if (linksArePlaceholders(phones)) return defaults;
  return phones.map((phone, i) =>
    isPlaceholderHref(phone.href) && defaults[i] ? { ...phone, href: defaults[i].href } : phone,
  );
}

async function resolveFooterLinks(config: SiteFooterConfig): Promise<SiteFooterConfig> {
  const dbBrands = await loadBrandLinksFromDb();
  const brandsLinks = linksArePlaceholders(config.brandsLinks)
    ? dbBrands
    : patchLinkList(config.brandsLinks, dbBrands);

  return {
    ...config,
    brandsLinks,
    userLinks: patchLinkList(config.userLinks, DEFAULT_FOOTER_USER_LINKS),
    quickLinks: patchLinkList(config.quickLinks, DEFAULT_FOOTER_QUICK_LINKS),
    phones: patchPhones(config.phones),
  };
}

export async function getSiteFooterConfig(): Promise<SiteFooterConfig> {
  const fallback = {
    ...DEFAULT_SITE_FOOTER,
    brandsLinks: [...DEFAULT_SITE_FOOTER.brandsLinks],
    userLinks: [...DEFAULT_SITE_FOOTER.userLinks],
    quickLinks: [...DEFAULT_SITE_FOOTER.quickLinks],
    phones: [...DEFAULT_SITE_FOOTER.phones],
    badges: [...DEFAULT_SITE_FOOTER.badges],
  };

  try {
    const pool = getPool();
    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT config_json FROM site_footer_config WHERE id = 1 LIMIT 1",
    );
    const row = rows[0];
    if (!row?.config_json) return resolveFooterLinks(fallback);
    const raw = row.config_json;
    const str = typeof raw === "string" ? raw : String(raw);
    const parsed = JSON.parse(str) as unknown;
    return resolveFooterLinks(mergeFooterDefaults(parsed));
  } catch {
    return resolveFooterLinks(fallback);
  }
}

export function assertValidFooterConfig(input: unknown): SiteFooterConfig {
  const merged = mergeFooterDefaults(input);
  if (merged.brandsLinks.length > 30) throw new Error("حداکثر ۳۰ لینک برای برندها");
  if (merged.userLinks.length > 30) throw new Error("حداکثر ۳۰ لینک برای دسترسی کاربری");
  if (merged.quickLinks.length > 30) throw new Error("حداکثر ۳۰ لینک برای دسترسی سریع");
  if (merged.phones.length > 15) throw new Error("حداکثر ۱۵ مورد تماس");
  if (merged.badges.length > 12) throw new Error("حداکثر ۱۲ نماد");
  return merged;
}

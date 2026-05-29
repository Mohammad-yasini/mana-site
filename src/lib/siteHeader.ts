import { getPool } from "@/lib/db";
import type { RowDataPacket } from "mysql2";

export type HeaderNavLink = { label: string; href: string };

export type SiteHeaderConfig = {
  contactSubtitle: string;
  phoneDisplayHtml: string;
  navLinks: HeaderNavLink[];
};

export const DEFAULT_SITE_HEADER: SiteHeaderConfig = {
  contactSubtitle: "تجهیزات امنیتی و نظارت تصویری",
  phoneDisplayHtml: '<small>021-</small> <span class="color1">91300930</span>',
  navLinks: [
    { href: "/services", label: "خدمات" },
    { href: "/blog", label: "وبلاگ" },
    { href: "/about", label: "درباره ما" },
    { href: "/contact", label: "ارتباط با ما" },
  ],
};

function isNavLink(x: unknown): x is HeaderNavLink {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return typeof o.label === "string" && typeof o.href === "string";
}

export function mergeHeaderDefaults(raw: unknown): SiteHeaderConfig {
  const d = DEFAULT_SITE_HEADER;
  if (!raw || typeof raw !== "object") {
    return { ...d, navLinks: [...d.navLinks] };
  }
  const o = raw as Record<string, unknown>;

  const navLinks = Array.isArray(o.navLinks) ? (o.navLinks as unknown[]).filter(isNavLink) : null;

  return {
    contactSubtitle:
      typeof o.contactSubtitle === "string" && o.contactSubtitle.trim()
        ? o.contactSubtitle.trim().slice(0, 200)
        : d.contactSubtitle,
    phoneDisplayHtml:
      typeof o.phoneDisplayHtml === "string"
        ? o.phoneDisplayHtml.slice(0, 500)
        : d.phoneDisplayHtml,
    navLinks: navLinks !== null ? (navLinks.length ? navLinks : [...d.navLinks]) : [...d.navLinks],
  };
}

export async function getSiteHeaderConfig(): Promise<SiteHeaderConfig> {
  try {
    const pool = getPool();
    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT config_json FROM site_header_config WHERE id = 1 LIMIT 1",
    );
    const row = rows[0];
    if (!row?.config_json) {
      return { ...DEFAULT_SITE_HEADER, navLinks: [...DEFAULT_SITE_HEADER.navLinks] };
    }
    const raw = row.config_json;
    const str = typeof raw === "string" ? raw : String(raw);
    const parsed = JSON.parse(str) as unknown;
    return mergeHeaderDefaults(parsed);
  } catch {
    return { ...DEFAULT_SITE_HEADER, navLinks: [...DEFAULT_SITE_HEADER.navLinks] };
  }
}

export function assertValidHeaderConfig(input: unknown): SiteHeaderConfig {
  const merged = mergeHeaderDefaults(input);
  if (merged.navLinks.length > 25) throw new Error("حداکثر ۲۵ آیتم منو");
  for (const link of merged.navLinks) {
    if (!link.label.trim()) throw new Error("متن هر منو نباید خالی باشد");
    if (!link.href.trim()) throw new Error("لینک هر منو نباید خالی باشد");
  }
  return merged;
}

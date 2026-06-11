import { getPool } from "@/lib/db";
import { CLUB_URL, DEFAULT_HEADER_NAV } from "@/lib/internalLinks";
import type { RowDataPacket } from "mysql2";

export type HeaderNavLink = { label: string; href: string };

export type SiteHeaderConfig = {
  contactSubtitle: string;
  phoneDisplayHtml: string;
  navLinks: HeaderNavLink[];
  representationButtonHref: string;
  panelButtonHref: string;
};

export const DEFAULT_SITE_HEADER: SiteHeaderConfig = {
  contactSubtitle: "تجهیزات امنیتی و نظارت تصویری",
  phoneDisplayHtml: '<small>021-</small> <span class="color1">91300930</span>',
  navLinks: [...DEFAULT_HEADER_NAV],
  representationButtonHref: "/representation",
  panelButtonHref: CLUB_URL,
};

const HREF_PATTERN = /^(\/|https?:\/\/|#)/;

function normalizeButtonHref(value: unknown, fallback: string): string {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  if (!trimmed || !HREF_PATTERN.test(trimmed)) return fallback;
  return trimmed.slice(0, 500);
}

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
    representationButtonHref: normalizeButtonHref(
      o.representationButtonHref,
      d.representationButtonHref,
    ),
    panelButtonHref: normalizeButtonHref(o.panelButtonHref, d.panelButtonHref),
  };
}

function ensureBrandsNavLink(links: HeaderNavLink[]): HeaderNavLink[] {
  if (links.some((l) => l.href === "/brands")) return links;
  return [{ href: "/brands", label: "برندها" }, ...links];
}

function resolveHeaderConfig(config: SiteHeaderConfig): SiteHeaderConfig {
  const panelButtonHref =
    config.panelButtonHref === "/dashboard" || config.panelButtonHref === "/login"
      ? CLUB_URL
      : config.panelButtonHref;

  return {
    ...config,
    navLinks: ensureBrandsNavLink(config.navLinks),
    panelButtonHref,
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
      return resolveHeaderConfig({
        ...DEFAULT_SITE_HEADER,
        navLinks: [...DEFAULT_SITE_HEADER.navLinks],
      });
    }
    const raw = row.config_json;
    const str = typeof raw === "string" ? raw : String(raw);
    const parsed = JSON.parse(str) as unknown;
    return resolveHeaderConfig(mergeHeaderDefaults(parsed));
  } catch {
    return resolveHeaderConfig({
      ...DEFAULT_SITE_HEADER,
      navLinks: [...DEFAULT_SITE_HEADER.navLinks],
    });
  }
}

export function assertValidHeaderConfig(input: unknown): SiteHeaderConfig {
  const merged = mergeHeaderDefaults(input);
  if (merged.navLinks.length > 25) throw new Error("حداکثر ۲۵ آیتم منو");
  for (const link of merged.navLinks) {
    if (!link.label.trim()) throw new Error("متن هر منو نباید خالی باشد");
    if (!link.href.trim()) throw new Error("لینک هر منو نباید خالی باشد");
  }
  if (!merged.representationButtonHref.trim()) {
    throw new Error("لینک دکمه اعطای نمایندگی نباید خالی باشد");
  }
  if (!merged.panelButtonHref.trim()) {
    throw new Error("لینک دکمه پنل همکاران نباید خالی باشد");
  }
  return merged;
}

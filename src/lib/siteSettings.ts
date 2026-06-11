import path from "node:path";
import { getPool } from "@/lib/db";
import type { RowDataPacket } from "mysql2";

export type SiteSettingsConfig = {
  faviconUrl: string | null;
};

export const DEFAULT_FAVICON_URL = "/assets/site/favicon.png";

export const DEFAULT_SITE_SETTINGS: SiteSettingsConfig = {
  faviconUrl: null,
};

const FAVICON_PATH = /^\/(?:uploads\/site|assets\/site)\/[^\s?#]+$/i;

export function resolveFaviconUrl(settings: SiteSettingsConfig): string {
  return settings.faviconUrl ?? DEFAULT_FAVICON_URL;
}

export function getPublicFaviconPath(url: string): string {
  return path.join(process.cwd(), "public", url.replace(/^\//, ""));
}

function normalizeFaviconUrl(value: unknown): string | null {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (!FAVICON_PATH.test(trimmed)) return null;
  return trimmed.slice(0, 500);
}

export function mergeSiteSettings(raw: unknown): SiteSettingsConfig {
  if (!raw || typeof raw !== "object") {
    return { ...DEFAULT_SITE_SETTINGS };
  }
  const o = raw as Record<string, unknown>;
  return {
    faviconUrl: normalizeFaviconUrl(o.faviconUrl),
  };
}

export async function getSiteSettings(): Promise<SiteSettingsConfig> {
  try {
    const pool = getPool();
    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT config_json FROM site_settings_config WHERE id = 1 LIMIT 1",
    );
    const row = rows[0];
    if (!row?.config_json) {
      return { ...DEFAULT_SITE_SETTINGS };
    }
    const str = typeof row.config_json === "string" ? row.config_json : String(row.config_json);
    return mergeSiteSettings(JSON.parse(str) as unknown);
  } catch {
    return { ...DEFAULT_SITE_SETTINGS };
  }
}

export function assertValidSiteSettings(input: unknown): SiteSettingsConfig {
  return mergeSiteSettings(input);
}

export function faviconMimeType(url: string): string | undefined {
  const lower = url.toLowerCase();
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".gif")) return "image/gif";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  if (lower.endsWith(".ico")) return "image/x-icon";
  if (lower.endsWith(".svg")) return "image/svg+xml";
  return undefined;
}

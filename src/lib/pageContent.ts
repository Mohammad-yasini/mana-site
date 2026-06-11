import DOMPurify from "isomorphic-dompurify";
import { getPool } from "@/lib/db";
import { loadTemplateMainHtml } from "@/lib/templateHtml";
import type { RowDataPacket } from "mysql2";

export type PageContentDef = {
  key: string;
  label: string;
  path: string;
  templateFile: string;
};

export type PageContentRecord = {
  pageKey: string;
  bodyHtml: string | null;
  isCustom: boolean;
};

export const PAGE_CONTENT_DEFS: PageContentDef[] = [
  { key: "home", label: "صفحه اصلی", path: "/", templateFile: "home.html" },
  { key: "about", label: "درباره ما", path: "/about", templateFile: "about.html" },
  { key: "services", label: "خدمات", path: "/services", templateFile: "services.html" },
  { key: "contact", label: "ارتباط با ما", path: "/contact", templateFile: "contact.html" },
];

export function getPageContentDef(key: string): PageContentDef | undefined {
  return PAGE_CONTENT_DEFS.find((p) => p.key === key);
}

export function sanitizePageBodyHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    ADD_ATTR: ["id", "class", "style", "target", "rel", "width", "height", "loading", "decoding", "fetchpriority", "srcset", "sizes", "dir", "aria-hidden", "aria-label"],
  });
}

export function defaultTemplateHtml(def: PageContentDef): string {
  return loadTemplateMainHtml(def.templateFile);
}

export async function getStoredPageBody(key: string): Promise<string | null> {
  try {
    const pool = getPool();
    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT body_html FROM page_content WHERE page_key = ? LIMIT 1",
      [key],
    );
    const row = rows[0];
    if (!row || row.body_html == null) return null;
    const html = String(row.body_html);
    return html.trim() ? html : null;
  } catch {
    return null;
  }
}

export async function getPageContentRecord(key: string): Promise<PageContentRecord | null> {
  const def = getPageContentDef(key);
  if (!def) return null;
  const stored = await getStoredPageBody(key);
  return {
    pageKey: key,
    bodyHtml: stored,
    isCustom: stored !== null,
  };
}

export async function getAllPageContentRecords(): Promise<Record<string, PageContentRecord>> {
  const result: Record<string, PageContentRecord> = {};
  for (const def of PAGE_CONTENT_DEFS) {
    result[def.key] = { pageKey: def.key, bodyHtml: null, isCustom: false };
  }
  try {
    const pool = getPool();
    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT page_key, body_html FROM page_content",
    );
    for (const row of rows) {
      const key = String(row.page_key);
      if (!result[key]) continue;
      const html = row.body_html == null ? null : String(row.body_html);
      const trimmed = html?.trim() ? html : null;
      result[key] = { pageKey: key, bodyHtml: trimmed, isCustom: trimmed !== null };
    }
  } catch {
    /* defaults */
  }
  return result;
}

export async function resolvePageMainHtml(key: string): Promise<string> {
  const def = getPageContentDef(key);
  if (!def) return "";
  const stored = await getStoredPageBody(key);
  if (stored) return sanitizePageBodyHtml(stored);
  return defaultTemplateHtml(def);
}

export function sanitizePageContentInput(
  key: string,
  raw: unknown,
): { bodyHtml: string | null; useDefault: boolean } {
  const o = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const useDefault = o.useDefault === true || o.useDefault === 1 || o.useDefault === "1";
  if (useDefault) return { bodyHtml: null, useDefault: true };
  const body = typeof o.bodyHtml === "string" ? o.bodyHtml : "";
  if (!body.trim()) return { bodyHtml: null, useDefault: true };
  return { bodyHtml: sanitizePageBodyHtml(body), useDefault: false };
}

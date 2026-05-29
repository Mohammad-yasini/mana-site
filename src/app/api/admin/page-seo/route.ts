import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getPool } from "@/lib/db";
import { getAdminFromCookies } from "@/lib/admin-session";
import {
  PAGE_DEFS,
  getAllPageSeo,
  getPageDef,
  sanitizePageSeoInput,
} from "@/lib/pageSeo";
import type { ResultSetHeader } from "mysql2";

export async function GET() {
  const admin = await getAdminFromCookies();
  if (!admin) {
    return NextResponse.json({ error: "لطفاً وارد شوید" }, { status: 401 });
  }

  try {
    const seo = await getAllPageSeo();
    return NextResponse.json({ pages: PAGE_DEFS, seo });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "خطای دیتابیس" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const admin = await getAdminFromCookies();
  if (!admin) {
    return NextResponse.json({ error: "لطفاً وارد شوید" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "بدنه نامعتبر" }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "بدنه نامعتبر" }, { status: 400 });
  }

  const key = (body as { pageKey?: unknown }).pageKey;
  const def = typeof key === "string" ? getPageDef(key) : undefined;
  if (typeof key !== "string" || !def) {
    return NextResponse.json({ error: "برگه نامعتبر است" }, { status: 400 });
  }

  const seo = sanitizePageSeoInput(key, (body as { seo?: unknown }).seo);

  try {
    const pool = getPool();
    await pool.execute<ResultSetHeader>(
      `INSERT INTO page_seo
        (page_key, seo_title, meta_description, meta_keywords, og_title, og_description, og_image, canonical_url, no_index)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
        seo_title = VALUES(seo_title),
        meta_description = VALUES(meta_description),
        meta_keywords = VALUES(meta_keywords),
        og_title = VALUES(og_title),
        og_description = VALUES(og_description),
        og_image = VALUES(og_image),
        canonical_url = VALUES(canonical_url),
        no_index = VALUES(no_index)`,
      [
        seo.pageKey,
        seo.seoTitle || null,
        seo.metaDescription || null,
        seo.metaKeywords || null,
        seo.ogTitle || null,
        seo.ogDescription || null,
        seo.ogImage || null,
        seo.canonicalUrl || null,
        seo.noIndex ? 1 : 0,
      ],
    );
    try {
      revalidatePath(def.path);
    } catch {
      /* ignore revalidation errors */
    }
    return NextResponse.json({ ok: true, seo });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "ذخیره نشد؛ جدول page_seo را در MySQL ساخته‌اید؟" },
      { status: 500 },
    );
  }
}

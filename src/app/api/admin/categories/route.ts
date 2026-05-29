import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { getAdminFromCookies } from "@/lib/admin-session";
import { baseSlugFromTitle } from "@/lib/slug";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

async function ensureUniqueCategorySlug(
  pool: ReturnType<typeof getPool>,
  base: string,
): Promise<string> {
  const root = base.slice(0, 180) || "category";
  let slug = root;
  let n = 0;
  for (;;) {
    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT id FROM blog_categories WHERE slug = ? LIMIT 1",
      [slug],
    );
    if (!rows.length) return slug;
    n += 1;
    slug = `${root}-${n}`.slice(0, 191);
  }
}

export async function GET() {
  const admin = await getAdminFromCookies();
  if (!admin) {
    return NextResponse.json({ error: "لطفاً وارد شوید" }, { status: 401 });
  }

  try {
    const pool = getPool();
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT id, name, slug, seo_title, meta_description, created_at, updated_at
       FROM blog_categories
       ORDER BY name ASC`,
    );
    return NextResponse.json({ categories: rows });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "خطای دیتابیس" }, { status: 500 });
  }
}

export async function POST(request: Request) {
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

  const b = body as Record<string, unknown>;
  const name = typeof b.name === "string" ? b.name.trim() : "";
  const slugOverride = typeof b.slug === "string" && b.slug.trim() ? b.slug.trim() : "";
  const seoTitle = typeof b.seo_title === "string" && b.seo_title.trim() ? b.seo_title.trim().slice(0, 255) : null;
  const metaDescription =
    typeof b.meta_description === "string" && b.meta_description.trim()
      ? b.meta_description.trim().slice(0, 500)
      : null;

  if (!name) {
    return NextResponse.json({ error: "نام دسته الزامی است" }, { status: 400 });
  }

  try {
    const pool = getPool();
    const base = slugOverride ? baseSlugFromTitle(slugOverride) : baseSlugFromTitle(name);
    const slug = await ensureUniqueCategorySlug(pool, base);

    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO blog_categories (name, slug, seo_title, meta_description)
       VALUES (?, ?, ?, ?)`,
      [name, slug, seoTitle, metaDescription],
    );

    return NextResponse.json({ ok: true, id: result.insertId, slug });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "ذخیره نشد؛ جدول دسته‌ها را در MySQL ساخته‌اید؟" },
      { status: 500 },
    );
  }
}

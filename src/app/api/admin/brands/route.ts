import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { getAdminFromCookies } from "@/lib/admin-session";
import { baseSlugFromTitle } from "@/lib/slug";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

async function ensureUniqueBrandSlug(
  pool: ReturnType<typeof getPool>,
  base: string,
): Promise<string> {
  const root = base.slice(0, 180) || "brand";
  let slug = root;
  let n = 0;
  for (;;) {
    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT id FROM brands WHERE slug = ? LIMIT 1",
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
      `SELECT b.id, b.name, b.name_en, b.slug, b.logo, b.description, b.created_at,
              (SELECT COUNT(*) FROM products p WHERE p.brand_id = b.id) AS product_count
       FROM brands b
       ORDER BY b.name ASC`,
    );
    return NextResponse.json({ brands: rows });
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
  const nameEn = typeof b.name_en === "string" && b.name_en.trim() ? b.name_en.trim().slice(0, 150) : null;
  const slugOverride = typeof b.slug === "string" && b.slug.trim() ? b.slug.trim() : "";
  const logo = typeof b.logo === "string" && b.logo.trim() ? b.logo.trim().slice(0, 500) : null;
  const description =
    typeof b.description === "string" && b.description.trim() ? b.description.trim() : null;

  if (!name) {
    return NextResponse.json({ error: "نام برند الزامی است" }, { status: 400 });
  }

  try {
    const pool = getPool();
    const base = slugOverride ? baseSlugFromTitle(slugOverride) : baseSlugFromTitle(name);
    const slug = await ensureUniqueBrandSlug(pool, base);

    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO brands (name, name_en, slug, logo, description)
       VALUES (?, ?, ?, ?, ?)`,
      [name, nameEn, slug, logo, description],
    );

    return NextResponse.json({ ok: true, id: result.insertId, slug });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "ذخیره نشد؛ جدول برندها را در MySQL ساخته‌اید؟" },
      { status: 500 },
    );
  }
}

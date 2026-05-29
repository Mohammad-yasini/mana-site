import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { getAdminFromCookies } from "@/lib/admin-session";
import { baseSlugFromTitle } from "@/lib/slug";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

async function ensureUniqueProductSlug(
  pool: ReturnType<typeof getPool>,
  base: string,
): Promise<string> {
  const root = base.slice(0, 180) || "product";
  let slug = root;
  let n = 0;
  for (;;) {
    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT id FROM products WHERE slug = ? LIMIT 1",
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
      `SELECT p.id, p.name, p.slug, p.published, p.created_at, p.cover_image, p.price,
              p.brand_id, b.name AS brand_name
       FROM products p
       LEFT JOIN brands b ON b.id = p.brand_id
       ORDER BY p.id DESC`,
    );
    return NextResponse.json({ products: rows });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "خطای دیتابیس" }, { status: 500 });
  }
}

function readProductInput(b: Record<string, unknown>) {
  const name = typeof b.name === "string" ? b.name.trim() : "";
  const nameEn =
    typeof b.name_en === "string" && b.name_en.trim() ? b.name_en.trim().slice(0, 255) : null;
  const slugOverride = typeof b.slug === "string" && b.slug.trim() ? b.slug.trim() : "";
  const coverImage =
    typeof b.cover_image === "string" && b.cover_image.trim() ? b.cover_image.trim().slice(0, 500) : null;
  const shortDescription =
    typeof b.short_description === "string" && b.short_description.trim()
      ? b.short_description.trim().slice(0, 1000)
      : null;
  const bodyHtml = typeof b.body === "string" ? b.body : "";
  const price = typeof b.price === "string" && b.price.trim() ? b.price.trim().slice(0, 100) : null;
  const seoTitle =
    typeof b.seo_title === "string" && b.seo_title.trim() ? b.seo_title.trim().slice(0, 255) : null;
  const seoMetaDescription =
    typeof b.seo_meta_description === "string" && b.seo_meta_description.trim()
      ? b.seo_meta_description.trim().slice(0, 500)
      : null;
  const published = Boolean(b.published);

  let brandId: number | null = null;
  if (typeof b.brand_id === "number" && Number.isFinite(b.brand_id) && b.brand_id > 0) {
    brandId = Math.floor(b.brand_id);
  } else if (typeof b.brand_id === "string" && b.brand_id.trim()) {
    const n = Number(b.brand_id);
    if (Number.isFinite(n) && n > 0) brandId = Math.floor(n);
  }

  return {
    name,
    nameEn,
    slugOverride,
    coverImage,
    shortDescription,
    bodyHtml,
    price,
    seoTitle,
    seoMetaDescription,
    published,
    brandId,
  };
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

  const input = readProductInput(body as Record<string, unknown>);

  if (!input.name) {
    return NextResponse.json({ error: "نام محصول الزامی است" }, { status: 400 });
  }

  try {
    const pool = getPool();

    if (input.brandId !== null) {
      const [brands] = await pool.execute<RowDataPacket[]>(
        "SELECT id FROM brands WHERE id = ? LIMIT 1",
        [input.brandId],
      );
      if (!brands.length) {
        return NextResponse.json({ error: "برند انتخاب‌شده وجود ندارد" }, { status: 400 });
      }
    }

    const base = input.slugOverride
      ? baseSlugFromTitle(input.slugOverride)
      : baseSlugFromTitle(input.name);
    const slug = await ensureUniqueProductSlug(pool, base);

    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO products (
         brand_id, name, name_en, slug, cover_image, short_description, body, price,
         seo_title, seo_meta_description, published
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        input.brandId,
        input.name,
        input.nameEn,
        slug,
        input.coverImage,
        input.shortDescription,
        input.bodyHtml,
        input.price,
        input.seoTitle,
        input.seoMetaDescription,
        input.published ? 1 : 0,
      ],
    );

    return NextResponse.json({ ok: true, id: result.insertId, slug });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "ذخیره نشد؛ جدول محصولات را در MySQL ساخته‌اید؟" },
      { status: 500 },
    );
  }
}

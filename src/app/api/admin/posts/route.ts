import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { getAdminFromCookies } from "@/lib/admin-session";
import { baseSlugFromTitle } from "@/lib/slug";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

async function ensureUniqueSlug(pool: ReturnType<typeof getPool>, base: string): Promise<string> {
  const root = base.slice(0, 180) || "post";
  let slug = root;
  let n = 0;
  for (;;) {
    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT id FROM blog_posts WHERE slug = ? LIMIT 1",
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
      `SELECT p.id, p.title, p.slug, p.published, p.created_at, p.updated_at,
              p.cover_image, p.category_id, c.name AS category_name,
              a.email AS author_email
       FROM blog_posts p
       INNER JOIN admins a ON a.id = p.admin_id
       LEFT JOIN blog_categories c ON c.id = p.category_id
       ORDER BY p.id DESC`,
    );
    return NextResponse.json({ posts: rows });
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
  const title = typeof b.title === "string" ? b.title.trim() : "";
  const content = typeof b.body === "string" ? b.body : "";
  const excerpt =
    b.excerpt === null
      ? null
      : typeof b.excerpt === "string" && b.excerpt.trim()
        ? b.excerpt.trim().slice(0, 500)
        : null;
  const published = Boolean(b.published);
  const slugOverride = typeof b.slug === "string" && b.slug.trim() ? b.slug.trim() : "";

  const coverImage =
    b.cover_image === null
      ? null
      : typeof b.cover_image === "string" && b.cover_image.trim()
        ? b.cover_image.trim().slice(0, 500)
        : null;

  let categoryId: number | null = null;
  if (typeof b.category_id === "number" && Number.isFinite(b.category_id) && b.category_id > 0) {
    categoryId = Math.floor(b.category_id);
  } else if (typeof b.category_id === "string" && b.category_id.trim()) {
    const n = Number(b.category_id);
    if (Number.isFinite(n) && n > 0) categoryId = Math.floor(n);
  } else if (b.category_id === null) {
    categoryId = null;
  }

  const seoTitle =
    b.seo_title === null
      ? null
      : typeof b.seo_title === "string" && b.seo_title.trim()
        ? b.seo_title.trim().slice(0, 255)
        : null;
  const seoMetaDescription =
    b.seo_meta_description === null
      ? null
      : typeof b.seo_meta_description === "string" && b.seo_meta_description.trim()
        ? b.seo_meta_description.trim().slice(0, 500)
        : null;

  if (!title || !content.trim()) {
    return NextResponse.json({ error: "عنوان و متن نوشته الزامی است" }, { status: 400 });
  }

  try {
    const pool = getPool();

    if (categoryId !== null) {
      const [cats] = await pool.execute<RowDataPacket[]>(
        "SELECT id FROM blog_categories WHERE id = ? LIMIT 1",
        [categoryId],
      );
      if (!cats.length) {
        return NextResponse.json({ error: "دستهٔ انتخاب‌شده وجود ندارد" }, { status: 400 });
      }
    }

    const base = slugOverride ? baseSlugFromTitle(slugOverride) : baseSlugFromTitle(title);
    const slug = await ensureUniqueSlug(pool, base);

    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO blog_posts (
         admin_id, title, slug, excerpt, cover_image, category_id, body,
         seo_title, seo_meta_description, published
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        admin.sub,
        title,
        slug,
        excerpt,
        coverImage,
        categoryId,
        content,
        seoTitle,
        seoMetaDescription,
        published ? 1 : 0,
      ],
    );

    return NextResponse.json({
      ok: true,
      id: result.insertId,
      slug,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        error:
          "ذخیره نشد. اگر ستون‌های جدید را ندارید، در phpMyAdmin فایل database/migration_blog_v3.sql را اجرا کنید.",
      },
      { status: 500 },
    );
  }
}

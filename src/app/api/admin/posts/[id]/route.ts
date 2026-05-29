import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { getAdminFromCookies } from "@/lib/admin-session";
import { baseSlugFromTitle } from "@/lib/slug";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

async function ensureUniqueSlugForUpdate(
  pool: ReturnType<typeof getPool>,
  base: string,
  excludeId: number,
): Promise<string> {
  const root = base.slice(0, 180) || "post";
  let slug = root;
  let n = 0;
  for (;;) {
    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT id FROM blog_posts WHERE slug = ? AND id <> ? LIMIT 1",
      [slug, excludeId],
    );
    if (!rows.length) return slug;
    n += 1;
    slug = `${root}-${n}`.slice(0, 191);
  }
}

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, ctx: Ctx) {
  const admin = await getAdminFromCookies();
  if (!admin) {
    return NextResponse.json({ error: "لطفاً وارد شوید" }, { status: 401 });
  }

  const id = Number((await ctx.params).id);
  if (!Number.isFinite(id) || id < 1) {
    return NextResponse.json({ error: "شناسه نامعتبر" }, { status: 400 });
  }

  try {
    const pool = getPool();
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT p.id, p.title, p.slug, p.excerpt, p.cover_image, p.category_id, p.body,
              p.seo_title, p.seo_meta_description, p.published, p.created_at, p.updated_at
       FROM blog_posts p
       WHERE p.id = ?
       LIMIT 1`,
      [id],
    );
    const row = rows[0];
    if (!row) {
      return NextResponse.json({ error: "نوشته پیدا نشد" }, { status: 404 });
    }
    return NextResponse.json({
      post: {
        id: Number(row.id),
        title: String(row.title),
        slug: String(row.slug),
        excerpt: row.excerpt != null ? String(row.excerpt) : null,
        cover_image: row.cover_image != null ? String(row.cover_image) : null,
        category_id: row.category_id != null ? Number(row.category_id) : null,
        body: String(row.body),
        seo_title: row.seo_title != null ? String(row.seo_title) : null,
        seo_meta_description:
          row.seo_meta_description != null ? String(row.seo_meta_description) : null,
        published: Number(row.published) === 1,
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "خطای دیتابیس" }, { status: 500 });
  }
}

export async function PATCH(request: Request, ctx: Ctx) {
  const admin = await getAdminFromCookies();
  if (!admin) {
    return NextResponse.json({ error: "لطفاً وارد شوید" }, { status: 401 });
  }

  const id = Number((await ctx.params).id);
  if (!Number.isFinite(id) || id < 1) {
    return NextResponse.json({ error: "شناسه نامعتبر" }, { status: 400 });
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
  const slugOverride = typeof b.slug === "string" ? b.slug.trim() : "";

  const coverImageFromBody =
    b.cover_image === null
      ? null
      : typeof b.cover_image === "string" && b.cover_image.trim()
        ? b.cover_image.trim().slice(0, 500)
        : null;

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
    const [existing] = await pool.execute<RowDataPacket[]>(
      "SELECT id, slug, category_id, cover_image FROM blog_posts WHERE id = ? LIMIT 1",
      [id],
    );
    if (!existing.length) {
      return NextResponse.json({ error: "نوشته پیدا نشد" }, { status: 404 });
    }
    const oldSlug = String(existing[0].slug);
    const prevCategoryId =
      existing[0].category_id != null ? Number(existing[0].category_id) : null;
    const prevCover =
      existing[0].cover_image != null ? String(existing[0].cover_image) : null;

    let categoryId: number | null;
    if (Object.prototype.hasOwnProperty.call(b, "category_id")) {
      const raw = b.category_id;
      if (raw === null) {
        categoryId = null;
      } else if (typeof raw === "number" && Number.isFinite(raw) && raw > 0) {
        categoryId = Math.floor(raw);
      } else if (typeof raw === "string" && raw.trim()) {
        const n = Number(raw);
        categoryId = Number.isFinite(n) && n > 0 ? Math.floor(n) : null;
      } else {
        categoryId = null;
      }
    } else {
      categoryId = prevCategoryId;
    }

    const coverImage = Object.prototype.hasOwnProperty.call(b, "cover_image")
      ? coverImageFromBody
      : prevCover;

    if (categoryId !== null) {
      const [cats] = await pool.execute<RowDataPacket[]>(
        "SELECT id FROM blog_categories WHERE id = ? LIMIT 1",
        [categoryId],
      );
      if (!cats.length) {
        return NextResponse.json({ error: "دستهٔ انتخاب‌شده وجود ندارد" }, { status: 400 });
      }
    }

    const newSlug = slugOverride
      ? await ensureUniqueSlugForUpdate(pool, baseSlugFromTitle(slugOverride), id)
      : oldSlug;

    const [result] = await pool.execute<ResultSetHeader>(
      `UPDATE blog_posts SET
         title = ?, slug = ?, excerpt = ?, cover_image = ?, category_id = ?,
         body = ?, seo_title = ?, seo_meta_description = ?, published = ?
       WHERE id = ?`,
      [
        title,
        newSlug,
        excerpt,
        coverImage,
        categoryId,
        content,
        seoTitle,
        seoMetaDescription,
        published ? 1 : 0,
        id,
      ],
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "به‌روزرسانی نشد" }, { status: 500 });
    }

    return NextResponse.json({ ok: true, id, slug: newSlug });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, ctx: Ctx) {
  const admin = await getAdminFromCookies();
  if (!admin) {
    return NextResponse.json({ error: "لطفاً وارد شوید" }, { status: 401 });
  }

  const id = Number((await ctx.params).id);
  if (!Number.isFinite(id) || id < 1) {
    return NextResponse.json({ error: "شناسه نامعتبر" }, { status: 400 });
  }

  try {
    const pool = getPool();
    const [result] = await pool.execute<ResultSetHeader>("DELETE FROM blog_posts WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "نوشته پیدا نشد" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}

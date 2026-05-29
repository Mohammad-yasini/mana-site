import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { getAdminFromCookies } from "@/lib/admin-session";
import { baseSlugFromTitle } from "@/lib/slug";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

async function ensureUniqueCategorySlug(
  pool: ReturnType<typeof getPool>,
  base: string,
  excludeId: number,
): Promise<string> {
  const root = base.slice(0, 180) || "category";
  let slug = root;
  let n = 0;
  for (;;) {
    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT id FROM blog_categories WHERE slug = ? AND id <> ? LIMIT 1",
      [slug, excludeId],
    );
    if (!rows.length) return slug;
    n += 1;
    slug = `${root}-${n}`.slice(0, 191);
  }
}

type Ctx = { params: Promise<{ id: string }> };

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
  const name = typeof b.name === "string" ? b.name.trim() : undefined;
  const slugIn = typeof b.slug === "string" ? b.slug.trim() : undefined;

  if (name !== undefined && !name) {
    return NextResponse.json({ error: "نام خالی است" }, { status: 400 });
  }

  try {
    const pool = getPool();
    const [existing] = await pool.execute<RowDataPacket[]>(
      "SELECT id, name, slug, seo_title, meta_description FROM blog_categories WHERE id = ? LIMIT 1",
      [id],
    );
    if (!existing.length) {
      return NextResponse.json({ error: "دسته پیدا نشد" }, { status: 404 });
    }

    const cur = existing[0] as RowDataPacket;
    const nextName = name !== undefined ? name : String(cur.name);
    let nextSlug = String(cur.slug);
    if (slugIn !== undefined) {
      const base = slugIn ? baseSlugFromTitle(slugIn) : baseSlugFromTitle(nextName);
      nextSlug = await ensureUniqueCategorySlug(pool, base, id);
    }

    const hasSeoTitle = Object.prototype.hasOwnProperty.call(b, "seo_title");
    const nextSeoTitle = hasSeoTitle
      ? typeof b.seo_title === "string"
        ? b.seo_title.trim().slice(0, 255) || null
        : null
      : (cur.seo_title as string | null);

    const hasMeta = Object.prototype.hasOwnProperty.call(b, "meta_description");
    const nextMeta = hasMeta
      ? typeof b.meta_description === "string"
        ? b.meta_description.trim().slice(0, 500) || null
        : null
      : (cur.meta_description as string | null);

    const [result] = await pool.execute<ResultSetHeader>(
      `UPDATE blog_categories SET
         name = ?,
         slug = ?,
         seo_title = ?,
         meta_description = ?
       WHERE id = ?`,
      [nextName, nextSlug, nextSeoTitle, nextMeta, id],
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "به‌روزرسانی نشد" }, { status: 500 });
    }

    return NextResponse.json({ ok: true, slug: nextSlug });
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
    const [result] = await pool.execute<ResultSetHeader>("DELETE FROM blog_categories WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "دسته پیدا نشد" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}

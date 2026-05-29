import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { getAdminFromCookies } from "@/lib/admin-session";
import { baseSlugFromTitle } from "@/lib/slug";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

async function ensureUniqueBrandSlug(
  pool: ReturnType<typeof getPool>,
  base: string,
  exceptId: number,
): Promise<string> {
  const root = base.slice(0, 180) || "brand";
  let slug = root;
  let n = 0;
  for (;;) {
    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT id FROM brands WHERE slug = ? AND id <> ? LIMIT 1",
      [slug, exceptId],
    );
    if (!rows.length) return slug;
    n += 1;
    slug = `${root}-${n}`.slice(0, 191);
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await getAdminFromCookies();
  if (!admin) {
    return NextResponse.json({ error: "لطفاً وارد شوید" }, { status: 401 });
  }

  const { id } = await params;
  const numId = Number(id);
  if (!Number.isInteger(numId) || numId <= 0) {
    return NextResponse.json({ error: "شناسه نامعتبر" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
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
    const [exists] = await pool.execute<RowDataPacket[]>(
      "SELECT id FROM brands WHERE id = ? LIMIT 1",
      [numId],
    );
    if (!exists.length) {
      return NextResponse.json({ error: "برند یافت نشد" }, { status: 404 });
    }

    const base = slugOverride ? baseSlugFromTitle(slugOverride) : baseSlugFromTitle(name);
    const slug = await ensureUniqueBrandSlug(pool, base, numId);

    await pool.execute<ResultSetHeader>(
      `UPDATE brands SET name = ?, name_en = ?, slug = ?, logo = ?, description = ? WHERE id = ?`,
      [name, nameEn, slug, logo, description, numId],
    );

    return NextResponse.json({ ok: true, slug });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "خطای دیتابیس" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await getAdminFromCookies();
  if (!admin) {
    return NextResponse.json({ error: "لطفاً وارد شوید" }, { status: 401 });
  }

  const { id } = await params;
  const numId = Number(id);
  if (!Number.isInteger(numId) || numId <= 0) {
    return NextResponse.json({ error: "شناسه نامعتبر" }, { status: 400 });
  }

  try {
    const pool = getPool();
    const [res] = await pool.execute<ResultSetHeader>("DELETE FROM brands WHERE id = ?", [numId]);
    if (res.affectedRows === 0) {
      return NextResponse.json({ error: "یافت نشد" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "خطای دیتابیس" }, { status: 500 });
  }
}

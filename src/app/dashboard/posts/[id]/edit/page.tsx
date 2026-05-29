import { getPool } from "@/lib/db";
import { getAdminFromCookies } from "@/lib/admin-session";
import { PostEditorForm, type PostEditorInitial } from "@/components/blog/PostEditorForm";
import { notFound, redirect } from "next/navigation";
import type { RowDataPacket } from "mysql2";

type Props = { params: Promise<{ id: string }> };

export default async function EditPostPage({ params }: Props) {
  const admin = await getAdminFromCookies();
  if (!admin) redirect("/login");

  const rawId = (await params).id;
  const id = Number(rawId);
  if (!Number.isFinite(id) || id < 1) {
    notFound();
  }

  let row: RowDataPacket | undefined;
  try {
    const pool = getPool();
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT p.id, p.title, p.slug, p.excerpt, p.cover_image, p.category_id, p.body,
              p.seo_title, p.seo_meta_description, p.published
       FROM blog_posts p
       WHERE p.id = ?
       LIMIT 1`,
      [id],
    );
    row = rows[0];
  } catch {
    notFound();
  }

  if (!row) {
    notFound();
  }

  const initial: PostEditorInitial = {
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
  };

  return <PostEditorForm variant="edit" initial={initial} />;
}

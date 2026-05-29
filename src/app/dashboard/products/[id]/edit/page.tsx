import { redirect } from "next/navigation";
import { getPool } from "@/lib/db";
import { getAdminFromCookies } from "@/lib/admin-session";
import type { RowDataPacket } from "mysql2";
import {
  ProductEditorForm,
  type ProductEditorInitial,
} from "@/components/products/ProductEditorForm";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: Props) {
  const admin = await getAdminFromCookies();
  if (!admin) redirect("/login");

  const { id } = await params;
  const numId = Number(id);
  if (!Number.isInteger(numId) || numId <= 0) notFound();

  const pool = getPool();
  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT id, brand_id, name, name_en, slug, cover_image, short_description, body, price,
            seo_title, seo_meta_description, published
     FROM products WHERE id = ? LIMIT 1`,
    [numId],
  );
  const row = rows[0];
  if (!row) notFound();

  const initial: ProductEditorInitial = {
    id: Number(row.id),
    brand_id: row.brand_id != null ? Number(row.brand_id) : null,
    name: String(row.name),
    name_en: row.name_en != null ? String(row.name_en) : null,
    slug: String(row.slug),
    cover_image: row.cover_image != null ? String(row.cover_image) : null,
    short_description: row.short_description != null ? String(row.short_description) : null,
    body: row.body != null ? String(row.body) : "",
    price: row.price != null ? String(row.price) : null,
    seo_title: row.seo_title != null ? String(row.seo_title) : null,
    seo_meta_description: row.seo_meta_description != null ? String(row.seo_meta_description) : null,
    published: Number(row.published) === 1,
  };

  return <ProductEditorForm variant="edit" initial={initial} />;
}

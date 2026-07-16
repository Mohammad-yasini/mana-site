import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPool } from "@/lib/db";
import type { RowDataPacket } from "mysql2";
import "@/app/app-content.css";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

const DEFAULT_PRODUCT_IMG = "/assets/images/img/camera2.png";

async function loadBrand(slug: string) {
  const pool = getPool();
  const [rows] = await pool.execute<RowDataPacket[]>(
    "SELECT id, name, name_en, slug, logo, description FROM brands WHERE slug = ? LIMIT 1",
    [slug],
  );
  return rows[0];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = decodeURIComponent((await params).slug);
  try {
    const brand = await loadBrand(slug);
    if (!brand) return { title: "برند - مانا الکترونیک" };
    return {
      title: `${String(brand.name)} — مانا الکترونیک`,
      description: brand.description ? String(brand.description).slice(0, 160) : undefined,
    };
  } catch {
    return { title: "برند - مانا الکترونیک" };
  }
}

export default async function BrandPage({ params }: Props) {
  const slug = decodeURIComponent((await params).slug);

  let brand: RowDataPacket | undefined;
  let products: RowDataPacket[] = [];
  try {
    const brandRow = await loadBrand(slug);
    if (!brandRow) {
      notFound();
    }
    brand = brandRow;
    const pool = getPool();
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT id, name, name_en, slug, cover_image, short_description, price
       FROM products
       WHERE published = 1 AND brand_id = ?
       ORDER BY name_en ASC`,
      [brandRow.id],
    );
    products = rows;
  } catch {
    return (
      <main className="container-sm" style={{ padding: "48px 0" }}>
        <div className="alert alert-danger">اتصال به دیتابیس برقرار نشد.</div>
        <p>
          <Link href="/brands">← همه برندها</Link>
        </p>
      </main>
    );
  }

  if (!brand) {
    notFound();
  }

  const brandName = String(brand.name);
  const brandEn = brand.name_en ? String(brand.name_en) : "";
  const heroDesc =
    brand.description && String(brand.description).trim()
      ? String(brand.description).trim()
      : `محصولات برند «${brandName}» در مانا الکترونیک.`;

  return (
    <main>
      <section className="page-hero container-sm">
        <div className="page-hero__inner">
          <div className="page-hero__content">
            <h1 className="page-hero__title">{brandName}</h1>
            {brandEn ? <p className="en dirLTR">{brandEn}</p> : null}
            <p className="page-hero__desc">{heroDesc}</p>
            <div className="page-hero__actions">
              <Link href="/brands" className="services-btn services-btn--ghost">
                همه برندها
              </Link>
              <Link href="/contact" className="services-btn services-btn--primary">
                مشاوره خرید
              </Link>
            </div>
          </div>
          <div className="page-hero__media">
            <img src={brand.logo ? String(brand.logo) : DEFAULT_PRODUCT_IMG} alt={brandName} />
          </div>
        </div>
      </section>

      <section className="products-section container-sm" style={{ padding: "24px 0 64px" }}>
        <h2 className="services-title" style={{ marginBottom: 24 }}>
          محصولات {brandName}
        </h2>

        {products.length === 0 ? (
          <p className="text-muted">برای این برند هنوز محصولی ثبت نشده است.</p>
        ) : (
          <div className="products-grid">
            {products.map((p) => (
              <Link
                key={Number(p.id)}
                href={`/product/${encodeURIComponent(String(p.slug))}`}
                className="product-card"
              >
                <div className="product-card__img">
                  <img
                    src={p.cover_image ? String(p.cover_image) : DEFAULT_PRODUCT_IMG}
                    alt={String(p.name)}
                  />
                </div>
                <div className="product-card__body">
                  <h3 className="product-card__title">{String(p.name)}</h3>
                  {p.name_en ? <p className="product-card__en dirLTR">{String(p.name_en)}</p> : null}
                  {p.short_description ? (
                    <p className="product-card__desc">{String(p.short_description)}</p>
                  ) : null}
                  <div className="product-card__footer">
                    {p.price ? <span className="product-card__price">{String(p.price)}</span> : <span />}
                    <span className="product-card__more">مشاهده محصول ←</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

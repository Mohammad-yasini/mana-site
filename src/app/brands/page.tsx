import Link from "next/link";
import type { Metadata } from "next";
import { getPool } from "@/lib/db";
import type { RowDataPacket } from "mysql2";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "برندها - مانا الکترونیک",
  description: "برندهای معتبر تجهیزات امنیتی و نظارت تصویری در مانا الکترونیک.",
};

const DEFAULT_LOGO = "/assets/images/img/Layer_1.png";

export default async function BrandsPage() {
  let brands: RowDataPacket[] = [];
  let dbError = false;
  try {
    const pool = getPool();
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT b.id, b.name, b.name_en, b.slug, b.logo, b.description,
              (SELECT COUNT(*) FROM products p WHERE p.brand_id = b.id AND p.published = 1) AS product_count
       FROM brands b
       ORDER BY b.name ASC`,
    );
    brands = rows;
  } catch {
    dbError = true;
  }

  return (
    <main>
      <section className="page-hero container-sm">
        <div className="page-hero__inner">
          <div className="page-hero__content">
            <h1 className="page-hero__title">برندها</h1>
            <p className="page-hero__desc">
              مجموعه برندهای معتبر تجهیزات امنیتی و نظارت تصویری. روی هر برند کلیک
              کنید تا محصولات آن را ببینید.
            </p>
            <div className="page-hero__actions">
              <Link href="/" className="services-btn services-btn--ghost">
                صفحه اصلی
              </Link>
              <Link href="/contact" className="services-btn services-btn--primary">
                مشاوره خرید
              </Link>
            </div>
          </div>
          <div className="page-hero__media">
            <img src="/assets/images/img/catalog1.png" alt="" />
          </div>
        </div>
      </section>

      <section className="brand-section">
        <div className="container-sm brand-container">
          {dbError ? (
            <div className="alert alert-danger w-100">اتصال به دیتابیس برقرار نشد.</div>
          ) : brands.length === 0 ? (
            <p className="text-muted">هنوز برندی ثبت نشده است.</p>
          ) : (
            brands.map((b) => (
              <Link
                key={Number(b.id)}
                href={`/brand/${encodeURIComponent(String(b.slug))}`}
                className="brand-box"
              >
                <div className="brand-logo">
                  <img src={b.logo ? String(b.logo) : DEFAULT_LOGO} alt={String(b.name)} />
                </div>
                <div className="brand-text">{String(b.name)}</div>
              </Link>
            ))
          )}
        </div>
      </section>
    </main>
  );
}

import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPool } from "@/lib/db";
import { plainTextFromHtml, preparePostBody } from "@/lib/blogPostBody";
import type { RowDataPacket } from "mysql2";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

const DEFAULT_PRODUCT_IMG = "/assets/images/img/camera2.png";

async function loadProduct(slug: string) {
  const pool = getPool();
  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT p.id, p.name, p.name_en, p.slug, p.cover_image, p.short_description, p.body,
            p.price, p.seo_title, p.seo_meta_description, p.brand_id,
            b.name AS brand_name, b.slug AS brand_slug
     FROM products p
     LEFT JOIN brands b ON b.id = p.brand_id
     WHERE p.slug = ? AND p.published = 1
     LIMIT 1`,
    [slug],
  );
  return rows[0];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = decodeURIComponent((await params).slug);
  try {
    const row = await loadProduct(slug);
    if (!row) return { title: "محصول - مانا الکترونیک" };
    const title = (row.seo_title as string) || (row.name as string);
    const description =
      (row.seo_meta_description as string) ||
      (row.short_description ? String(row.short_description) : undefined) ||
      plainTextFromHtml(row.body != null ? String(row.body) : null, 160) ||
      undefined;
    return { title: `${title} — مانا الکترونیک`, description };
  } catch {
    return { title: "محصول - مانا الکترونیک" };
  }
}

export default async function ProductPage({ params }: Props) {
  const slug = decodeURIComponent((await params).slug);

  let row: RowDataPacket | undefined;
  let related: RowDataPacket[] = [];
  try {
    row = await loadProduct(slug);
    if (!row) {
      notFound();
    }
    if (row.brand_id != null) {
      const pool = getPool();
      const [rels] = await pool.execute<RowDataPacket[]>(
        `SELECT id, name, slug, cover_image, price
         FROM products
         WHERE published = 1 AND brand_id = ? AND id <> ?
         ORDER BY id DESC LIMIT 4`,
        [row.brand_id, row.id],
      );
      related = rels;
    }
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

  if (!row) {
    notFound();
  }

  const name = String(row.name);
  const nameEn = row.name_en ? String(row.name_en) : "";
  const coverSrc = row.cover_image ? String(row.cover_image) : DEFAULT_PRODUCT_IMG;
  const brandName = row.brand_name ? String(row.brand_name) : null;
  const brandSlug = row.brand_slug ? String(row.brand_slug) : null;
  const bodyHtml = row.body ? String(row.body) : "";
  const { safeHtml } = preparePostBody(bodyHtml);
  const hasBody = safeHtml.replace(/<[^>]*>/g, "").trim().length > 0;

  return (
    <main>
      <section className="post-hero container-sm">
        <div className="post-hero__inner">
          <div className="post-hero__content">
            <div className="post-hero__meta">
              <Link className="post-hero__back" href="/brands">
                برندها
              </Link>
              {brandSlug && brandName ? (
                <Link href={`/brand/${encodeURIComponent(brandSlug)}`} className="tag text-decoration-none">
                  {brandName}
                </Link>
              ) : (
                <span className="tag">محصول</span>
              )}
            </div>
            <h1 className="post-hero__title">{name}</h1>
            {nameEn ? <p className="en dirLTR">{nameEn}</p> : null}
            {row.short_description ? (
              <p className="post-hero__desc">{String(row.short_description)}</p>
            ) : null}
            {row.price ? (
              <p style={{ fontWeight: 700, fontSize: 20, marginTop: 8 }}>{String(row.price)}</p>
            ) : null}
            <div className="page-hero__actions" style={{ marginTop: 16 }}>
              <Link href="/contact" className="services-btn services-btn--primary">
                درخواست خرید / مشاوره
              </Link>
              {brandSlug ? (
                <Link
                  href={`/brand/${encodeURIComponent(brandSlug)}`}
                  className="services-btn services-btn--ghost"
                >
                  محصولات این برند
                </Link>
              ) : null}
            </div>
          </div>
          <div className="post-hero__img">
            <img src={coverSrc} alt={name} />
          </div>
        </div>
      </section>

      <section className="post container-sm">
        <div className="post-layout">
          <article className="post-article">
            {hasBody ? (
              <div
                className="blog-post-body post-html"
                dir="rtl"
                dangerouslySetInnerHTML={{ __html: safeHtml }}
              />
            ) : (
              <p className="text-muted">توضیحات تکمیلی برای این محصول ثبت نشده است.</p>
            )}

            <div className="post-article__footer">
              <Link href="/contact" className="services-btn services-btn--primary">
                درخواست خرید
                <img
                  src="/assets/images/app-icons/si_arrow-right-fill.png"
                  alt=""
                  width={20}
                  height={20}
                />
              </Link>
              <Link href="/brands" className="services-btn services-btn--ghost">
                سایر برندها
              </Link>
            </div>
          </article>

          <aside className="post-aside">
            {related.length > 0 ? (
              <div className="aside-card">
                <div className="aside-title">محصولات مرتبط</div>
                {related.map((rel) => (
                  <Link
                    key={Number(rel.id)}
                    className="aside-post"
                    href={`/product/${encodeURIComponent(String(rel.slug))}`}
                  >
                    <img
                      src={rel.cover_image ? String(rel.cover_image) : DEFAULT_PRODUCT_IMG}
                      alt=""
                    />
                    <div>
                      <strong>{String(rel.name)}</strong>
                      {rel.price ? <span className="dirLTR">{String(rel.price)}</span> : null}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="aside-card">
                <div className="aside-title">راهنمای خرید</div>
                <p className="small text-muted px-2 pb-2 mb-0">
                  برای استعلام قیمت و موجودی با کارشناسان ما تماس بگیرید.
                </p>
              </div>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}

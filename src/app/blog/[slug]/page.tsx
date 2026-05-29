import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPool } from "@/lib/db";
import { plainTextFromHtml, preparePostBody } from "@/lib/blogPostBody";
import type { RowDataPacket } from "mysql2";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

const DEFAULT_COVER = "/assets/images/img/catalog1.png";

async function loadPost(slug: string) {
  const pool = getPool();
  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT p.id, p.title, p.slug, p.excerpt, p.body, p.created_at, p.cover_image,
            p.seo_title, p.seo_meta_description, p.category_id,
            c.slug AS category_slug, c.name AS category_name
     FROM blog_posts p
     LEFT JOIN blog_categories c ON c.id = p.category_id
     WHERE p.slug = ? AND p.published = 1
     LIMIT 1`,
    [slug],
  );
  return rows[0];
}

async function loadRelatedPosts(
  currentId: number,
  slug: string,
  categoryId: number | null,
): Promise<RowDataPacket[]> {
  const pool = getPool();
  const seen = new Set<number>([currentId]);
  const list: RowDataPacket[] = [];

  if (categoryId != null) {
    const [r] = await pool.execute<RowDataPacket[]>(
      `SELECT id, title, slug, cover_image, created_at
       FROM blog_posts
       WHERE published = 1 AND id <> ? AND category_id = ?
       ORDER BY id DESC LIMIT 4`,
      [currentId, categoryId],
    );
    for (const row of r) {
      if (list.length >= 2) break;
      list.push(row);
      seen.add(Number(row.id));
    }
  }

  const [r2] = await pool.execute<RowDataPacket[]>(
    `SELECT id, title, slug, cover_image, created_at
     FROM blog_posts
     WHERE published = 1 AND id <> ? AND slug <> ?
     ORDER BY id DESC LIMIT 8`,
    [currentId, slug],
  );
  for (const row of r2) {
    if (list.length >= 2) break;
    const id = Number(row.id);
    if (seen.has(id)) continue;
    list.push(row);
    seen.add(id);
  }

  return list.slice(0, 2);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const raw = (await params).slug;
  const slug = decodeURIComponent(raw);
  try {
    const row = await loadPost(slug);
    if (!row) return { title: "وبلاگ — مانا الکترونیک" };
    const title = (row.seo_title as string) || (row.title as string);
    const description =
      (row.seo_meta_description as string) ||
      plainTextFromHtml(row.excerpt != null ? String(row.excerpt) : null, 160) ||
      undefined;
    return {
      title: `${title} — مانا الکترونیک`,
      description,
    };
  } catch {
    return { title: "وبلاگ — مانا الکترونیک" };
  }
}

const RELATED_PLACEHOLDERS = [
  "/assets/images/img/catalog2.png",
  "/assets/images/img/catalog3.png",
];

export default async function BlogPostPage({ params }: Props) {
  const raw = (await params).slug;
  const slug = decodeURIComponent(raw);

  let row: RowDataPacket | undefined;
  let dbError = false;
  try {
    row = await loadPost(slug);
  } catch {
    dbError = true;
  }

  if (dbError) {
    return (
      <main className="container-sm" style={{ padding: "48px 0" }}>
        <div className="alert alert-danger">
          اتصال به دیتابیس یا خواندن نوشته ممکن نشد. تنظیمات MySQL و وجود جدول
          وبلاگ را بررسی کنید.
        </div>
        <p>
          <Link href="/blog">← وبلاگ</Link>
        </p>
      </main>
    );
  }

  if (!row) {
    notFound();
  }

  const title = String(row.title);
  const excerptPlain = plainTextFromHtml(row.excerpt != null ? String(row.excerpt) : null, 500);
  const heroDesc =
    excerptPlain ||
    plainTextFromHtml(String(row.body), 280) ||
    "مطالعهٔ این نوشته در وبلاگ مانا الکترونیک.";

  const { safeHtml, toc } = preparePostBody(String(row.body));
  const coverSrc = row.cover_image ? String(row.cover_image) : DEFAULT_COVER;
  const categorySlug = row.category_slug != null ? String(row.category_slug) : null;
  const categoryName = row.category_name != null ? String(row.category_name) : null;
  const dateStr = row.created_at ? String(row.created_at).slice(0, 10) : "";

  const currentId = Number(row.id);
  const rawCatId = row.category_id;
  const categoryId =
    rawCatId != null && rawCatId !== "" && Number.isFinite(Number(rawCatId))
      ? Number(rawCatId)
      : null;

  let related: RowDataPacket[] = [];
  try {
    related = await loadRelatedPosts(currentId, slug, categoryId);
  } catch {
    related = [];
  }

  const relatedHref = categorySlug
    ? `/blog-category/${encodeURIComponent(categorySlug)}`
    : "/blog";

  return (
    <main>
      <section className="post-hero container-sm">
        <div className="post-hero__inner">
          <div className="post-hero__content">
            <div className="post-hero__meta">
              <Link className="post-hero__back" href="/blog">
                بازگشت به وبلاگ
              </Link>
              {categorySlug && categoryName ? (
                <Link href={relatedHref} className="tag text-decoration-none">
                  {categoryName}
                </Link>
              ) : (
                <span className="tag">عمومی</span>
              )}
              <span className="date dirLTR">{dateStr}</span>
            </div>
            <h1 className="post-hero__title">{title}</h1>
            <p className="post-hero__desc">{heroDesc}</p>
          </div>
          <div className="post-hero__img">
            <img src={coverSrc} alt="" />
          </div>
        </div>
      </section>

      <section className="post container-sm">
        <div className="post-layout">
          <article className="post-article">
            <div
              className="blog-post-body post-html"
              dir="rtl"
              dangerouslySetInnerHTML={{ __html: safeHtml }}
            />

            <div className="post-article__footer">
              <Link href="/services" className="services-btn services-btn--primary">
                درخواست مشاوره
                <img
                  src="/assets/images/app-icons/si_arrow-right-fill.png"
                  alt=""
                  width={20}
                  height={20}
                />
              </Link>
              <Link href={relatedHref} className="services-btn services-btn--ghost">
                مطالب مرتبط
              </Link>
            </div>
          </article>

          <aside className="post-aside">
            <div className="aside-card">
              <div className="aside-title">فهرست</div>
              {toc.length === 0 ? (
                <p className="small text-muted px-2 pb-2 mb-0">برای این نوشته تیتر H2 ثبت نشده است.</p>
              ) : (
                toc.map((item) => (
                  <a key={item.id} href={`#${item.id}`} className="aside-link">
                    {item.text}
                  </a>
                ))
              )}
            </div>

            <div className="aside-card">
              <div className="aside-title">مطالب پیشنهادی</div>
              {related.length === 0 ? (
                <p className="small text-muted px-2 pb-2 mb-0">نوشتهٔ دیگری برای پیشنهاد وجود ندارد.</p>
              ) : (
                related.map((rel, idx) => (
                  <Link
                    key={Number(rel.id)}
                    className="aside-post"
                    href={`/blog/${encodeURIComponent(String(rel.slug))}`}
                  >
                    <img
                      src={
                        rel.cover_image
                          ? String(rel.cover_image)
                          : RELATED_PLACEHOLDERS[idx % RELATED_PLACEHOLDERS.length]
                      }
                      alt=""
                    />
                    <div>
                      <strong>{String(rel.title)}</strong>
                      <span className="dirLTR">
                        {rel.created_at ? String(rel.created_at).slice(0, 10) : ""}
                      </span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPool } from "@/lib/db";
import type { RowDataPacket } from "mysql2";
import { BlogCategoryListing } from "@/components/blog/BlogCategoryListing";
import type { BlogIndexCategory, BlogIndexPost } from "@/components/blog/BlogIndexListing";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

async function loadCategory(slug: string) {
  const pool = getPool();
  const [rows] = await pool.execute<RowDataPacket[]>(
    "SELECT id, name, slug, seo_title, meta_description FROM blog_categories WHERE slug = ? LIMIT 1",
    [slug],
  );
  return rows[0];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const raw = (await params).slug;
  const slug = decodeURIComponent(raw);
  try {
    const cat = await loadCategory(slug);
    if (!cat) return { title: "دسته‌بندی وبلاگ - مانا الکترونیک" };
    const title =
      (cat.seo_title as string) || `دسته‌بندی: ${String(cat.name)} — مانا الکترونیک`;
    const description = (cat.meta_description as string) || undefined;
    return { title, description };
  } catch {
    return { title: "دسته‌بندی وبلاگ - مانا الکترونیک" };
  }
}

function rowToPost(p: RowDataPacket, categoryName: string, categorySlug: string): BlogIndexPost {
  return {
    id: Number(p.id),
    title: String(p.title),
    slug: String(p.slug),
    excerpt: p.excerpt != null ? String(p.excerpt) : null,
    cover_image: p.cover_image != null ? String(p.cover_image) : null,
    category_slug: categorySlug,
    category_name: categoryName,
    created_at: p.created_at != null ? String(p.created_at) : null,
  };
}

export default async function BlogCategoryPage({ params }: Props) {
  const raw = (await params).slug;
  const slug = decodeURIComponent(raw);

  let cat: RowDataPacket | undefined;
  let postRows: RowDataPacket[] = [];
  let allCategories: BlogIndexCategory[] = [];

  try {
    const catRow = await loadCategory(slug);
    if (!catRow) {
      notFound();
    }
    cat = catRow;
    const pool = getPool();
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT p.id, p.title, p.slug, p.excerpt, p.cover_image, p.created_at
       FROM blog_posts p
       WHERE p.published = 1 AND p.category_id = ?
       ORDER BY p.id DESC`,
      [catRow.id],
    );
    postRows = rows;

    const [catRows] = await pool.execute<RowDataPacket[]>(
      `SELECT slug, name FROM blog_categories ORDER BY name ASC`,
    );
    allCategories = catRows.map((c) => ({
      slug: String(c.slug),
      name: String(c.name),
    }));
  } catch {
    return (
      <main>
        <section className="page-hero container-sm">
          <div className="page-hero__inner">
            <div className="page-hero__content">
              <h1 className="page-hero__title">خطا</h1>
              <p className="page-hero__desc">اتصال به دیتابیس برقرار نشد.</p>
              <div className="page-hero__actions">
                <Link href="/blog" className="services-btn services-btn--ghost">
                  بازگشت به وبلاگ
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (!cat) {
    notFound();
  }

  const categoryName = String(cat.name);
  const heroDesc =
    cat.meta_description && String(cat.meta_description).trim()
      ? String(cat.meta_description).trim()
      : `مجموعه نوشته‌های مرتبط با «${categoryName}».`;

  const posts: BlogIndexPost[] = postRows.map((p) => rowToPost(p, categoryName, slug));
  const latestPostSlug = posts[0]?.slug;

  return (
    <main>
      <section className="page-hero container-sm">
        <div className="page-hero__inner">
          <div className="page-hero__content">
            <h1 className="page-hero__title">دسته‌بندی: {categoryName}</h1>
            <p className="page-hero__desc">{heroDesc}</p>
            <div className="page-hero__actions">
              <Link href="/blog" className="services-btn services-btn--ghost">
                بازگشت به وبلاگ
              </Link>
              {latestPostSlug ? (
                <Link
                  href={`/blog/${encodeURIComponent(latestPostSlug)}`}
                  className="services-btn services-btn--primary"
                >
                  خواندن یک نوشته
                </Link>
              ) : (
                <span className="services-btn services-btn--primary" style={{ opacity: 0.55 }}>
                  خواندن یک نوشته
                </span>
              )}
            </div>
          </div>
          <div className="page-hero__media">
            <img src="/assets/images/img/catalog2.png" alt="" />
          </div>
        </div>
      </section>

      <BlogCategoryListing
        currentSlug={slug}
        categoryDisplayName={categoryName}
        posts={posts}
        allCategories={allCategories}
      />
    </main>
  );
}

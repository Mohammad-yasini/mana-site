import Link from "next/link";
import type { Metadata } from "next";
import { getPool } from "@/lib/db";
import type { RowDataPacket } from "mysql2";
import {
  BlogIndexListing,
  type BlogIndexCategory,
  type BlogIndexPost,
} from "@/components/blog/BlogIndexListing";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "وبلاگ - مانا الکترونیک",
  description: "راهنماها، آموزش‌ها و نکات اجرایی حوزه امنیت و نظارت تصویری.",
};

function rowToPost(p: RowDataPacket): BlogIndexPost {
  return {
    id: Number(p.id),
    title: String(p.title),
    slug: String(p.slug),
    excerpt: p.excerpt != null ? String(p.excerpt) : null,
    cover_image: p.cover_image != null ? String(p.cover_image) : null,
    category_slug: p.category_slug != null ? String(p.category_slug) : null,
    category_name: p.category_name != null ? String(p.category_name) : null,
    created_at: p.created_at != null ? String(p.created_at) : null,
  };
}

export default async function BlogIndexPage() {
  let posts: BlogIndexPost[] = [];
  let categories: BlogIndexCategory[] = [];
  let error: string | null = null;

  const pool = getPool();
  try {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT p.id, p.title, p.slug, p.excerpt, p.created_at, p.cover_image,
              c.slug AS category_slug, c.name AS category_name
       FROM blog_posts p
       LEFT JOIN blog_categories c ON c.id = p.category_id
       WHERE p.published = 1
       ORDER BY p.id DESC`,
    );
    posts = rows.map(rowToPost);
  } catch {
    error =
      "جدول وبلاگ در دیتابیس نیست یا ستون‌ها به‌روز نیستند. فایل‌های database/blog_posts.sql و database/migration_blog_v3.sql را در phpMyAdmin اجرا کنید.";
  }

  if (!error) {
    try {
      const [catRows] = await pool.execute<RowDataPacket[]>(
        `SELECT slug, name FROM blog_categories ORDER BY name ASC`,
      );
      categories = catRows.map((c) => ({
        slug: String(c.slug),
        name: String(c.name),
      }));
    } catch {
      categories = [];
    }
  }

  const latestSlug = posts[0]?.slug;

  return (
    <main>
      <section className="page-hero container-sm">
        <div className="page-hero__inner">
          <div className="page-hero__content">
            <h1 className="page-hero__title">وبلاگ مانا</h1>
            <p className="page-hero__desc">
              راهنماها، آموزش‌ها و نکات اجرایی حوزه امنیت و نظارت تصویری.
            </p>
            <div className="page-hero__actions">
              <Link
                href="/blog#blog-listing"
                className="services-btn services-btn--ghost"
              >
                مشاهده دسته‌بندی‌ها
              </Link>
              {latestSlug ? (
                <Link
                  href={`/blog/${encodeURIComponent(latestSlug)}`}
                  className="services-btn services-btn--primary"
                >
                  آخرین نوشته
                </Link>
              ) : (
                <span className="services-btn services-btn--primary" style={{ opacity: 0.6 }}>
                  آخرین نوشته
                </span>
              )}
            </div>
          </div>

          <div className="page-hero__media">
            <img src="/assets/images/img/banner2.png" alt="وبلاگ" />
          </div>
        </div>
      </section>

      <BlogIndexListing posts={posts} categories={categories} dbError={error} />
    </main>
  );
}

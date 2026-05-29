import Link from "next/link";
import { DeletePostButton } from "@/components/blog/DeletePostButton";
import { getPool } from "@/lib/db";
import { getAdminFromCookies } from "@/lib/admin-session";
import { redirect } from "next/navigation";
import type { RowDataPacket } from "mysql2";

export default async function DashboardPostsPage() {
  const admin = await getAdminFromCookies();
  if (!admin) redirect("/login");

  let rows: RowDataPacket[] = [];
  let dbError: string | null = null;
  try {
    const pool = getPool();
    const [r] = await pool.execute<RowDataPacket[]>(
      `SELECT p.id, p.title, p.slug, p.published, p.created_at, p.cover_image,
              c.name AS category_name
       FROM blog_posts p
       LEFT JOIN blog_categories c ON c.id = p.category_id
       ORDER BY p.id DESC`,
    );
    rows = r;
  } catch {
    dbError =
      "جدول نوشته‌ها هنوز ساخته نشده. در phpMyAdmin فایل database/blog_posts.sql را اجرا کنید.";
  }

  return (
    <main className="container-sm" style={{ padding: "48px 0" }}>
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <h1 className="h4 m-0">نوشته‌های وبلاگ</h1>
        <Link href="/dashboard/posts/new" className="btn btn-primary">
          نوشتهٔ جدید
        </Link>
      </div>

      {dbError ? (
        <div className="alert alert-warning">{dbError}</div>
      ) : rows.length === 0 ? (
        <p className="text-muted">هنوز نوشته‌ای ثبت نشده. «نوشتهٔ جدید» را بزنید.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th>#</th>
                <th>عنوان</th>
                <th>دسته</th>
                <th>وضعیت</th>
                <th>تاریخ</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={Number(p.id)}>
                  <td>{Number(p.id)}</td>
                  <td>{String(p.title)}</td>
                  <td>{p.category_name ? String(p.category_name) : "—"}</td>
                  <td>{Number(p.published) === 1 ? "منتشر شده" : "پیش‌نویس"}</td>
                  <td className="text-nowrap small">
                    {p.created_at ? String(p.created_at) : "—"}
                  </td>
                  <td className="text-nowrap">
                    <Link
                      href={`/dashboard/posts/${Number(p.id)}/edit`}
                      className="btn btn-sm btn-outline-primary"
                    >
                      ویرایش
                    </Link>
                    <DeletePostButton postId={Number(p.id)} title={String(p.title)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-4">
        <Link href="/dashboard">← بازگشت به داشبورد</Link>
      </p>
    </main>
  );
}

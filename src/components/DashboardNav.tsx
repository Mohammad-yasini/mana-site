import Link from "next/link";

export function DashboardNav() {
  return (
    <nav
      className="border-bottom py-2 mb-3"
      style={{ background: "var(--bs-light, #f8f9fa)" }}
    >
      <div className="container-sm d-flex flex-wrap gap-3 small">
        <Link href="/dashboard">داشبورد</Link>
        <Link href="/dashboard/posts">نوشته‌ها</Link>
        <Link href="/dashboard/posts/new">نوشتهٔ جدید</Link>
        <Link href="/dashboard/categories">دسته‌های وبلاگ</Link>
        <Link href="/dashboard/representation">درخواست‌های نمایندگی</Link>
        <Link href="/dashboard/header">هدر سایت</Link>
        <Link href="/dashboard/footer">فوتر سایت</Link>
      </div>
    </nav>
  );
}

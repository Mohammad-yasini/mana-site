import Link from "next/link";

export default function DashboardPage() {
  return (
    <main className="container-sm" style={{ padding: "48px 0" }}>
      <h1 style={{ fontSize: 24, fontWeight: 700 }}>داشبورد</h1>
      <p style={{ marginTop: 12, lineHeight: 1.9 }}>
        از اینجا بخش‌های مدیریتی را باز کنید. برای وبلاگ، نوشته بسازید یا لیست
        قبلی را ببینید.
      </p>
      <ul style={{ marginTop: 20, lineHeight: 2 }}>
        <li>
          <Link href="/dashboard/posts/new">نوشتهٔ جدید (وبلاگ)</Link>
        </li>
        <li>
          <Link href="/dashboard/posts">همهٔ نوشته‌ها</Link>
        </li>
        <li>
          <Link href="/dashboard/categories">دسته‌های وبلاگ (افزودن / ویرایش)</Link>
        </li>
        <li>
          <Link href="/dashboard/representation">درخواست‌های اعطای نمایندگی</Link>
        </li>
      </ul>
    </main>
  );
}


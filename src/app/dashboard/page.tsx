import Link from "next/link";
import { getPool } from "@/lib/db";

export const dynamic = "force-dynamic";

type Counts = {
  posts: number;
  categories: number;
  brands: number;
  products: number;
  reps: number;
  repsNew: number;
};

async function getCounts(): Promise<Counts> {
  const empty: Counts = { posts: 0, categories: 0, brands: 0, products: 0, reps: 0, repsNew: 0 };
  try {
    const pool = getPool();
    const [rows] = await pool.query(
      `SELECT
        (SELECT COUNT(*) FROM posts) AS posts,
        (SELECT COUNT(*) FROM categories) AS categories,
        (SELECT COUNT(*) FROM brands) AS brands,
        (SELECT COUNT(*) FROM products) AS products,
        (SELECT COUNT(*) FROM representation_requests) AS reps,
        (SELECT COUNT(*) FROM representation_requests WHERE status = 'new') AS repsNew`,
    );
    const r = (rows as Record<string, number>[])[0] ?? {};
    return {
      posts: Number(r.posts) || 0,
      categories: Number(r.categories) || 0,
      brands: Number(r.brands) || 0,
      products: Number(r.products) || 0,
      reps: Number(r.reps) || 0,
      repsNew: Number(r.repsNew) || 0,
    };
  } catch {
    return empty;
  }
}

const ICONS = {
  doc: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
      <path d="M14 3v6h6M8 13h8M8 17h6" />
    </svg>
  ),
  tag: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.5 13.5 13 21l-9-9V4h8z" />
      <circle cx="8.5" cy="8.5" r="1.5" />
    </svg>
  ),
  box: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 8 12 3 3 8l9 5 9-5z" />
      <path d="M3 8v8l9 5 9-5V8M12 13v8" />
    </svg>
  ),
  cube: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
    </svg>
  ),
  inbox: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12h5l2 3h4l2-3h5" />
      <path d="M5 5h14l2 7v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-6z" />
    </svg>
  ),
  plus: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
};

export default async function DashboardPage() {
  const c = await getCounts();

  const stats = [
    { href: "/dashboard/posts", label: "نوشته‌های وبلاگ", num: c.posts, icon: ICONS.doc, cls: "" },
    { href: "/dashboard/products", label: "محصولات", num: c.products, icon: ICONS.cube, cls: "admin-stat--blue" },
    { href: "/dashboard/brands", label: "برندها", num: c.brands, icon: ICONS.box, cls: "admin-stat--amber" },
    { href: "/dashboard/representation", label: "درخواست‌های نمایندگی", num: c.reps, icon: ICONS.inbox, cls: "admin-stat--rose" },
  ];

  const quick = [
    { href: "/dashboard/posts/new", title: "نوشتهٔ جدید", desc: "افزودن مقاله یا خبر جدید به وبلاگ" },
    { href: "/dashboard/products/new", title: "محصول جدید", desc: "ثبت محصول تازه و اتصال آن به برند" },
    { href: "/dashboard/brands", title: "مدیریت برندها", desc: "افزودن، ویرایش و حذف برندها" },
    { href: "/dashboard/categories", title: "دسته‌های وبلاگ", desc: "سازماندهی دسته‌بندی مطالب" },
    { href: "/dashboard/header", title: "تنظیمات هدر", desc: "ویرایش منوها و شماره تماس بالای سایت" },
    { href: "/dashboard/footer", title: "تنظیمات فوتر", desc: "ویرایش لینک‌ها، متن و نمادهای اعتماد" },
  ];

  return (
    <div>
      <div className="admin-hello">
        <h1>خوش آمدید</h1>
        <p>نمای کلی پنل مدیریت مانا الکترونیک. از کارت‌های زیر به بخش‌های مختلف دسترسی دارید.</p>
      </div>

      <div className="admin-stats">
        {stats.map((s) => (
          <Link key={s.href} href={s.href} className={`admin-stat ${s.cls}`}>
            <span className="admin-stat__icon">{s.icon}</span>
            <span>
              <span className="admin-stat__num">{s.num.toLocaleString("fa-IR")}</span>
              <span className="admin-stat__label" style={{ display: "block" }}>
                {s.label}
                {s.href.includes("representation") && c.repsNew > 0 ? ` • ${c.repsNew.toLocaleString("fa-IR")} جدید` : ""}
              </span>
            </span>
          </Link>
        ))}
      </div>

      <h2 className="admin-section-title">دسترسی سریع</h2>
      <div className="admin-quick">
        {quick.map((q) => (
          <Link key={q.href + q.title} href={q.href} className="admin-quick__card">
            <span className="admin-quick__icon">{ICONS.plus}</span>
            <strong>{q.title}</strong>
            <span>{q.desc}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";

type Props = { adminEmail?: string; children: ReactNode };

type NavItem = { href: string; label: string; icon: ReactNode; exact?: boolean };
type NavGroup = { title: string; items: NavItem[] };

const I = {
  home: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
    </svg>
  ),
  doc: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
      <path d="M14 3v6h6M8 13h8M8 17h6" />
    </svg>
  ),
  folder: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
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
  layoutTop: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 9h18" />
    </svg>
  ),
  layoutBottom: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 15h18" />
    </svg>
  ),
  logout: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
    </svg>
  ),
  external: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 4h6v6M20 4l-9 9M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" />
    </svg>
  ),
  menu: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),
  seo: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3M8.5 11h5M11 8.5v5" />
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  ),
  robot: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M8 9h8M8 13h5M8 17h3" />
    </svg>
  ),
};

const GROUPS: NavGroup[] = [
  {
    title: "اصلی",
    items: [{ href: "/dashboard", label: "داشبورد", icon: I.home, exact: true }],
  },
  {
    title: "محتوا",
    items: [
      { href: "/dashboard/posts", label: "نوشته‌ها", icon: I.doc },
      { href: "/dashboard/categories", label: "دسته‌های وبلاگ", icon: I.tag },
    ],
  },
  {
    title: "فروشگاه",
    items: [
      { href: "/dashboard/brands", label: "برندها", icon: I.box },
      { href: "/dashboard/products", label: "محصولات", icon: I.cube },
    ],
  },
  {
    title: "ارتباطات",
    items: [{ href: "/dashboard/representation", label: "درخواست‌های نمایندگی", icon: I.inbox }],
  },
  {
    title: "تنظیمات سایت",
    items: [
      { href: "/dashboard/settings", label: "تنظیمات کلی", icon: I.settings },
      { href: "/dashboard/header", label: "هدر سایت", icon: I.layoutTop },
      { href: "/dashboard/footer", label: "فوتر سایت", icon: I.layoutBottom },
      { href: "/dashboard/seo", label: "سئوی برگه‌ها", icon: I.seo },
      { href: "/dashboard/robots", label: "robots.txt", icon: I.robot },
    ],
  },
];

const TITLES: { match: (p: string) => boolean; title: string }[] = [
  { match: (p) => p === "/dashboard", title: "داشبورد" },
  { match: (p) => p.startsWith("/dashboard/posts"), title: "نوشته‌ها" },
  { match: (p) => p.startsWith("/dashboard/categories"), title: "دسته‌های وبلاگ" },
  { match: (p) => p.startsWith("/dashboard/brands"), title: "برندها" },
  { match: (p) => p.startsWith("/dashboard/products"), title: "محصولات" },
  { match: (p) => p.startsWith("/dashboard/representation"), title: "درخواست‌های نمایندگی" },
  { match: (p) => p.startsWith("/dashboard/settings"), title: "تنظیمات کلی" },
  { match: (p) => p.startsWith("/dashboard/header"), title: "هدر سایت" },
  { match: (p) => p.startsWith("/dashboard/footer"), title: "فوتر سایت" },
  { match: (p) => p.startsWith("/dashboard/seo"), title: "سئوی برگه‌ها" },
  { match: (p) => p.startsWith("/dashboard/robots"), title: "robots.txt" },
];

function isActive(pathname: string, item: NavItem): boolean {
  if (item.exact) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(item.href + "/");
}

export function DashboardShell({ adminEmail, children }: Props) {
  const pathname = usePathname() || "/dashboard";
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const pageTitle = TITLES.find((t) => t.match(pathname))?.title ?? "داشبورد";
  const avatarChar = (adminEmail?.trim()?.[0] ?? "م").toUpperCase();

  async function logout() {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      /* ignore */
    }
    router.push("/login");
    router.refresh();
  }

  return (
    <div className={`admin-root${open ? " is-open" : ""}`}>
      <div className="admin-shell">
        <aside className="admin-sidebar">
          <div className="admin-brand">
            <span className="admin-brand__logo">م</span>
            <div className="admin-brand__text">
              <strong>مانا الکترونیک</strong>
              <span>پنل مدیریت</span>
            </div>
          </div>

          <nav className="admin-nav">
            {GROUPS.map((group) => (
              <div key={group.title}>
                <div className="admin-nav__group">{group.title}</div>
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`admin-nav__link${isActive(pathname, item) ? " is-active" : ""}`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            ))}
          </nav>

          <div className="admin-sidebar__foot">
            <button type="button" className="admin-logout" onClick={() => void logout()} disabled={loggingOut}>
              {I.logout}
              <span>{loggingOut ? "در حال خروج…" : "خروج از حساب"}</span>
            </button>
          </div>
        </aside>

        <div className="admin-main">
          <header className="admin-topbar">
            <button
              type="button"
              className="admin-burger"
              aria-label="منو"
              onClick={() => setOpen((v) => !v)}
            >
              {I.menu}
            </button>
            <div>
              <h1 className="admin-topbar__title">{pageTitle}</h1>
              <div className="admin-topbar__crumb">پنل مدیریت مانا الکترونیک</div>
            </div>
            <div className="admin-topbar__spacer" />
            <a href="/" target="_blank" rel="noreferrer" className="admin-topbar__btn">
              {I.external}
              <span>مشاهده سایت</span>
            </a>
            <div className="admin-topbar__user">
              <span className="admin-topbar__email">{adminEmail ?? "مدیر"}</span>
              <span className="admin-topbar__avatar">{avatarChar}</span>
            </div>
          </header>

          <div className="admin-content">{children}</div>
        </div>
      </div>

      <div className="admin-overlay" onClick={() => setOpen(false)} />
    </div>
  );
}

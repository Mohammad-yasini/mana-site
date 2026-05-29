"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { HeaderNavLink } from "@/lib/siteHeader";

type Props = {
  contactSubtitle: string;
  phoneHtml: string;
  navLinks: HeaderNavLink[];
};

export function HeaderClient({ contactSubtitle, phoneHtml, navLinks }: Props) {
  const pathname = usePathname();

  return (
    <header className="header">
      <nav className="navbar navbar-expand-lg">
        <div className="container-sm headIn">
          <div className="header-right">
            <div className="logo">
              <Link href="/" aria-label="صفحه اصلی">
                <img
                  src="/assets/images/logo/1.svg"
                  alt="لوگوی مانا"
                  className="represent-icon"
                />
              </Link>
            </div>
            <div className="contact-info dirLTR">
              {contactSubtitle}
              <br />
              <span dangerouslySetInnerHTML={{ __html: phoneHtml }} />
            </div>
          </div>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav">
              {navLinks.map((item, idx) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/" && pathname?.startsWith(item.href));
                return (
                  <Link
                    key={`${idx}-${item.href}`}
                    href={item.href}
                    className={`menu-item${isActive ? " is-active" : ""}`}
                  >
                    {item.label}
                  </Link>
                );
              })}

              <Link href="/representation" className="represent-btn">
                <span>اعطای نمایندگی</span>
                <span className="icon">
                  <img
                    src="/assets/images/app-icons/ph_medal.svg"
                    alt="آیکن"
                    className="represent-icon"
                  />
                </span>
              </Link>

              <Link href="/dashboard" className="panel-btn">
                <span className="icon">
                  <img
                    src="/assets/images/app-icons/user-circle-fill.svg"
                    alt="پروفایل"
                    className="profile-icon"
                  />
                </span>
                پنل همکاران
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

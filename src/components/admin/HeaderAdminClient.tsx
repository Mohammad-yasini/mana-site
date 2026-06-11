"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { HeaderNavLink, SiteHeaderConfig } from "@/lib/siteHeader";

function cloneCfg(c: SiteHeaderConfig): SiteHeaderConfig {
  return JSON.parse(JSON.stringify(c)) as SiteHeaderConfig;
}

type Props = { initialConfig: SiteHeaderConfig };

export function HeaderAdminClient({ initialConfig }: Props) {
  const router = useRouter();
  const [cfg, setCfg] = useState(() => cloneCfg(initialConfig));
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function save() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/header", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config: cfg }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (res.status === 401) {
        window.location.href = "/login";
        return;
      }
      if (!res.ok) {
        setError(data.error ?? "ذخیره نشد");
        return;
      }
      router.refresh();
      alert("ذخیره شد.");
    } catch {
      setError("ارتباط با سرور برقرار نشد");
    } finally {
      setLoading(false);
    }
  }

  function setNav(fn: (prev: HeaderNavLink[]) => HeaderNavLink[]) {
    setCfg((c) => ({ ...c, navLinks: fn(c.navLinks) }));
  }

  return (
    <main className="container-sm" style={{ padding: "48px 0", maxWidth: 720 }}>
      <h1 className="h4 mb-2">ویرایش هدر سایت</h1>
      <p className="text-muted small mb-4">
        شماره تلفن را می‌توانید با تگ‌های ساده مثل <code>small</code> و{" "}
        <code>span class=&quot;color1&quot;</code> قالب‌بندی کنید. جدول{" "}
        <code>site_header_config</code> را از فایل{" "}
        <code>database/migration_site_header.sql</code> بسازید.
      </p>

      {error ? (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      ) : null}

      <div className="card mb-3">
        <div className="card-header">۱) متن بالای شماره (کنار لوگو)</div>
        <div className="card-body">
          <input
            className="form-control"
            value={cfg.contactSubtitle}
            onChange={(e) => setCfg((c) => ({ ...c, contactSubtitle: e.target.value }))}
            maxLength={200}
          />
        </div>
      </div>

      <div className="card mb-3">
        <div className="card-header">۲) نمایش شماره تلفن (HTML ساده)</div>
        <div className="card-body">
          <textarea
            className="form-control font-monospace small"
            dir="ltr"
            rows={3}
            value={cfg.phoneDisplayHtml}
            onChange={(e) => setCfg((c) => ({ ...c, phoneDisplayHtml: e.target.value }))}
            maxLength={500}
          />
        </div>
      </div>

      <div className="card mb-3">
        <div className="card-header">۳) دکمه‌های هدر (لینک)</div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label small">اعطای نمایندگی</label>
              <input
                className="form-control form-control-sm"
                dir="ltr"
                value={cfg.representationButtonHref}
                onChange={(e) =>
                  setCfg((c) => ({ ...c, representationButtonHref: e.target.value }))
                }
                placeholder="/representation"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label small">پنل همکاران</label>
              <input
                className="form-control form-control-sm"
                dir="ltr"
                value={cfg.panelButtonHref}
                onChange={(e) => setCfg((c) => ({ ...c, panelButtonHref: e.target.value }))}
                placeholder="/dashboard"
              />
            </div>
          </div>
          <p className="text-muted small mb-0 mt-2">
            لینک داخلی با <code>/</code> شروع شود؛ مثلاً <code>/representation</code> یا{" "}
            <code>/login</code>
          </p>
        </div>
      </div>

      <div className="card mb-3">
        <div className="card-header">۴) منوی اصلی (متن + لینک)</div>
        <div className="card-body">
          {cfg.navLinks.map((row, idx) => (
            <div key={idx} className="row g-2 mb-2 align-items-end">
              <div className="col-md-5">
                <label className="form-label small">متن</label>
                <input
                  className="form-control form-control-sm"
                  value={row.label}
                  onChange={(e) =>
                    setNav((prev) => {
                      const n = [...prev];
                      n[idx] = { ...n[idx], label: e.target.value };
                      return n;
                    })
                  }
                />
              </div>
              <div className="col-md-5">
                <label className="form-label small">لینک (href)</label>
                <input
                  className="form-control form-control-sm"
                  dir="ltr"
                  value={row.href}
                  onChange={(e) =>
                    setNav((prev) => {
                      const n = [...prev];
                      n[idx] = { ...n[idx], href: e.target.value };
                      return n;
                    })
                  }
                />
              </div>
              <div className="col-md-2">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger w-100"
                  onClick={() => setNav((prev) => prev.filter((_, i) => i !== idx))}
                >
                  حذف
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={() => setNav((prev) => [...prev, { label: "منوی جدید", href: "#" }])}
          >
            + آیتم منو
          </button>
        </div>
      </div>

      <button type="button" className="btn btn-primary" disabled={loading} onClick={() => void save()}>
        {loading ? "در حال ذخیره…" : "ذخیرهٔ هدر"}
      </button>
    </main>
  );
}

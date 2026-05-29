"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type {
  FooterBadgeItem,
  FooterColumnLink,
  FooterPhoneItem,
  SiteFooterConfig,
} from "@/lib/siteFooter";

function cloneCfg(c: SiteFooterConfig): SiteFooterConfig {
  return JSON.parse(JSON.stringify(c)) as SiteFooterConfig;
}

type Props = { initialConfig: SiteFooterConfig };

export function FooterAdminClient({ initialConfig }: Props) {
  const router = useRouter();
  const [cfg, setCfg] = useState(() => cloneCfg(initialConfig));
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadKey, setUploadKey] = useState(0);

  const jsonPreview = useMemo(() => JSON.stringify(cfg, null, 2), [cfg]);

  async function save() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/footer", {
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
      setError(null);
      alert("ذخیره شد.");
    } catch {
      setError("ارتباط با سرور برقرار نشد");
    } finally {
      setLoading(false);
    }
  }

  function setLinks(
    key: "brandsLinks" | "userLinks" | "quickLinks",
    fn: (prev: FooterColumnLink[]) => FooterColumnLink[],
  ) {
    setCfg((c) => ({ ...c, [key]: fn(c[key]) }));
  }

  function setPhones(fn: (prev: FooterPhoneItem[]) => FooterPhoneItem[]) {
    setCfg((c) => ({ ...c, phones: fn(c.phones) }));
  }

  function setBadges(fn: (prev: FooterBadgeItem[]) => FooterBadgeItem[]) {
    setCfg((c) => ({ ...c, badges: fn(c.badges) }));
  }

  async function uploadBadge(idx: number, file: File | undefined) {
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
    if (!res.ok) {
      setError(data.error ?? "آپلود ناموفق");
      return;
    }
    if (data.url) {
      setBadges((list) => {
        const next = [...list];
        if (next[idx]) next[idx] = { ...next[idx], src: data.url! };
        return next;
      });
      setUploadKey((k) => k + 1);
    }
  }

  function linkEditor(
    title: string,
    titleKey: "brandsColumnTitle" | "userColumnTitle" | "quickColumnTitle",
    linksKey: "brandsLinks" | "userLinks" | "quickLinks",
  ) {
    const links = cfg[linksKey];
    return (
      <div className="card mb-3">
        <div className="card-header">{title}</div>
        <div className="card-body">
          <div className="mb-3">
            <label className="form-label">عنوان ستون</label>
            <input
              className="form-control"
              value={cfg[titleKey]}
              onChange={(e) => setCfg((c) => ({ ...c, [titleKey]: e.target.value }))}
              maxLength={100}
            />
          </div>
          {links.map((row, idx) => (
            <div key={idx} className="row g-2 mb-2 align-items-end">
              <div className="col-md-5">
                <label className="form-label small">متن لینک</label>
                <input
                  className="form-control form-control-sm"
                  value={row.label}
                  onChange={(e) =>
                    setLinks(linksKey, (prev) => {
                      const n = [...prev];
                      n[idx] = { ...n[idx], label: e.target.value };
                      return n;
                    })
                  }
                />
              </div>
              <div className="col-md-5">
                <label className="form-label small">آدرس (href)</label>
                <input
                  className="form-control form-control-sm"
                  dir="ltr"
                  value={row.href}
                  onChange={(e) =>
                    setLinks(linksKey, (prev) => {
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
                  onClick={() =>
                    setLinks(linksKey, (prev) => prev.filter((_, i) => i !== idx))
                  }
                >
                  حذف
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={() =>
              setLinks(linksKey, (prev) => [...prev, { label: "لینک جدید", href: "#" }])
            }
          >
            + لینک
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="container-sm" style={{ padding: "48px 0", maxWidth: 960 }}>
      <h1 className="h4 mb-2">ویرایش فوتر سایت</h1>
      <p className="text-muted small mb-4">
        پس از ذخیره، فوتر در تمام صفحات از این تنظیمات خوانده می‌شود. یک‌بار جدول{" "}
        <code>site_footer_config</code> را در MySQL بسازید (فایل{" "}
        <code>database/migration_site_footer.sql</code>).
      </p>

      {error ? (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      ) : null}

      {linkEditor("۱) برندها", "brandsColumnTitle", "brandsLinks")}
      {linkEditor("۲) دسترسی کاربری", "userColumnTitle", "userLinks")}
      {linkEditor("۳) دسترسی سریع", "quickColumnTitle", "quickLinks")}

      <div className="card mb-3">
        <div className="card-header">۴) متن توضیحات (زیر لوگو، سمت راست)</div>
        <div className="card-body">
          <textarea
            className="form-control"
            rows={5}
            value={cfg.rightDescription}
            onChange={(e) => setCfg((c) => ({ ...c, rightDescription: e.target.value }))}
            maxLength={5000}
          />
        </div>
      </div>

      <div className="card mb-3">
        <div className="card-header">۵) شماره تماس‌ها (باکس میانی)</div>
        <div className="card-body">
          {cfg.phones.map((row, idx) => (
            <div key={idx} className="border rounded p-3 mb-3">
              <div className="row g-2">
                <div className="col-md-4">
                  <label className="form-label small">آیکن (مسیر)</label>
                  <input
                    className="form-control form-control-sm"
                    dir="ltr"
                    value={row.icon}
                    onChange={(e) =>
                      setPhones((prev) => {
                        const n = [...prev];
                        n[idx] = { ...n[idx], icon: e.target.value };
                        return n;
                      })
                    }
                  />
                  {row.icon ? (
                    <img src={row.icon} alt="" className="mt-1" width={28} height={28} />
                  ) : null}
                </div>
                <div className="col-md-4">
                  <label className="form-label small">متن نمایش</label>
                  <input
                    className="form-control form-control-sm"
                    value={row.text}
                    onChange={(e) =>
                      setPhones((prev) => {
                        const n = [...prev];
                        n[idx] = { ...n[idx], text: e.target.value };
                        return n;
                      })
                    }
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label small">لینک</label>
                  <input
                    className="form-control form-control-sm"
                    dir="ltr"
                    value={row.href}
                    onChange={(e) =>
                      setPhones((prev) => {
                        const n = [...prev];
                        n[idx] = { ...n[idx], href: e.target.value };
                        return n;
                      })
                    }
                  />
                </div>
                <div className="col-md-1 d-flex align-items-end">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => setPhones((prev) => prev.filter((_, i) => i !== idx))}
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={() =>
              setPhones((prev) => [
                ...prev,
                {
                  icon: "/assets/images/app-icons/cil_phone.svg",
                  text: "جدید",
                  href: "#",
                },
              ])
            }
          >
            + ردیف تماس
          </button>
        </div>
      </div>

      <div className="card mb-3">
        <div className="card-header">لوگو (سمت راست فوتر)</div>
        <div className="card-body">
          <div className="mb-3">
            <label className="form-label">زیرنویس زیر لوگو</label>
            <input
              className="form-control"
              value={cfg.logoTagline}
              onChange={(e) => setCfg((c) => ({ ...c, logoTagline: e.target.value }))}
              maxLength={200}
            />
          </div>
          <div className="mb-0">
            <label className="form-label">نمایش تلفن (می‌تواند HTML ساده باشد)</label>
            <textarea
              className="form-control font-monospace small"
              dir="ltr"
              rows={3}
              value={cfg.logoPhoneDisplay}
              onChange={(e) => setCfg((c) => ({ ...c, logoPhoneDisplay: e.target.value }))}
              maxLength={500}
            />
          </div>
        </div>
      </div>

      <div className="card mb-3">
        <div className="card-header">۶) نمادهای اعتماد / SSL / …</div>
        <div className="card-body">
          {cfg.badges.map((row, idx) => (
            <div key={`${idx}-${uploadKey}`} className="row g-2 mb-3 align-items-end border-bottom pb-3">
              <div className="col-md-5">
                <label className="form-label small">آدرس تصویر (src)</label>
                <input
                  className="form-control form-control-sm"
                  dir="ltr"
                  value={row.src}
                  onChange={(e) =>
                    setBadges((prev) => {
                      const n = [...prev];
                      n[idx] = { ...n[idx], src: e.target.value };
                      return n;
                    })
                  }
                />
              </div>
              <div className="col-md-3">
                <label className="form-label small">متن alt</label>
                <input
                  className="form-control form-control-sm"
                  value={row.alt}
                  onChange={(e) =>
                    setBadges((prev) => {
                      const n = [...prev];
                      n[idx] = { ...n[idx], alt: e.target.value };
                      return n;
                    })
                  }
                />
              </div>
              <div className="col-md-2">
                <label className="form-label small">آپلود</label>
                <input
                  type="file"
                  className="form-control form-control-sm"
                  accept="image/*"
                  onChange={(e) => void uploadBadge(idx, e.target.files?.[0])}
                />
              </div>
              <div className="col-md-2">
                {row.src ? (
                  <img src={row.src} alt="" style={{ maxHeight: 48, maxWidth: "100%" }} />
                ) : null}
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger w-100 mt-1"
                  onClick={() => setBadges((prev) => prev.filter((_, i) => i !== idx))}
                >
                  حذف
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={() =>
              setBadges((prev) => [...prev, { src: "", alt: "نماد" }])
            }
          >
            + نماد
          </button>
        </div>
      </div>

      <div className="card mb-3">
        <div className="card-header">کپی‌رایت (پایین)</div>
        <div className="card-body">
          <textarea
            className="form-control"
            rows={2}
            value={cfg.copyrightText}
            onChange={(e) => setCfg((c) => ({ ...c, copyrightText: e.target.value }))}
            maxLength={500}
          />
        </div>
      </div>

      <details className="mb-4">
        <summary className="small text-muted">پیش‌نمایش JSON</summary>
        <pre className="small bg-light p-2 rounded mt-2" dir="ltr" style={{ maxHeight: 200, overflow: "auto" }}>
          {jsonPreview}
        </pre>
      </details>

      <button type="button" className="btn btn-primary" disabled={loading} onClick={() => void save()}>
        {loading ? "در حال ذخیره…" : "ذخیرهٔ فوتر"}
      </button>
    </main>
  );
}

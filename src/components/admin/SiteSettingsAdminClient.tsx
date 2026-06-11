"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { SiteSettingsConfig } from "@/lib/siteSettings";

function cloneCfg(c: SiteSettingsConfig): SiteSettingsConfig {
  return { ...c };
}

type Props = {
  initialConfig: SiteSettingsConfig;
  defaultFaviconUrl: string;
};

export function SiteSettingsAdminClient({ initialConfig, defaultFaviconUrl }: Props) {
  const router = useRouter();
  const [cfg, setCfg] = useState(() => cloneCfg(initialConfig));
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadKey, setUploadKey] = useState(0);

  const previewUrl = cfg.faviconUrl ?? defaultFaviconUrl;

  async function save() {
    setError(null);
    setSaved(false);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/site-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config: cfg }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string; config?: SiteSettingsConfig };
      if (res.status === 401) {
        window.location.href = "/login";
        return;
      }
      if (!res.ok) {
        setError(data.error ?? "ذخیره نشد");
        return;
      }
      if (data.config) setCfg(cloneCfg(data.config));
      setSaved(true);
      router.refresh();
    } catch {
      setError("ارتباط با سرور برقرار نشد");
    } finally {
      setLoading(false);
    }
  }

  async function uploadFavicon(file: File | undefined) {
    if (!file) return;
    setError(null);
    setSaved(false);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("scope", "site");
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
      if (res.status === 401) {
        window.location.href = "/login";
        return;
      }
      if (!res.ok) {
        setError(data.error ?? "آپلود ناموفق");
        return;
      }
      if (data.url) {
        setCfg((c) => ({ ...c, faviconUrl: data.url! }));
        setUploadKey((k) => k + 1);
      }
    } catch {
      setError("آپلود ناموفق بود");
    } finally {
      setUploading(false);
    }
  }

  function resetFavicon() {
    setCfg((c) => ({ ...c, faviconUrl: null }));
    setSaved(false);
    setUploadKey((k) => k + 1);
  }

  return (
    <div className="row g-3">
      <div className="col-12 col-lg-8">
        {error ? (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        ) : null}
        {saved ? (
          <div className="alert alert-success" role="alert">
            تنظیمات ذخیره شد. Favicon در تب مرورگر پس از رفرش صفحهٔ عمومی دیده می‌شود.
          </div>
        ) : null}

        <div className="card mb-3">
          <div className="card-header">Favicon سایت</div>
          <div className="card-body">
            <p className="text-muted small mb-3">
              آیکون کوچکی که در تب مرورگر نمایش داده می‌شود. فرمت‌های PNG، WebP، GIF، JPG یا ICO
              مجازند. اندازهٔ پیشنهادی: ۳۲×۳۲ یا ۶۴×۶۴ پیکسل.
            </p>

            <div className="d-flex flex-wrap align-items-center gap-3 mb-3">
              <div
                className="border rounded d-flex align-items-center justify-content-center bg-white"
                style={{ width: 64, height: 64 }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="پیش‌نمایش favicon"
                  width={32}
                  height={32}
                  style={{ objectFit: "contain", maxWidth: 48, maxHeight: 48 }}
                />
              </div>
              <div className="small text-muted">
                {cfg.faviconUrl ? (
                  <>
                    <div>آدرس فعلی:</div>
                    <code dir="ltr" className="d-block">
                      {cfg.faviconUrl}
                    </code>
                  </>
                ) : (
                  <div>در حال استفاده از favicon پیش‌فرض پروژه</div>
                )}
              </div>
            </div>

            <div className="d-flex flex-wrap gap-2 align-items-center">
              <input
                key={uploadKey}
                type="file"
                accept="image/png,image/webp,image/gif,image/jpeg,image/x-icon,.ico"
                className="form-control form-control-sm"
                style={{ maxWidth: 320 }}
                disabled={uploading || loading}
                onChange={(e) => void uploadFavicon(e.target.files?.[0])}
              />
              {cfg.faviconUrl ? (
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                  disabled={uploading || loading}
                  onClick={resetFavicon}
                >
                  بازگشت به پیش‌فرض
                </button>
              ) : null}
            </div>
            {uploading ? <p className="small text-muted mt-2 mb-0">در حال آپلود…</p> : null}
          </div>
        </div>

        <div className="d-flex gap-2">
          <button type="button" className="btn btn-primary" disabled={loading || uploading} onClick={() => void save()}>
            {loading ? "در حال ذخیره…" : "ذخیره تنظیمات"}
          </button>
        </div>

        <p className="text-muted small mt-3 mb-0">
          جدول <code>site_settings_config</code> را از فایل{" "}
          <code>database/migration_site_settings.sql</code> بسازید.
        </p>
      </div>
    </div>
  );
}

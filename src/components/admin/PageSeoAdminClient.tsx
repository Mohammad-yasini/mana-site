"use client";

import { useMemo, useState } from "react";
import type { PageDef, PageSeo } from "@/lib/pageSeo";

type Props = {
  pages: PageDef[];
  initialSeo: Record<string, PageSeo>;
};

const TITLE_MAX = 60;
const DESC_MAX = 160;

export function PageSeoAdminClient({ pages, initialSeo }: Props) {
  const [seoMap, setSeoMap] = useState<Record<string, PageSeo>>(() =>
    JSON.parse(JSON.stringify(initialSeo)),
  );
  const [activeKey, setActiveKey] = useState<string>(pages[0]?.key ?? "");
  const [error, setError] = useState<string | null>(null);
  const [savedKey, setSavedKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const activeDef = useMemo(() => pages.find((p) => p.key === activeKey), [pages, activeKey]);
  const seo = seoMap[activeKey];

  function update(field: keyof PageSeo, value: string | boolean) {
    setSavedKey(null);
    setSeoMap((m) => ({ ...m, [activeKey]: { ...m[activeKey], [field]: value } }));
  }

  async function save() {
    if (!activeDef) return;
    setError(null);
    setSavedKey(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/page-seo", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageKey: activeKey, seo: seoMap[activeKey] }),
      });
      if (res.status === 401) {
        window.location.href = "/login";
        return;
      }
      const data = (await res.json().catch(() => ({}))) as { error?: string; seo?: PageSeo };
      if (!res.ok) {
        setError(data.error ?? "ذخیره نشد");
        return;
      }
      if (data.seo) setSeoMap((m) => ({ ...m, [activeKey]: data.seo as PageSeo }));
      setSavedKey(activeKey);
    } catch {
      setError("ارتباط با سرور برقرار نشد");
    } finally {
      setLoading(false);
    }
  }

  if (!activeDef || !seo) {
    return <p className="text-muted">برگه‌ای برای تنظیم سئو یافت نشد.</p>;
  }

  const titlePreview = seo.seoTitle.trim() || activeDef.fallbackTitle;
  const descPreview = seo.metaDescription.trim() || activeDef.fallbackDescription;

  return (
    <div className="row g-3">
      <div className="col-12 col-lg-3">
        <div className="card">
          <div className="card-header">برگه‌ها</div>
          <div className="list-group list-group-flush">
            {pages.map((p) => (
              <button
                key={p.key}
                type="button"
                onClick={() => {
                  setActiveKey(p.key);
                  setError(null);
                }}
                className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center${
                  p.key === activeKey ? " active" : ""
                }`}
              >
                <span>{p.label}</span>
                <code className="small" dir="ltr" style={{ opacity: 0.7 }}>
                  {p.path}
                </code>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="col-12 col-lg-9">
        {error ? (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        ) : null}
        {savedKey === activeKey ? (
          <div className="alert alert-success" role="alert">
            تنظیمات سئوی «{activeDef.label}» ذخیره شد.
          </div>
        ) : null}

        <div className="card mb-3">
          <div className="card-header d-flex justify-content-between align-items-center">
            <span>تنظیمات سئو: {activeDef.label}</span>
            <code className="small" dir="ltr">
              {activeDef.path}
            </code>
          </div>
          <div className="card-body">
            <div className="mb-3">
              <label className="form-label small d-flex justify-content-between">
                <span>عنوان سئو (Title)</span>
                <span className={seo.seoTitle.length > TITLE_MAX ? "text-danger" : "text-muted"}>
                  {seo.seoTitle.length}/{TITLE_MAX} پیشنهادی
                </span>
              </label>
              <input
                className="form-control"
                value={seo.seoTitle}
                placeholder={activeDef.fallbackTitle}
                maxLength={255}
                onChange={(e) => update("seoTitle", e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label small d-flex justify-content-between">
                <span>توضیحات متا (Meta Description)</span>
                <span className={seo.metaDescription.length > DESC_MAX ? "text-danger" : "text-muted"}>
                  {seo.metaDescription.length}/{DESC_MAX} پیشنهادی
                </span>
              </label>
              <textarea
                className="form-control"
                rows={3}
                value={seo.metaDescription}
                placeholder={activeDef.fallbackDescription}
                maxLength={500}
                onChange={(e) => update("metaDescription", e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label small">کلمات کلیدی (با ویرگول جدا کنید)</label>
              <input
                className="form-control"
                value={seo.metaKeywords}
                placeholder="دوربین مداربسته, تجهیزات امنیتی, نظارت تصویری"
                maxLength={500}
                onChange={(e) => update("metaKeywords", e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label small">آدرس کانونیکال (Canonical URL)</label>
              <input
                className="form-control"
                dir="ltr"
                value={seo.canonicalUrl}
                placeholder="خالی = آدرس پیش‌فرض برگه"
                maxLength={500}
                onChange={(e) => update("canonicalUrl", e.target.value)}
              />
            </div>

            <div className="form-check form-switch mb-1">
              <input
                className="form-check-input"
                type="checkbox"
                id="noindex"
                checked={seo.noIndex}
                onChange={(e) => update("noIndex", e.target.checked)}
              />
              <label className="form-check-label small" htmlFor="noindex">
                عدم نمایه‌سازی در موتورهای جستجو (noindex)
              </label>
            </div>
          </div>
        </div>

        <div className="card mb-3">
          <div className="card-header">اشتراک‌گذاری در شبکه‌های اجتماعی (Open Graph)</div>
          <div className="card-body">
            <div className="mb-3">
              <label className="form-label small">عنوان OG</label>
              <input
                className="form-control"
                value={seo.ogTitle}
                placeholder="خالی = همان عنوان سئو"
                maxLength={255}
                onChange={(e) => update("ogTitle", e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label small">توضیحات OG</label>
              <textarea
                className="form-control"
                rows={2}
                value={seo.ogDescription}
                placeholder="خالی = همان توضیحات متا"
                maxLength={500}
                onChange={(e) => update("ogDescription", e.target.value)}
              />
            </div>
            <div className="mb-1">
              <label className="form-label small">تصویر OG (آدرس تصویر)</label>
              <input
                className="form-control"
                dir="ltr"
                value={seo.ogImage}
                placeholder="/assets/images/img/og.png"
                maxLength={500}
                onChange={(e) => update("ogImage", e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="card mb-3">
          <div className="card-header">پیش‌نمایش نتیجهٔ گوگل</div>
          <div className="card-body">
            <div style={{ maxWidth: 600 }}>
              <div style={{ color: "#1a0dab", fontSize: 18, lineHeight: 1.3 }}>{titlePreview}</div>
              <div style={{ color: "#006621", fontSize: 13, direction: "ltr" }}>
                {BASEHOST}
                {activeDef.path}
              </div>
              <div style={{ color: "#545454", fontSize: 13, lineHeight: 1.5 }}>{descPreview}</div>
            </div>
          </div>
        </div>

        <button type="button" className="btn btn-primary" disabled={loading} onClick={() => void save()}>
          {loading ? "در حال ذخیره…" : "ذخیرهٔ سئوی برگه"}
        </button>
      </div>
    </div>
  );
}

const BASEHOST = "manaelectronic.com";

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { RichPostEditor } from "@/components/blog/RichPostEditor";
import type { PageContentDef, PageContentRecord } from "@/lib/pageContent";

type Props = {
  pages: PageContentDef[];
  initialRecords: Record<string, PageContentRecord>;
  initialEditorHtml: Record<string, string>;
  defaultHtml: Record<string, string>;
};

export function PageContentAdminClient({
  pages,
  initialRecords,
  initialEditorHtml,
  defaultHtml,
}: Props) {
  const router = useRouter();
  const [records, setRecords] = useState(initialRecords);
  const [editorMap, setEditorMap] = useState(initialEditorHtml);
  const [activeKey, setActiveKey] = useState(pages[0]?.key ?? "");
  const [useDefault, setUseDefault] = useState(() => !initialRecords[pages[0]?.key ?? ""]?.isCustom);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const activeDef = useMemo(() => pages.find((p) => p.key === activeKey), [pages, activeKey]);
  const body = editorMap[activeKey] ?? "";

  function selectPage(key: string) {
    setActiveKey(key);
    setUseDefault(!records[key]?.isCustom);
    setError(null);
    setSaved(false);
  }

  function resetToTemplate() {
    if (!activeDef) return;
    setUseDefault(true);
    setEditorMap((m) => ({ ...m, [activeKey]: defaultHtml[activeKey] ?? "" }));
    setSaved(false);
  }

  async function save() {
    if (!activeDef) return;
    setError(null);
    setSaved(false);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/page-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageKey: activeKey,
          bodyHtml: editorMap[activeKey] ?? "",
          useDefault,
        }),
      });
      if (res.status === 401) {
        window.location.href = "/login";
        return;
      }
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        record?: PageContentRecord;
      };
      if (!res.ok) {
        setError(data.error ?? "ذخیره نشد");
        return;
      }
      if (data.record) {
        setRecords((r) => ({ ...r, [activeKey]: data.record! }));
        setUseDefault(!data.record.isCustom);
      }
      setSaved(true);
      router.refresh();
    } catch {
      setError("ارتباط با سرور برقرار نشد");
    } finally {
      setLoading(false);
    }
  }

  if (!activeDef) {
    return <p className="text-muted">برگه‌ای برای ویرایش یافت نشد.</p>;
  }

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
                onClick={() => selectPage(p.key)}
                className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center${
                  p.key === activeKey ? " active" : ""
                }`}
              >
                <span>{p.label}</span>
                {records[p.key]?.isCustom ? (
                  <span className="badge text-bg-success">سفارشی</span>
                ) : (
                  <span className="badge text-bg-secondary">پیش‌فرض</span>
                )}
              </button>
            ))}
          </div>
        </div>
        <p className="text-muted small mt-2 mb-0">
          برندها، وبلاگ و اعطای نمایندگی از بخش‌های دیگر مدیریت می‌شوند.
        </p>
      </div>

      <div className="col-12 col-lg-9">
        {error ? (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        ) : null}
        {saved ? (
          <div className="alert alert-success" role="alert">
            محتوای «{activeDef.label}» ذخیره شد.
          </div>
        ) : null}

        <div className="card mb-3">
          <div className="card-header d-flex flex-wrap justify-content-between align-items-center gap-2">
            <span>ویرایش: {activeDef.label}</span>
            <div className="d-flex flex-wrap gap-2">
              <a
                href={activeDef.path}
                target="_blank"
                rel="noreferrer"
                className="btn btn-sm btn-outline-secondary"
              >
                مشاهدهٔ زنده
              </a>
              <Link href="/dashboard/seo" className="btn btn-sm btn-outline-secondary">
                تنظیمات سئو
              </Link>
            </div>
          </div>
          <div className="card-body">
            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="use-default"
                checked={useDefault}
                onChange={(e) => {
                  setUseDefault(e.target.checked);
                  setSaved(false);
                  if (e.target.checked) {
                    setEditorMap((m) => ({
                      ...m,
                      [activeKey]: defaultHtml[activeKey] ?? "",
                    }));
                  }
                }}
              />
              <label className="form-check-label" htmlFor="use-default">
                استفاده از محتوای پیش‌فرض قالب (ذخیره = بازگشت به قالب)
              </label>
            </div>

            <RichPostEditor
              value={body}
              onChange={(html) => {
                setEditorMap((m) => ({ ...m, [activeKey]: html }));
                setUseDefault(false);
                setSaved(false);
              }}
            />

            <div className="d-flex flex-wrap gap-2 mt-3">
              <button
                type="button"
                className="btn btn-primary"
                disabled={loading}
                onClick={() => void save()}
              >
                {loading ? "در حال ذخیره…" : "ذخیرهٔ محتوا"}
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary"
                disabled={loading}
                onClick={resetToTemplate}
              >
                بارگذاری مجدد از قالب
              </button>
            </div>
          </div>
        </div>

        <p className="text-muted small mb-0">
          جدول <code>page_content</code> را از فایل{" "}
          <code>database/migration_page_content.sql</code> بسازید.
        </p>
      </div>
    </div>
  );
}

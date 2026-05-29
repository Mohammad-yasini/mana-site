"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { DEFAULT_ROBOTS_TXT, SITE_BASE_URL } from "@/lib/robotsDefaults";

type Props = { initialContent: string };

export function RobotsAdminClient({ initialContent }: Props) {
  const router = useRouter();
  const [content, setContent] = useState(initialContent);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  async function save() {
    setError(null);
    setSaved(false);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/robots", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string; content?: string };
      if (res.status === 401) {
        window.location.href = "/login";
        return;
      }
      if (!res.ok) {
        setError(data.error ?? "ذخیره نشد");
        return;
      }
      if (data.content) setContent(data.content);
      setSaved(true);
      router.refresh();
    } catch {
      setError("ارتباط با سرور برقرار نشد");
    } finally {
      setLoading(false);
    }
  }

  function resetDefault() {
    setContent(DEFAULT_ROBOTS_TXT);
    setSaved(false);
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
            فایل robots.txt ذخیره شد.
          </div>
        ) : null}

        <div className="card mb-3">
          <div className="card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
            <span>ویرایش robots.txt</span>
            <a href="/robots.txt" target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-secondary">
              مشاهدهٔ زنده
            </a>
          </div>
          <div className="card-body">
            <textarea
              className="form-control font-monospace small"
              dir="ltr"
              rows={16}
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                setSaved(false);
              }}
              spellCheck={false}
            />
            <p className="text-muted small mt-2 mb-0">
              هر خط یک دستور است. معمولاً <code>User-agent</code>، <code>Allow</code>،{" "}
              <code>Disallow</code>، <code>Sitemap</code> و <code>Host</code> استفاده می‌شود.
            </p>
          </div>
        </div>

        <div className="d-flex flex-wrap gap-2">
          <button type="button" className="btn btn-primary" disabled={loading} onClick={() => void save()}>
            {loading ? "در حال ذخیره…" : "ذخیرهٔ robots.txt"}
          </button>
          <button type="button" className="btn btn-outline-secondary" disabled={loading} onClick={resetDefault}>
            بازگردانی پیش‌فرض
          </button>
        </div>
      </div>

      <div className="col-12 col-lg-4">
        <div className="card">
          <div className="card-header">راهنما</div>
          <div className="card-body small text-muted">
            <p>
              <strong>Sitemap</strong> به‌صورت خودکار و داینامیک در آدرس زیر ساخته می‌شود:
            </p>
            <p>
              <a href="/sitemap.xml" target="_blank" rel="noreferrer" dir="ltr">
                {SITE_BASE_URL}/sitemap.xml
              </a>
            </p>
            <p className="mb-1">شامل:</p>
            <ul className="mb-0">
              <li>برگه‌های ثابت (به‌جز noindex)</li>
              <li>دسته‌های وبلاگ</li>
              <li>برندها و محصولات منتشرشده</li>
              <li>نوشته‌های منتشرشده</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

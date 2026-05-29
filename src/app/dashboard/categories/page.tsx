"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type Category = {
  id: number;
  name: string;
  slug: string;
  seo_title: string | null;
  meta_description: string | null;
};

export default function DashboardCategoriesPage() {
  const [list, setList] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const [editing, setEditing] = useState<Category | null>(null);
  const [editName, setEditName] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [editSeoTitle, setEditSeoTitle] = useState("");
  const [editMeta, setEditMeta] = useState("");

  const load = useCallback(async () => {
    setError(null);
    try {
      const res = await fetch("/api/admin/categories");
      const data = (await res.json().catch(() => ({}))) as {
        categories?: Category[];
        error?: string;
      };
      if (res.status === 401) {
        window.location.href = "/login";
        return;
      }
      if (!res.ok) {
        setError(data.error ?? "خطا در بارگذاری");
        return;
      }
      setList(data.categories ?? []);
    } catch {
      setError("ارتباط با سرور برقرار نشد");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          slug: slug.trim() || undefined,
          seo_title: seoTitle.trim() || null,
          meta_description: metaDescription.trim() || null,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "ذخیره نشد");
        return;
      }
      setName("");
      setSlug("");
      setSeoTitle("");
      setMetaDescription("");
      await load();
    } catch {
      setError("ذخیره نشد");
    } finally {
      setSaving(false);
    }
  }

  function openEdit(c: Category) {
    setEditing(c);
    setEditName(c.name);
    setEditSlug(c.slug);
    setEditSeoTitle(c.seo_title ?? "");
    setEditMeta(c.meta_description ?? "");
  }

  async function saveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/categories/${editing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          slug: editSlug,
          seo_title: editSeoTitle,
          meta_description: editMeta,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "به‌روزرسانی نشد");
        return;
      }
      setEditing(null);
      await load();
    } catch {
      setError("به‌روزرسانی نشد");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: number) {
    if (!window.confirm("این دسته حذف شود؟ نوشته‌ها بدون دسته می‌مانند.")) return;
    setError(null);
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "حذف نشد");
        return;
      }
      await load();
    } catch {
      setError("حذف نشد");
    }
  }

  return (
    <main className="container-sm" style={{ padding: "48px 0" }}>
      <h1 className="h4 mb-4">دسته‌های وبلاگ</h1>
      <p className="text-muted small mb-4">
        آدرس عمومی هر دسته:{" "}
        <code dir="ltr">/blog-category/اسلاگ</code> — مثال:{" "}
        <code dir="ltr">/blog-category/buy</code>
      </p>

      {error ? (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      ) : null}

      <section className="card mb-4">
        <div className="card-header">دستهٔ جدید</div>
        <div className="card-body">
          <form onSubmit={handleCreate} className="row g-3">
            <div className="col-md-6">
              <label className="form-label">نام</label>
              <input
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={255}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">اسلاگ (اختیاری)</label>
              <input
                className="form-control"
                dir="ltr"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                maxLength={191}
              />
            </div>
            <div className="col-12">
              <label className="form-label">عنوان سئو</label>
              <input
                className="form-control"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                maxLength={255}
              />
            </div>
            <div className="col-12">
              <label className="form-label">توضیحات متا</label>
              <textarea
                className="form-control"
                rows={2}
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                maxLength={500}
              />
            </div>
            <div className="col-12">
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? "…" : "افزودن دسته"}
              </button>
            </div>
          </form>
        </div>
      </section>

      {loading ? (
        <p className="text-muted">در حال بارگذاری…</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th>#</th>
                <th>نام</th>
                <th>اسلاگ</th>
                <th>صفحهٔ عمومی</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {list.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.name}</td>
                  <td dir="ltr">{c.slug}</td>
                  <td>
                    <a href={`/blog-category/${encodeURIComponent(c.slug)}`} target="_blank" rel="noreferrer">
                      مشاهده
                    </a>
                  </td>
                  <td className="text-nowrap">
                    <button type="button" className="btn btn-sm btn-outline-primary me-1" onClick={() => openEdit(c)}>
                      ویرایش
                    </button>
                    <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => void remove(c.id)}>
                      حذف
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing ? (
        <div className="modal d-block" tabIndex={-1} style={{ background: "rgba(0,0,0,.35)" }}>
          <div className="modal-dialog modal-lg modal-dialog-scrollable">
            <div className="modal-content">
              <form onSubmit={saveEdit}>
                <div className="modal-header">
                  <h2 className="modal-title h5">ویرایش دسته</h2>
                  <button type="button" className="btn-close" aria-label="بستن" onClick={() => setEditing(null)} />
                </div>
                <div className="modal-body row g-3">
                  <div className="col-md-6">
                    <label className="form-label">نام</label>
                    <input
                      className="form-control"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">اسلاگ</label>
                    <input className="form-control" dir="ltr" value={editSlug} onChange={(e) => setEditSlug(e.target.value)} required />
                  </div>
                  <div className="col-12">
                    <label className="form-label">عنوان سئو</label>
                    <input className="form-control" value={editSeoTitle} onChange={(e) => setEditSeoTitle(e.target.value)} maxLength={255} />
                  </div>
                  <div className="col-12">
                    <label className="form-label">توضیحات متا</label>
                    <textarea className="form-control" rows={3} value={editMeta} onChange={(e) => setEditMeta(e.target.value)} maxLength={500} />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setEditing(null)}>
                    انصراف
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    ذخیره
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : null}

      <p className="mt-4">
        <Link href="/dashboard">← داشبورد</Link>
      </p>
    </main>
  );
}

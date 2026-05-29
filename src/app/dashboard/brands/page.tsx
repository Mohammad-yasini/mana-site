"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type Brand = {
  id: number;
  name: string;
  name_en: string | null;
  slug: string;
  logo: string | null;
  description: string | null;
  product_count?: number;
};

const EMPTY = { name: "", name_en: "", slug: "", logo: "", description: "" };

export default function DashboardBrandsPage() {
  const [list, setList] = useState<Brand[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ ...EMPTY });

  const load = useCallback(async () => {
    setError(null);
    try {
      const res = await fetch("/api/admin/brands");
      const data = (await res.json().catch(() => ({}))) as { brands?: Brand[]; error?: string };
      if (res.status === 401) {
        window.location.href = "/login";
        return;
      }
      if (!res.ok) {
        setError(data.error ?? "خطا در دریافت");
        return;
      }
      setList(data.brands ?? []);
    } catch {
      setError("ارتباط با سرور برقرار نشد");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function resetForm() {
    setEditingId(null);
    setForm({ ...EMPTY });
  }

  function startEdit(b: Brand) {
    setEditingId(b.id);
    setForm({
      name: b.name,
      name_en: b.name_en ?? "",
      slug: b.slug,
      logo: b.logo ?? "",
      description: b.description ?? "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function onLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
      if (!res.ok) {
        setError(data.error ?? "آپلود ناموفق");
        return;
      }
      if (data.url) setForm((f) => ({ ...f, logo: data.url! }));
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.name.trim()) {
      setError("نام برند الزامی است");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        name_en: form.name_en.trim() || null,
        slug: form.slug.trim() || null,
        logo: form.logo.trim() || null,
        description: form.description.trim() || null,
      };
      const url = editingId ? `/api/admin/brands/${editingId}` : "/api/admin/brands";
      const method = editingId ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
      resetForm();
      await load();
    } catch {
      setError("ارتباط با سرور برقرار نشد");
    } finally {
      setSaving(false);
    }
  }

  async function remove(b: Brand) {
    if (!confirm(`برند «${b.name}» حذف شود؟ (محصولات آن بدون برند می‌شوند)`)) return;
    const res = await fetch(`/api/admin/brands/${b.id}`, { method: "DELETE" });
    if (res.ok) {
      if (editingId === b.id) resetForm();
      await load();
    }
  }

  return (
    <main className="container-sm" style={{ padding: "32px 0", maxWidth: 960 }}>
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
        <h1 className="h4 m-0">مدیریت برندها</h1>
        <Link href="/dashboard/products/new" className="btn btn-outline-primary btn-sm">
          + محصول جدید
        </Link>
      </div>

      {error ? (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      ) : null}

      <form onSubmit={save} className="card mb-4">
        <div className="card-header">{editingId ? "ویرایش برند" : "افزودن برند"}</div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">نام برند *</label>
              <input
                className="form-control"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                maxLength={150}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">نام انگلیسی</label>
              <input
                className="form-control"
                dir="ltr"
                value={form.name_en}
                onChange={(e) => setForm((f) => ({ ...f, name_en: e.target.value }))}
                maxLength={150}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">اسلاگ (آدرس)</label>
              <input
                className="form-control"
                dir="ltr"
                placeholder="مثلاً dehu"
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                maxLength={191}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">لوگو</label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={onLogoChange}
                disabled={uploading}
              />
              {uploading ? <p className="small text-muted mt-1">در حال آپلود…</p> : null}
              {form.logo ? (
                <div className="mt-2 d-flex align-items-center gap-2">
                  <img src={form.logo} alt="" style={{ maxHeight: 48 }} />
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => setForm((f) => ({ ...f, logo: "" }))}
                  >
                    حذف لوگو
                  </button>
                </div>
              ) : null}
            </div>
            <div className="col-12">
              <label className="form-label">توضیحات</label>
              <textarea
                className="form-control"
                rows={3}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>
          </div>

          <div className="d-flex gap-2 mt-3">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "در حال ذخیره…" : editingId ? "ذخیره تغییرات" : "افزودن برند"}
            </button>
            {editingId ? (
              <button type="button" className="btn btn-outline-secondary" onClick={resetForm}>
                انصراف
              </button>
            ) : null}
          </div>
        </div>
      </form>

      {loading ? (
        <p>در حال بارگذاری…</p>
      ) : list.length === 0 ? (
        <p className="text-muted">هنوز برندی ثبت نشده است.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered align-middle">
            <thead className="table-light">
              <tr>
                <th>لوگو</th>
                <th>نام</th>
                <th>اسلاگ</th>
                <th>محصولات</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {list.map((b) => (
                <tr key={b.id}>
                  <td style={{ width: 70 }}>
                    {b.logo ? <img src={b.logo} alt="" style={{ maxHeight: 36 }} /> : "—"}
                  </td>
                  <td>
                    {b.name}
                    {b.name_en ? <div className="text-muted small dirLTR">{b.name_en}</div> : null}
                  </td>
                  <td className="dirLTR small">{b.slug}</td>
                  <td>{b.product_count ?? 0}</td>
                  <td className="text-nowrap">
                    <a
                      href={`/brand/${encodeURIComponent(b.slug)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-sm btn-outline-secondary"
                    >
                      نمایش
                    </a>{" "}
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => startEdit(b)}
                    >
                      ویرایش
                    </button>{" "}
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => void remove(b)}
                    >
                      حذف
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-3">
        <Link href="/dashboard/products">مدیریت محصولات ←</Link>
      </p>
    </main>
  );
}

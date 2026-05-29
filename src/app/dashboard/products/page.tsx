"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type Product = {
  id: number;
  name: string;
  slug: string;
  published: number;
  created_at: string | null;
  cover_image: string | null;
  price: string | null;
  brand_id: number | null;
  brand_name: string | null;
};

export default function DashboardProductsPage() {
  const [list, setList] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setError(null);
    try {
      const res = await fetch("/api/admin/products");
      const data = (await res.json().catch(() => ({}))) as {
        products?: Product[];
        error?: string;
      };
      if (res.status === 401) {
        window.location.href = "/login";
        return;
      }
      if (!res.ok) {
        setError(data.error ?? "خطا در دریافت");
        return;
      }
      setList(data.products ?? []);
    } catch {
      setError("ارتباط با سرور برقرار نشد");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function remove(p: Product) {
    if (!confirm(`محصول «${p.name}» حذف شود؟`)) return;
    const res = await fetch(`/api/admin/products/${p.id}`, { method: "DELETE" });
    if (res.ok) await load();
  }

  return (
    <main className="container-sm" style={{ padding: "32px 0" }}>
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <h1 className="h4 m-0">محصولات</h1>
        <div className="d-flex gap-2">
          <Link href="/dashboard/brands" className="btn btn-outline-secondary">
            مدیریت برندها
          </Link>
          <Link href="/dashboard/products/new" className="btn btn-primary">
            محصول جدید
          </Link>
        </div>
      </div>

      {error ? (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      ) : null}

      {loading ? (
        <p>در حال بارگذاری…</p>
      ) : list.length === 0 ? (
        <p className="text-muted">هنوز محصولی ثبت نشده. «محصول جدید» را بزنید.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th>تصویر</th>
                <th>نام</th>
                <th>برند</th>
                <th>قیمت</th>
                <th>وضعیت</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {list.map((p) => (
                <tr key={p.id}>
                  <td style={{ width: 70 }}>
                    {p.cover_image ? (
                      <img src={p.cover_image} alt="" style={{ maxHeight: 40 }} />
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>{p.name}</td>
                  <td>{p.brand_name ?? "—"}</td>
                  <td>{p.price ?? "—"}</td>
                  <td>{p.published === 1 ? "منتشر شده" : "پیش‌نویس"}</td>
                  <td className="text-nowrap">
                    <a
                      href={`/product/${encodeURIComponent(p.slug)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-sm btn-outline-secondary"
                    >
                      نمایش
                    </a>{" "}
                    <Link
                      href={`/dashboard/products/${p.id}/edit`}
                      className="btn btn-sm btn-outline-primary"
                    >
                      ویرایش
                    </Link>{" "}
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => void remove(p)}
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

      <p className="mt-4">
        <Link href="/dashboard">← بازگشت به داشبورد</Link>
      </p>
    </main>
  );
}

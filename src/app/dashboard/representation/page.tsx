"use client";

import { useCallback, useEffect, useState } from "react";

type RepRequest = {
  id: number;
  full_name: string;
  company_name: string | null;
  phone: string;
  email: string | null;
  city: string | null;
  activity_field: string | null;
  message: string | null;
  status: string;
  created_at: string;
};

const STATUS_LABEL: Record<string, string> = {
  new: "جدید",
  reviewed: "بررسی‌شده",
  done: "انجام‌شده",
  rejected: "رد‌شده",
};

const STATUS_OPTIONS = ["new", "reviewed", "done", "rejected"];

export default function DashboardRepresentationPage() {
  const [list, setList] = useState<RepRequest[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setError(null);
    try {
      const res = await fetch("/api/admin/representation");
      const data = (await res.json().catch(() => ({}))) as {
        requests?: RepRequest[];
        error?: string;
      };
      if (res.status === 401) {
        window.location.href = "/login";
        return;
      }
      if (!res.ok) {
        setError(data.error ?? "خطا در دریافت اطلاعات");
        return;
      }
      setList(data.requests ?? []);
    } catch {
      setError("ارتباط با سرور برقرار نشد");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function changeStatus(id: number, status: string) {
    setList((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    await fetch(`/api/admin/representation/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  }

  async function remove(id: number) {
    if (!confirm("این درخواست حذف شود؟")) return;
    const res = await fetch(`/api/admin/representation/${id}`, { method: "DELETE" });
    if (res.ok) {
      setList((prev) => prev.filter((r) => r.id !== id));
    }
  }

  return (
    <main className="container-sm" style={{ padding: "32px 0" }}>
      <h1 className="h4 mb-3">درخواست‌های اعطای نمایندگی</h1>

      {error ? (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      ) : null}

      {loading ? (
        <p>در حال بارگذاری…</p>
      ) : list.length === 0 ? (
        <p className="text-muted">هنوز درخواستی ثبت نشده است.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered align-middle small">
            <thead className="table-light">
              <tr>
                <th>نام</th>
                <th>تماس</th>
                <th>شرکت / شهر</th>
                <th>زمینه فعالیت</th>
                <th>توضیحات</th>
                <th>تاریخ</th>
                <th>وضعیت</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {list.map((r) => (
                <tr key={r.id}>
                  <td>{r.full_name}</td>
                  <td dir="ltr" style={{ whiteSpace: "nowrap" }}>
                    {r.phone}
                    {r.email ? (
                      <>
                        <br />
                        {r.email}
                      </>
                    ) : null}
                  </td>
                  <td>
                    {r.company_name ?? "—"}
                    {r.city ? <div className="text-muted">{r.city}</div> : null}
                  </td>
                  <td>{r.activity_field ?? "—"}</td>
                  <td style={{ maxWidth: 260, whiteSpace: "pre-wrap" }}>
                    {r.message ?? "—"}
                  </td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    {new Date(r.created_at).toLocaleDateString("fa-IR")}
                  </td>
                  <td>
                    <select
                      className="form-select form-select-sm"
                      value={r.status}
                      onChange={(e) => void changeStatus(r.id, e.target.value)}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {STATUS_LABEL[s] ?? s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => void remove(r.id)}
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
    </main>
  );
}

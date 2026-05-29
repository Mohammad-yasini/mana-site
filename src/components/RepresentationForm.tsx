"use client";

import { useState } from "react";

type FormState = {
  full_name: string;
  company_name: string;
  phone: string;
  email: string;
  city: string;
  activity_field: string;
  message: string;
};

const EMPTY: FormState = {
  full_name: "",
  company_name: "",
  phone: "",
  email: "",
  city: "",
  activity_field: "",
  message: "",
};

export function RepresentationForm() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  function update(key: keyof FormState, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/representation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "ثبت درخواست ناموفق بود");
        return;
      }
      setSuccess(true);
      setForm(EMPTY);
    } catch {
      setError("ارتباط با سرور برقرار نشد");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="contact-card" style={{ textAlign: "center" }}>
        <h2 className="services-title">درخواست شما ثبت شد</h2>
        <p className="services-subtitle">
          کارشناسان مانا الکترونیک پس از بررسی با شما تماس می‌گیرند. سپاسگزاریم.
        </p>
        <button
          type="button"
          className="services-btn services-btn--ghost"
          onClick={() => setSuccess(false)}
        >
          ثبت درخواست جدید
        </button>
      </div>
    );
  }

  return (
    <div className="contact-card contact-card--form">
      <h2 className="services-title">فرم درخواست نمایندگی</h2>
      <p className="services-subtitle">
        اطلاعات زیر را تکمیل کنید تا شرایط همکاری و اعطای نمایندگی برای شما ارسال شود.
      </p>

      {error ? (
        <div className="alert alert-danger" role="alert" style={{ marginBottom: 16 }}>
          {error}
        </div>
      ) : null}

      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="contact-row">
          <div className="contact-field">
            <label>نام و نام خانوادگی *</label>
            <input
              type="text"
              placeholder="مثلاً: علی رضایی"
              value={form.full_name}
              onChange={(e) => update("full_name", e.target.value)}
              required
            />
          </div>
          <div className="contact-field">
            <label>شماره تماس *</label>
            <input
              type="tel"
              placeholder="مثلاً: 09120000000"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              required
            />
          </div>
        </div>

        <div className="contact-row">
          <div className="contact-field">
            <label>نام شرکت / فروشگاه</label>
            <input
              type="text"
              placeholder="اختیاری"
              value={form.company_name}
              onChange={(e) => update("company_name", e.target.value)}
            />
          </div>
          <div className="contact-field">
            <label>ایمیل</label>
            <input
              type="email"
              placeholder="اختیاری"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
            />
          </div>
        </div>

        <div className="contact-row">
          <div className="contact-field">
            <label>شهر / استان</label>
            <input
              type="text"
              placeholder="مثلاً: تهران"
              value={form.city}
              onChange={(e) => update("city", e.target.value)}
            />
          </div>
          <div className="contact-field">
            <label>زمینه فعالیت</label>
            <input
              type="text"
              placeholder="مثلاً: فروش و نصب دوربین مداربسته"
              value={form.activity_field}
              onChange={(e) => update("activity_field", e.target.value)}
            />
          </div>
        </div>

        <div className="contact-row">
          <div className="contact-field contact-field--full">
            <label>توضیحات</label>
            <textarea
              rows={5}
              placeholder="سابقه فعالیت، محدوده جغرافیایی، و هر توضیح دیگری..."
              value={form.message}
              onChange={(e) => update("message", e.target.value)}
            />
          </div>
        </div>

        <div className="contact-actions">
          <button
            type="submit"
            className="services-btn services-btn--primary"
            disabled={loading}
          >
            {loading ? "در حال ارسال…" : "ثبت درخواست نمایندگی"}
          </button>
          <a href="/contact" className="services-btn services-btn--ghost">
            راه‌های ارتباطی
          </a>
        </div>
      </form>
    </div>
  );
}

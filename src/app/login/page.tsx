"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "ورود ناموفق");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("ارتباط با سرور برقرار نشد");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container-sm" style={{ padding: "48px 0", maxWidth: 420 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>ورود مدیر</h1>
      <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
        {error ? (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        ) : null}
        <div>
          <label htmlFor="email" className="form-label">
            ایمیل
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="form-control"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="form-label">
            رمز عبور
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className="form-control"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary mt-2" disabled={loading}>
          {loading ? "در حال ورود…" : "ورود"}
        </button>
      </form>
    </main>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  postId: number;
  title: string;
  /** بعد از حذف به لیست برود (مثلاً از صفحهٔ ویرایش) */
  redirectToList?: boolean;
};

export function DeletePostButton({ postId, title, redirectToList }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onDelete() {
    const ok = window.confirm(
      `نوشته «${title}» حذف شود؟\nاین کار قابل بازگشت نیست.`,
    );
    if (!ok) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/posts/${postId}`, { method: "DELETE" });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (res.status === 401) {
        window.location.href = "/login";
        return;
      }
      if (!res.ok) {
        window.alert(data.error ?? "حذف انجام نشد");
        return;
      }
      if (redirectToList) {
        router.push("/dashboard/posts");
      } else {
        router.refresh();
      }
    } catch {
      window.alert("ارتباط با سرور برقرار نشد");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      className="btn btn-sm btn-outline-danger ms-1"
      disabled={loading}
      onClick={() => void onDelete()}
    >
      {loading ? "…" : "حذف"}
    </button>
  );
}

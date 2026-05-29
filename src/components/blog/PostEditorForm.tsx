"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DeletePostButton } from "@/components/blog/DeletePostButton";
import { RichPostEditor } from "@/components/blog/RichPostEditor";

export type PostEditorInitial = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image: string | null;
  category_id: number | null;
  seo_title: string | null;
  seo_meta_description: string | null;
  body: string;
  published: boolean;
};

type CategoryRow = {
  id: number;
  name: string;
  slug: string;
};

type Props =
  | { variant: "create" }
  | { variant: "edit"; initial: PostEditorInitial };

export function PostEditorForm(props: Props) {
  const router = useRouter();
  const isEdit = props.variant === "edit";
  const initial = isEdit ? props.initial : null;

  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [coverImage, setCoverImage] = useState<string | null>(initial?.cover_image ?? null);
  const [categoryId, setCategoryId] = useState<string>(
    initial?.category_id != null ? String(initial.category_id) : "",
  );
  const [seoTitle, setSeoTitle] = useState(initial?.seo_title ?? "");
  const [seoMetaDescription, setSeoMetaDescription] = useState(initial?.seo_meta_description ?? "");
  const [body, setBody] = useState(initial?.body ?? "");
  const [published, setPublished] = useState(initial?.published ?? false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/admin/categories");
        if (!res.ok) return;
        const data = (await res.json()) as { categories?: CategoryRow[] };
        if (!cancelled && data.categories) setCategories(data.categories);
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function onCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = (await res.json().catch(() => ({}))) as { error?: string; url?: string };
      if (!res.ok) {
        setError(data.error ?? "آپلود ناموفق");
        return;
      }
      if (data.url) setCoverImage(data.url);
    } catch {
      setError("آپلود ناموفق");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const textOnly = body.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
    if (!textOnly) {
      setError("متن نوشته را در ویرایشگر پر کنید.");
      return;
    }
    setLoading(true);
    try {
      const payload: Record<string, unknown> = {
        title,
        body,
        excerpt: excerpt.trim() ? excerpt : null,
        slug: slug.trim() || null,
        published,
        cover_image: coverImage,
        category_id: categoryId ? Number(categoryId) : null,
        seo_title: seoTitle.trim() || null,
        seo_meta_description: seoMetaDescription.trim() || null,
      };

      const url = isEdit ? `/api/admin/posts/${initial!.id}` : "/api/admin/posts";
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      if (!res.ok) {
        setError(data.error ?? "ذخیره نشد");
        return;
      }
      router.push("/dashboard/posts");
      router.refresh();
    } catch {
      setError("ارتباط با سرور برقرار نشد");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container-sm" style={{ padding: "48px 0", maxWidth: 880 }}>
      <h1 className="h4 mb-4">{isEdit ? "ویرایش نوشته" : "نوشتهٔ جدید"}</h1>

      <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
        {error ? (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        ) : null}

        <div>
          <label className="form-label" htmlFor="title">
            عنوان
          </label>
          <input
            id="title"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={255}
          />
        </div>

        <div>
          <label className="form-label" htmlFor="slug">
            اسلاگ
          </label>
          <input
            id="slug"
            className="form-control"
            dir="ltr"
            placeholder="مثلاً my-first-post"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            maxLength={191}
          />
          {isEdit ? (
            <p className="form-text small">تغییر اسلاگ، آدرس عمومی نوشته در سایت را عوض می‌کند.</p>
          ) : null}
        </div>

        <div>
          <label className="form-label" htmlFor="category_id">
            دسته‌بندی
          </label>
          <select
            id="category_id"
            className="form-select"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">— بدون دسته —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <p className="form-text small">
            <Link href="/dashboard/categories">مدیریت دسته‌ها</Link>
          </p>
        </div>

        <div>
          <label className="form-label" htmlFor="cover">
            تصویر کاور
          </label>
          <input
            id="cover"
            type="file"
            className="form-control"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={onCoverChange}
            disabled={uploading}
          />
          {uploading ? <p className="small text-muted mt-1">در حال آپلود…</p> : null}
          {coverImage ? (
            <div className="mt-2">
              <img src={coverImage} alt="" className="img-thumbnail" style={{ maxHeight: 160 }} />
              <button
                type="button"
                className="btn btn-sm btn-outline-danger ms-2"
                onClick={() => setCoverImage(null)}
              >
                حذف تصویر
              </button>
            </div>
          ) : null}
        </div>

        <div>
          <label className="form-label" htmlFor="excerpt">
            خلاصه (اختیاری)
          </label>
          <input
            id="excerpt"
            className="form-control"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            maxLength={500}
          />
        </div>

        <div>
          <label className="form-label" htmlFor="seo_title">
            عنوان سئو (meta title)
          </label>
          <input
            id="seo_title"
            className="form-control"
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            maxLength={255}
            placeholder="اگر خالی باشد از عنوان نوشته استفاده می‌شود"
          />
        </div>

        <div>
          <label className="form-label" htmlFor="seo_meta_description">
            توضیحات متا (meta description)
          </label>
          <textarea
            id="seo_meta_description"
            className="form-control"
            rows={3}
            value={seoMetaDescription}
            onChange={(e) => setSeoMetaDescription(e.target.value)}
            maxLength={500}
          />
        </div>

        <div>
          <label className="form-label">متن نوشته</label>
          <RichPostEditor key={isEdit ? `edit-${initial!.id}` : "create"} value={body} onChange={setBody} />
        </div>

        <div className="form-check">
          <input
            id="published"
            type="checkbox"
            className="form-check-input"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="published">
            منتشر شود
          </label>
        </div>

        <div className="d-flex flex-wrap align-items-center gap-2 mt-2">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "در حال ذخیره…" : "ذخیره"}
          </button>
          <Link href="/dashboard/posts" className="btn btn-outline-secondary">
            انصراف
          </Link>
          {isEdit ? (
            <span className="ms-auto">
              <DeletePostButton postId={initial!.id} title={title} redirectToList />
            </span>
          ) : null}
        </div>
      </form>
    </main>
  );
}

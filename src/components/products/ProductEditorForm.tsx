"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { RichPostEditor } from "@/components/blog/RichPostEditor";

export type ProductEditorInitial = {
  id: number;
  brand_id: number | null;
  name: string;
  name_en: string | null;
  slug: string;
  cover_image: string | null;
  short_description: string | null;
  body: string;
  price: string | null;
  seo_title: string | null;
  seo_meta_description: string | null;
  published: boolean;
};

type BrandRow = { id: number; name: string };

type Props =
  | { variant: "create"; presetBrandId?: number | null }
  | { variant: "edit"; initial: ProductEditorInitial };

export function ProductEditorForm(props: Props) {
  const router = useRouter();
  const isEdit = props.variant === "edit";
  const initial = isEdit ? props.initial : null;

  const [brands, setBrands] = useState<BrandRow[]>([]);
  const [name, setName] = useState(initial?.name ?? "");
  const [nameEn, setNameEn] = useState(initial?.name_en ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [brandId, setBrandId] = useState<string>(
    initial?.brand_id != null
      ? String(initial.brand_id)
      : props.variant === "create" && props.presetBrandId
        ? String(props.presetBrandId)
        : "",
  );
  const [coverImage, setCoverImage] = useState<string | null>(initial?.cover_image ?? null);
  const [shortDescription, setShortDescription] = useState(initial?.short_description ?? "");
  const [price, setPrice] = useState(initial?.price ?? "");
  const [seoTitle, setSeoTitle] = useState(initial?.seo_title ?? "");
  const [seoMetaDescription, setSeoMetaDescription] = useState(initial?.seo_meta_description ?? "");
  const [body, setBody] = useState(initial?.body ?? "");
  const [published, setPublished] = useState(initial?.published ?? true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/admin/brands");
        if (!res.ok) return;
        const data = (await res.json()) as { brands?: BrandRow[] };
        if (!cancelled && data.brands) setBrands(data.brands);
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
    if (!name.trim()) {
      setError("نام محصول الزامی است");
      return;
    }
    setLoading(true);
    try {
      const payload: Record<string, unknown> = {
        name: name.trim(),
        name_en: nameEn.trim() || null,
        slug: slug.trim() || null,
        brand_id: brandId ? Number(brandId) : null,
        cover_image: coverImage,
        short_description: shortDescription.trim() || null,
        body,
        price: price.trim() || null,
        seo_title: seoTitle.trim() || null,
        seo_meta_description: seoMetaDescription.trim() || null,
        published,
      };

      const url = isEdit ? `/api/admin/products/${initial!.id}` : "/api/admin/products";
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
      router.push("/dashboard/products");
      router.refresh();
    } catch {
      setError("ارتباط با سرور برقرار نشد");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container-sm" style={{ padding: "48px 0", maxWidth: 880 }}>
      <h1 className="h4 mb-4">{isEdit ? "ویرایش محصول" : "محصول جدید"}</h1>

      <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
        {error ? (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        ) : null}

        <div>
          <label className="form-label" htmlFor="name">
            نام محصول *
          </label>
          <input
            id="name"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={255}
          />
        </div>

        <div>
          <label className="form-label" htmlFor="name_en">
            نام انگلیسی
          </label>
          <input
            id="name_en"
            className="form-control"
            dir="ltr"
            value={nameEn}
            onChange={(e) => setNameEn(e.target.value)}
            maxLength={255}
          />
        </div>

        <div>
          <label className="form-label" htmlFor="brand_id">
            برند
          </label>
          <select
            id="brand_id"
            className="form-select"
            value={brandId}
            onChange={(e) => setBrandId(e.target.value)}
          >
            <option value="">— بدون برند —</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
          <p className="form-text small">
            <Link href="/dashboard/brands">مدیریت برندها</Link>
          </p>
        </div>

        <div>
          <label className="form-label" htmlFor="slug">
            اسلاگ
          </label>
          <input
            id="slug"
            className="form-control"
            dir="ltr"
            placeholder="مثلاً dehu-camera-x200"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            maxLength={191}
          />
        </div>

        <div>
          <label className="form-label" htmlFor="cover">
            تصویر محصول
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
          <label className="form-label" htmlFor="price">
            قیمت (اختیاری)
          </label>
          <input
            id="price"
            className="form-control"
            placeholder="مثلاً: ۱٬۲۰۰٬۰۰۰ تومان یا تماس بگیرید"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            maxLength={100}
          />
        </div>

        <div>
          <label className="form-label" htmlFor="short_description">
            توضیح کوتاه (اختیاری)
          </label>
          <textarea
            id="short_description"
            className="form-control"
            rows={2}
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            maxLength={1000}
          />
        </div>

        <div>
          <label className="form-label" htmlFor="seo_title">
            عنوان سئو
          </label>
          <input
            id="seo_title"
            className="form-control"
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            maxLength={255}
            placeholder="اگر خالی باشد از نام محصول استفاده می‌شود"
          />
        </div>

        <div>
          <label className="form-label" htmlFor="seo_meta_description">
            توضیحات متا
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
          <label className="form-label">توضیحات کامل محصول</label>
          <RichPostEditor
            key={isEdit ? `edit-${initial!.id}` : "create"}
            value={body}
            onChange={setBody}
          />
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
            منتشر شود (در سایت نمایش داده شود)
          </label>
        </div>

        <div className="d-flex flex-wrap align-items-center gap-2 mt-2">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "در حال ذخیره…" : "ذخیره"}
          </button>
          <Link href="/dashboard/products" className="btn btn-outline-secondary">
            انصراف
          </Link>
        </div>
      </form>
    </main>
  );
}

/** اسلاگ کوتاه و یکتا برای وقتی عنوان فقط فارسی است */
export function baseSlugFromTitle(title: string): string {
  const t = title.trim();
  if (!t) return "post";
  let s = t
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\u0600-\u06ff-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  if (!s) s = "post";
  return s.slice(0, 160);
}

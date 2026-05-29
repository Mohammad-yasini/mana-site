import DOMPurify from "isomorphic-dompurify";

export type PostTocItem = {
  id: string;
  text: string;
};

/**
 * به h2ها id می‌دهد تا فهرست کنار بتواند لنگر بزند؛ سپس HTML را پاکسازی می‌کند.
 */
export function preparePostBody(html: string): { safeHtml: string; toc: PostTocItem[] } {
  const toc: PostTocItem[] = [];
  let n = 0;
  const withIds = html.replace(/<h2\b([^>]*)>([\s\S]*?)<\/h2>/gi, (_full, attrs: string, inner: string) => {
    n += 1;
    const id = `post-sec-${n}`;
    const text = inner.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
    if (text) toc.push({ id, text });
    const attrsClean = attrs.replace(/\s+id\s*=\s*["'][^"']*["']/gi, "");
    return `<h2${attrsClean} id="${id}">${inner}</h2>`;
  });

  const safeHtml = DOMPurify.sanitize(withIds, {
    USE_PROFILES: { html: true },
    ADD_ATTR: ["id"],
  });

  return { safeHtml, toc };
}

export function plainTextFromHtml(html: string | null, max = 400): string {
  if (!html) return "";
  const t = html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max)}…`;
}

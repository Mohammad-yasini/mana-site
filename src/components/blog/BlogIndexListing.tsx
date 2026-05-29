"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export type BlogIndexPost = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image: string | null;
  category_slug: string | null;
  category_name: string | null;
  created_at: string | null;
};

export type BlogIndexCategory = {
  slug: string;
  name: string;
};

const PAGE_SIZE = 6;

const PLACEHOLDER_COVERS = [
  "/assets/images/img/catalog1.png",
  "/assets/images/img/catalog2.png",
  "/assets/images/img/catalog3.png",
  "/assets/images/img/catalog4.png",
];

function excerptPlain(html: string | null, max = 220): string {
  if (!html) return "";
  const t = html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max)}…`;
}

type Props = {
  posts: BlogIndexPost[];
  categories: BlogIndexCategory[];
  dbError: string | null;
};

export function BlogIndexListing({ posts, categories, dbError }: Props) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const t = query.trim().toLowerCase();
    if (!t) return posts;
    return posts.filter((p) => {
      const inTitle = p.title.toLowerCase().includes(t);
      const ex = excerptPlain(p.excerpt, 500).toLowerCase();
      return inTitle || ex.includes(t);
    });
  }, [posts, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageSafe = Math.min(page, totalPages);
  const slice = filtered.slice((pageSafe - 1) * PAGE_SIZE, pageSafe * PAGE_SIZE);

  if (dbError) {
    return (
      <section className="blog container-sm" id="blog-listing">
        <div className="alert alert-warning" role="alert">
          {dbError}
        </div>
      </section>
    );
  }

  if (posts.length === 0) {
    return (
      <section className="blog container-sm" id="blog-listing">
        <div className="blog-toolbar">
          <div className="blog-chips">
            <Link href="/blog" className="blog-chip is-active">
              همه
            </Link>
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/blog-category/${encodeURIComponent(c.slug)}`}
                className="blog-chip"
              >
                {c.name}
              </Link>
            ))}
          </div>
          <div className="blog-search">
            <input type="text" placeholder="جستجو در وبلاگ..." disabled />
          </div>
        </div>
        <p className="text-muted py-5 text-center">هنوز مطلب منتشرشده‌ای وجود ندارد.</p>
      </section>
    );
  }

  return (
    <section className="blog container-sm" id="blog-listing">
      <div className="blog-toolbar">
        <div className="blog-chips">
          <Link href="/blog" className="blog-chip is-active">
            همه
          </Link>
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/blog-category/${encodeURIComponent(c.slug)}`}
              className="blog-chip"
            >
              {c.name}
            </Link>
          ))}
        </div>
        <div className="blog-search">
          <input
            type="text"
            placeholder="جستجو در وبلاگ..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      <div className="blog-grid" data-blog-grid>
        {slice.map((p, i) => (
          <Link
            key={p.id}
            className="post-card"
            href={`/blog/${encodeURIComponent(p.slug)}`}
          >
            <div className="post-card__img">
              <img
                src={p.cover_image || PLACEHOLDER_COVERS[i % PLACEHOLDER_COVERS.length]}
                alt=""
              />
            </div>
            <div className="post-card__body">
              <div className="post-card__meta">
                <span className="tag">{p.category_name || "عمومی"}</span>
                <span className="date dirLTR">
                  {p.created_at ? p.created_at.slice(0, 10) : ""}
                </span>
              </div>
              <h3>{p.title}</h3>
              <p>{excerptPlain(p.excerpt) || "مطالعهٔ این نوشته…"}</p>
            </div>
          </Link>
        ))}
      </div>

      {totalPages > 1 ? (
        <div className="blog-pagination">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              type="button"
              className={`blog-page${num === pageSafe ? " is-active" : ""}`}
              onClick={() => setPage(num)}
            >
              {num}
            </button>
          ))}
          {pageSafe < totalPages ? (
            <button
              type="button"
              className="blog-page"
              onClick={() => setPage(pageSafe + 1)}
            >
              بعدی
            </button>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

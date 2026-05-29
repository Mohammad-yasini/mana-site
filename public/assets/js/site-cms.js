// Front-only CMS renderer (LocalStorage)
(function () {
  const LS_PAGES = "mana.site.pages.v1";
  const LS_BLOG = "mana.blog.v1";

  function safeJsonParse(value, fallback) {
    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  }

  function getPages() {
    return safeJsonParse(localStorage.getItem(LS_PAGES) || "", null);
  }

  function getBlog() {
    return safeJsonParse(localStorage.getItem(LS_BLOG) || "", null);
  }

  function getQueryParam(name) {
    const url = new URL(window.location.href);
    return url.searchParams.get(name);
  }

  function setText(selector, value) {
    const el = document.querySelector(selector);
    if (!el || value == null) return;
    el.textContent = value;
  }

  function setHtml(selector, value) {
    const el = document.querySelector(selector);
    if (!el || value == null) return;
    el.innerHTML = value;
  }

  function renderPages() {
    const pages = getPages();
    if (!pages) return;

    // Services
    if (pages.services) {
      setText("[data-cms='services.heroTitle']", pages.services.heroTitle);
      setText("[data-cms='services.heroDesc']", pages.services.heroDesc);
      setText("[data-cms='services.ctaTitle']", pages.services.ctaTitle);
      setText("[data-cms='services.ctaDesc']", pages.services.ctaDesc);
    }

    // About
    if (pages.about) {
      setText("[data-cms='about.heroTitle']", pages.about.heroTitle);
      setText("[data-cms='about.heroDesc']", pages.about.heroDesc);
      if (pages.about.storyHtml) {
        setHtml("[data-cms='about.storyHtml']", pages.about.storyHtml);
      }
    }

    // Contact
    if (pages.contact) {
      setText("[data-cms='contact.heroTitle']", pages.contact.heroTitle);
      setText("[data-cms='contact.heroDesc']", pages.contact.heroDesc);
      setText("[data-cms='contact.phone']", pages.contact.phone);
      setText("[data-cms='contact.whatsapp']", pages.contact.whatsapp);
      setText("[data-cms='contact.sms']", pages.contact.sms);
      setText("[data-cms='contact.instagram']", pages.contact.instagram);
    }
  }

  function renderBlogList() {
    const container = document.querySelector("[data-blog-grid]");
    if (!container) return;
    const blog = getBlog();
    if (!blog || !Array.isArray(blog.posts) || blog.posts.length === 0) return;

    // newest first
    const posts = [...blog.posts].sort((a, b) => (b.date || "").localeCompare(a.date || ""));
    container.innerHTML = posts
      .map((p) => {
        const cover = p.cover || "assets/images/img/catalog1.png";
        const category = (blog.categories || []).find((c) => c.id === p.categoryId);
        const catName = category ? category.name : "وبلاگ";
        const date = p.date || "";
        const excerpt = p.excerpt || "";
        return `
          <a class="post-card" href="./single-post.html?id=${encodeURIComponent(p.id)}">
            <div class="post-card__img">
              <img src="${cover}" alt="کاور" />
            </div>
            <div class="post-card__body">
              <div class="post-card__meta">
                <span class="tag">${catName}</span>
                <span class="date dirLTR">${date}</span>
              </div>
              <h3>${p.title || ""}</h3>
              <p>${excerpt}</p>
            </div>
          </a>
        `;
      })
      .join("");
  }

  function renderBlogCategory() {
    const container = document.querySelector("[data-blog-grid]");
    if (!container) return;
    const blog = getBlog();
    if (!blog || !Array.isArray(blog.posts) || blog.posts.length === 0) return;

    const slug = getQueryParam("cat");
    const categories = blog.categories || [];
    const category = slug ? categories.find((c) => c.slug === slug) : null;
    const catId = category ? category.id : null;

    const titleEl = document.querySelector("[data-cms='blog.categoryTitle']");
    if (titleEl && category) titleEl.textContent = `دسته‌بندی: ${category.name}`;

    const posts = [...blog.posts]
      .filter((p) => (catId ? p.categoryId === catId : true))
      .sort((a, b) => (b.date || "").localeCompare(a.date || ""));

    container.innerHTML = posts
      .map((p) => {
        const cover = p.cover || "assets/images/img/catalog2.png";
        const date = p.date || "";
        const excerpt = p.excerpt || "";
        return `
          <a class="post-card" href="./single-post.html?id=${encodeURIComponent(p.id)}">
            <div class="post-card__img">
              <img src="${cover}" alt="کاور" />
            </div>
            <div class="post-card__body">
              <div class="post-card__meta">
                <span class="tag">${category ? category.name : "وبلاگ"}</span>
                <span class="date dirLTR">${date}</span>
              </div>
              <h3>${p.title || ""}</h3>
              <p>${excerpt}</p>
            </div>
          </a>
        `;
      })
      .join("");
  }

  function renderSinglePost() {
    const blog = getBlog();
    if (!blog || !Array.isArray(blog.posts)) return;
    const id = getQueryParam("id");
    if (!id) return;

    const post = blog.posts.find((p) => String(p.id) === String(id));
    if (!post) return;

    const categories = blog.categories || [];
    const category = categories.find((c) => c.id === post.categoryId);
    const catName = category ? category.name : "وبلاگ";
    const date = post.date || "";
    const cover = post.cover || "assets/images/img/catalog1.png";

    setText("[data-cms='post.category']", catName);
    setText("[data-cms='post.date']", date);
    setText("[data-cms='post.title']", post.title);
    setText("[data-cms='post.excerpt']", post.excerpt);
    setHtml("[data-cms='post.content']", post.contentHtml || "");

    const img = document.querySelector("[data-cms='post.cover']");
    if (img && img.tagName === "IMG") img.setAttribute("src", cover);
  }

  function renderWpPage() {
    const titleEl = document.querySelector("[data-cms='wpPage.title']");
    const contentEl = document.querySelector("[data-cms='wpPage.content']");
    if (!titleEl && !contentEl) return;

    const pages = safeJsonParse(localStorage.getItem("mana.wp.pages.v1") || "", null);
    if (!pages || !Array.isArray(pages.items)) return;

    const slug = getQueryParam("slug");
    if (!slug) return;

    const page = pages.items.find((p) => p.slug === slug && p.status === "publish");
    if (!page) return;

    setText("[data-cms='wpPage.title']", page.title);
    setText("[data-cms='wpPage.excerpt']", page.excerpt || "");
    setHtml("[data-cms='wpPage.content']", page.contentHtml || "");
  }

  // Detect page type
  renderPages();
  renderBlogList();

  // If category title placeholder exists -> category page
  if (document.querySelector("[data-cms='blog.categoryTitle']")) {
    renderBlogCategory();
  }

  // If single post placeholders exist -> single
  if (document.querySelector("[data-cms='post.title']")) {
    renderSinglePost();
  }

  renderWpPage();
})();


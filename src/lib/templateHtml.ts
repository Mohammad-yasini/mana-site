import fs from "node:fs";
import path from "node:path";

function normalizeHtml(html: string) {
  return (
    html
      // assets paths
      .replaceAll('src="assets/', 'src="/assets/')
      .replaceAll("src='assets/", "src='/assets/")
      .replace(/srcset="([^"]*)"/g, (_, val: string) =>
        `srcset="${val.replaceAll("assets/", "/assets/")}"`,
      )
      .replace(/srcset='([^']*)'/g, (_, val: string) =>
        `srcset='${val.replaceAll("assets/", "/assets/")}'`,
      )
      .replaceAll('href="./assets/', 'href="/assets/')
      .replaceAll("href='./assets/", "href='/assets/")
      // internal routes
      .replaceAll('href="./home.html"', 'href="/"')
      .replaceAll('href="./about.html"', 'href="/about"')
      .replaceAll('href="./services.html"', 'href="/services"')
      .replaceAll('href="./contact.html"', 'href="/contact"')
      .replaceAll('href="./blog.html"', 'href="/blog"')
      .replaceAll('href="./login-step1.html"', 'href="/dashboard"')
      .replaceAll('href="./representation.html"', 'href="/representation"')
      .replaceAll('href="./brands.html"', 'href="/brands"')
  );
}

export function loadTemplateMainHtml(templateFileName: string) {
  const templatePath = path.join(process.cwd(), "src", "templates", templateFileName);
  const raw = fs.readFileSync(templatePath, "utf8");

  const mainMatch = raw.match(/<main>([\s\S]*?)<\/main>/i);
  const mainInner = mainMatch?.[1] ?? "";

  // remove footer if it exists inside <main> (home.html)
  const withoutFooter = mainInner.replace(
    /<footer[\s\S]*?<\/footer>/i,
    "",
  );

  // remove scripts embedded inside main if any
  const withoutScripts = withoutFooter.replace(/<script[\s\S]*?<\/script>/gi, "");

  return normalizeHtml(withoutScripts);
}


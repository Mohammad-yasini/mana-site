import {
  faviconMimeType,
  getSiteSettings,
  resolveFaviconUrl,
} from "@/lib/siteSettings";

export async function SiteFaviconHead() {
  const settings = await getSiteSettings();
  const href = resolveFaviconUrl(settings);
  const type = faviconMimeType(href) ?? "image/png";

  return (
    <>
      <link rel="icon" href={href} type={type} sizes="any" />
      <link rel="shortcut icon" href={href} type={type} />
      <link rel="apple-touch-icon" href={href} />
    </>
  );
}

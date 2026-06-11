import type { Metadata } from "next";
import { headers } from "next/headers";
import Script from "next/script";
import { SiteStylesHead } from "@/components/SiteStylesHead";
import { SiteFaviconHead } from "@/components/SiteFaviconHead";
import { HOME_SYNC_STYLES, HOME_LCP_IMAGE } from "@/lib/asyncStyles";
import {
  faviconMimeType,
  getSiteSettings,
  resolveFaviconUrl,
} from "@/lib/siteSettings";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SiteChrome } from "@/components/SiteChrome";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const faviconUrl = resolveFaviconUrl(settings);
  const type = faviconMimeType(faviconUrl);

  return {
    title: "Mana Site",
    description: "Mana Electronic — Next.js app",
    verification: {
      google: "kTPS1JThw3vIPIt35By0yclVV64ueuyZVgAskflVRtg",
    },
    icons: {
      icon: type ? [{ url: faviconUrl, type }] : faviconUrl,
      shortcut: faviconUrl,
      apple: faviconUrl,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const h = await headers();
  const pathname = h.get("x-pathname") ?? "";
  const syncStyles = pathname === "/" ? HOME_SYNC_STYLES : [];
  const lcpImage = pathname === "/" ? HOME_LCP_IMAGE : null;

  return (
    <html lang="fa" dir="rtl" className="h-full antialiased">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <SiteFaviconHead />

        <SiteStylesHead syncStyles={syncStyles} lcpImage={lcpImage} />
      </head>
      <body className="min-h-full flex flex-col">
        <SiteChrome header={<Header />} footer={<Footer />}>
          {children}
        </SiteChrome>
      </body>
      {pathname === "/" ? (
        <>
          <Script
            src="/assets/vendor/jquery/jquery.min.js"
            strategy="beforeInteractive"
          />
          <Script
            src="/assets/vendor/owlcarousel/owl.carousel.min.js"
            strategy="beforeInteractive"
          />
        </>
      ) : null}
      <Script src="/assets/vendor/bootstrap/bootstrap.bundle.min.js" strategy="afterInteractive" />
      <Script src="/assets/js/site-cms.js" strategy="afterInteractive" />
    </html>
  );
}

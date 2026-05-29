import type { Metadata } from "next";
import { headers } from "next/headers";
import Script from "next/script";
import { SiteStylesHead } from "@/components/SiteStylesHead";
import { HOME_ASYNC_STYLES, HOME_LCP_IMAGE } from "@/lib/asyncStyles";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SiteChrome } from "@/components/SiteChrome";

export const metadata: Metadata = {
  title: "Mana Site",
  description: "Mana Electronic — Next.js app",
  verification: {
    google: "kTPS1JThw3vIPIt35By0yclVV64ueuyZVgAskflVRtg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const h = await headers();
  const pathname = h.get("x-pathname") ?? "";
  const extraStyles = pathname === "/" ? HOME_ASYNC_STYLES : [];
  const lcpImage = pathname === "/" ? HOME_LCP_IMAGE : null;

  return (
    <html lang="fa" dir="rtl" className="h-full antialiased">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <SiteStylesHead extraStyles={extraStyles} lcpImage={lcpImage} />
      </head>
      <body className="min-h-full flex flex-col">
        <SiteChrome header={<Header />} footer={<Footer />}>
          {children}
        </SiteChrome>
      </body>
      <Script src="/assets/vendor/bootstrap/bootstrap.bundle.min.js" strategy="afterInteractive" />
      <Script src="/assets/js/site-cms.js" strategy="afterInteractive" />
    </html>
  );
}

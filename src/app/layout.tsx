import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className="h-full antialiased">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <link rel="stylesheet" href="/assets/fonts/vazirmatn/vazirmatn-local.css" />
        <link rel="stylesheet" href="/assets/vendor/bootstrap/bootstrap.rtl.min.css" />
        <link href="/assets/styles/style.css" rel="stylesheet" />
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

import {
  ASYNC_CSS_LOADER,
  CRITICAL_FONT_CSS,
  SITE_ASYNC_STYLES,
} from "@/lib/asyncStyles";

type Props = { extraStyles?: readonly string[] };

export function SiteStylesHead({ extraStyles = [] }: Props) {
  const asyncHrefs = [...SITE_ASYNC_STYLES, ...extraStyles];

  return (
    <>
      <link
        rel="preload"
        href="/assets/fonts/vazirmatn/vazirmatn-arabic-400-normal.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      <link
        rel="preload"
        href="/assets/fonts/vazirmatn/vazirmatn-arabic-700-normal.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      {asyncHrefs.map((href) => (
        <link key={`preload-${href}`} rel="preload" href={href} as="style" />
      ))}
      {asyncHrefs.map((href) => (
        <link key={href} rel="stylesheet" href={href} media="print" data-async-css="" />
      ))}
      <noscript>
        {asyncHrefs.map((href) => (
          <link key={`ns-${href}`} rel="stylesheet" href={href} />
        ))}
      </noscript>
      <style dangerouslySetInnerHTML={{ __html: CRITICAL_FONT_CSS }} />
      <script dangerouslySetInnerHTML={{ __html: ASYNC_CSS_LOADER }} />
    </>
  );
}

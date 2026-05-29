import {
  ASYNC_CSS_LOADER,
  CRITICAL_FONT_CSS,
  SITE_ASYNC_STYLES,
} from "@/lib/asyncStyles";

type Props = {
  extraStyles?: readonly string[];
  syncStyles?: readonly string[];
  lcpImage?: string | null;
};

export function SiteStylesHead({
  extraStyles = [],
  syncStyles = [],
  lcpImage = null,
}: Props) {
  const asyncHrefs = [...SITE_ASYNC_STYLES, ...extraStyles];

  return (
    <>
      {syncStyles.map((href) => (
        <link key={`sync-${href}`} rel="stylesheet" href={href} />
      ))}
      {lcpImage ? (
        <link rel="preload" as="image" href={lcpImage} fetchPriority="high" />
      ) : null}
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

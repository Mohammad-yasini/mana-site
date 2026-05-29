/** Inline critical font + async loader for render-blocking CSS (mobile Lighthouse). */

export const CRITICAL_FONT_CSS = `@font-face{font-family:"Vazirmatn";font-style:normal;font-weight:400;font-display:swap;src:url("/assets/fonts/vazirmatn/vazirmatn-arabic-400-normal.woff2") format("woff2")}@font-face{font-family:"Vazirmatn";font-style:normal;font-weight:700;font-display:swap;src:url("/assets/fonts/vazirmatn/vazirmatn-arabic-700-normal.woff2") format("woff2")}html,body{font-family:"Vazirmatn",system-ui,sans-serif;direction:rtl;text-align:right}`;

export const ASYNC_CSS_LOADER = `(function(){function activate(el){el.media="all"}function scan(){var links=document.querySelectorAll('link[data-async-css]');for(var i=0;i<links.length;i++){var link=links[i];if(link.media==="all")continue;link.onload=function(){activate(this)};if(link.sheet)activate(link);}}scan();if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",scan);else setTimeout(scan,0);})();`;

export const SITE_ASYNC_STYLES = [
  "/assets/vendor/bootstrap/bootstrap.rtl.min.css",
  "/assets/styles/style.css",
] as const;

export const HOME_LCP_IMAGE = "/assets/images/img/Cameras1.png";

/** Owl CSS must load before carousel init — async loading breaks layout. */
export const HOME_SYNC_STYLES = [
  "/assets/vendor/owlcarousel/owl.carousel.min.css",
  "/assets/vendor/owlcarousel/owl.theme.default.min.css",
] as const;

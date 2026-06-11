import DOMPurify from "isomorphic-dompurify";
import { getSiteHeaderConfig } from "@/lib/siteHeader";
import { HeaderClient } from "./HeaderClient";

const phoneSanitize = {
  ALLOWED_TAGS: ["small", "span", "br", "b", "i", "strong", "em"],
  ALLOWED_ATTR: ["class"],
};

export async function Header() {
  const cfg = await getSiteHeaderConfig();
  const safePhone = DOMPurify.sanitize(cfg.phoneDisplayHtml, phoneSanitize);

  return (
    <HeaderClient
      contactSubtitle={cfg.contactSubtitle}
      phoneHtml={safePhone}
      navLinks={cfg.navLinks}
      representationButtonHref={cfg.representationButtonHref}
      panelButtonHref={cfg.panelButtonHref}
    />
  );
}

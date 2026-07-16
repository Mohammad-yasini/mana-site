export const CLUB_URL = "https://club.manaelectronic.com/";

export const CONTACT_PHONE_TEL = "tel:+982191300930";
export const CONTACT_WHATSAPP_URL = "https://wa.me/989120000000";
export const CONTACT_SMS_URL = "sms:30007957951415";
export const CONTACT_INSTAGRAM_URL = "https://instagram.com/manaelectronic";

export type NavLink = { label: string; href: string };

export const DEFAULT_HEADER_NAV: NavLink[] = [
  { href: "/brands", label: "برندها" },
  { href: "/services", label: "خدمات" },
  { href: "/blog", label: "وبلاگ" },
  { href: "/about", label: "درباره ما" },
  { href: "/contact", label: "ارتباط با ما" },
];

export const STATIC_BRAND_LINKS: NavLink[] = [
  { label: "دوربین نظارتی دهو", href: "/brand/dehu" },
  { label: "آداپتور و تجهیزات یوتک", href: "/brand/utec" },
  { label: "کابل و اتصالات های‌لینک", href: "/brand/hi-link" },
  { label: "خدمات مانا سرویس", href: "/brand/mana-service" },
];

export const DEFAULT_FOOTER_USER_LINKS: NavLink[] = [
  { label: "ورود به پنل همکاران", href: CLUB_URL },
  { label: "ثبت‌نام پنل همکاری", href: CLUB_URL },
  { label: "اعطای نمایندگی", href: "/representation" },
  { label: "همه برندها", href: "/brands" },
];

export const DEFAULT_FOOTER_QUICK_LINKS: NavLink[] = [
  { label: "برندها و محصولات", href: "/brands" },
  { label: "وبلاگ", href: "/blog" },
  { label: "خدمات", href: "/services" },
  { label: "درباره ما", href: "/about" },
  { label: "ارتباط با ما", href: "/contact" },
];

export const DEFAULT_FOOTER_PHONES = [
  {
    icon: "/assets/images/app-icons/cil_phone.svg",
    text: "دفتر مرکزی: 021-91300930",
    href: "tel:+982191300930",
  },
  {
    icon: "/assets/images/app-icons/cil_phone.svg",
    text: "فروش: 09200747058",
    href: "tel:+989200747058",
  },
  {
    icon: "/assets/images/app-icons/cil_phone.svg",
    text: "فروش: 09200847058",
    href: "tel:+989200847058",
  },
  {
    icon: "/assets/images/app-icons/cil_phone.svg",
    text: "پشتیبانی سایت: 09200947058",
    href: "tel:+989200947058",
  },
  {
    icon: "/assets/images/app-icons/cil_phone.svg",
    text: "پشتیبانی فنی: 09142772610",
    href: "tel:+989142772610",
  },
] as const;

export function isPlaceholderHref(href: string): boolean {
  const h = href.trim();
  return !h || h === "#";
}

export function linksArePlaceholders(links: { href: string }[]): boolean {
  return links.length === 0 || links.every((l) => isPlaceholderHref(l.href));
}

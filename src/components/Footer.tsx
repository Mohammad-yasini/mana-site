import DOMPurify from "isomorphic-dompurify";
import { getSiteFooterConfig } from "@/lib/siteFooter";

const phoneHtmlSanitize = {
  ALLOWED_TAGS: ["small", "span", "br", "b", "i", "strong", "em"],
  ALLOWED_ATTR: ["class"],
};

const copyrightSanitize = {
  ALLOWED_TAGS: ["small", "span", "br", "b", "i", "strong", "em", "a"],
  ALLOWED_ATTR: ["class", "href", "rel", "target"],
};

export async function Footer() {
  const cfg = await getSiteFooterConfig();
  const safePhoneBlock = DOMPurify.sanitize(cfg.logoPhoneDisplay, phoneHtmlSanitize);
  const safeCopyright = DOMPurify.sanitize(cfg.copyrightText, copyrightSanitize);

  return (
    <footer className="footer-section">
      <div className="container-sm footer-container">
        <div className="left">
          <div className="offers-container">
            <div className="offers-content">
              <h2>تخفیفات و امتیازات ویژه، مخصوص همکاران عزیز</h2>
              <p>
                همکار گرامی <b>در هر مقیاسی که فعالیت می&zwnj;کنید</b>، مانا
                الکترونیک جوایز و تخفیف&zwnj;های ویژه برای شما دارد. حساب خود را
                بسازید و امروز شروع کنید!
              </p>
            </div>

            <div className="offers-button">
              <a href="#" className="btn-link">
                <img
                  src="/assets/images/app-icons/ph_user-circle-plus-fill.svg"
                  alt="Mana Service"
                />
                یک پنل همکاری بسازید
              </a>
            </div>
          </div>

          <div className="left-nner">
            <div className="footer-left">
              <div className="links-col">
                <h3>{cfg.brandsColumnTitle}</h3>
                <ul>
                  {cfg.brandsLinks.map((item, i) => (
                    <li key={`b-${i}`}>
                      <a href={item.href}>{item.label}</a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="links-col">
                <h3>{cfg.userColumnTitle}</h3>
                <ul>
                  {cfg.userLinks.map((item, i) => (
                    <li key={`u-${i}`}>
                      <a href={item.href}>{item.label}</a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="links-col">
                <h3>{cfg.quickColumnTitle}</h3>
                <ul>
                  {cfg.quickLinks.map((item, i) => (
                    <li key={`q-${i}`}>
                      <a href={item.href}>{item.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="footer-middle">
              <div className="contact-box">
                {cfg.phones.map((row, i) => (
                  <a key={`p-${i}`} href={row.href}>
                    <img src={row.icon} alt="" />
                    {row.text}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="footer-right">
          <div className="logo-area">
            <img src="/assets/images/logo/3.svg" alt="Mana Logo" />
            <div className="caption">
              {cfg.logoTagline}
              <br />
              <span
                className="phone dirLTR"
                dangerouslySetInnerHTML={{ __html: safePhoneBlock }}
              />
            </div>
          </div>
          <p className="footer-desc">{cfg.rightDescription}</p>
          <div className="badges">
            {cfg.badges.map((b, i) =>
              b.src ? (
                <img key={`bd-${i}`} src={b.src} alt={b.alt} />
              ) : null,
            )}
          </div>
          <p
            className="copyright"
            dangerouslySetInnerHTML={{ __html: safeCopyright }}
          />
        </div>
      </div>
    </footer>
  );
}

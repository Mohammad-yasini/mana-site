import Script from "next/script";
import type { Metadata } from "next";
import { loadTemplateMainHtml } from "@/lib/templateHtml";
import { metadataForPage } from "@/lib/pageSeo";

export async function generateMetadata(): Promise<Metadata> {
  return metadataForPage("home");
}

export default function Home() {
  const html = loadTemplateMainHtml("home.html");

  return (
    <>
      <style>{`
        .home-motion .brand-box,
        .home-motion .product-box,
        .home-motion .product-section,
        .home-motion .offer-card,
        .home-motion .testimonial-card {
          transition: transform .25s ease, box-shadow .25s ease;
        }
        .home-motion .brand-box:hover,
        .home-motion .product-box:hover,
        .home-motion .product-section:hover {
          transform: translateY(-6px);
          box-shadow: 0 14px 30px rgba(0, 0, 0, 0.10);
        }
        .home-motion.motion-ready > section,
        .home-motion.motion-ready section.brand-section,
        .home-motion.motion-ready section.about-section,
        .home-motion.motion-ready section.mana-about,
        .home-motion.motion-ready section.brands-section,
        .home-motion.motion-ready section.testimonial,
        .home-motion.motion-ready section.brandsCircle-section,
        .home-motion.motion-ready section.offers-section,
        .home-motion.motion-ready section.security-section {
          opacity: 0;
          transform: translateY(26px);
          transition: opacity .7s ease, transform .7s ease;
          will-change: opacity, transform;
        }
        .home-motion.motion-ready section.is-visible {
          opacity: 1;
          transform: none;
        }
        @media (prefers-reduced-motion: reduce) {
          .home-motion.motion-ready section {
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
          }
        }
      `}</style>
      <main className="home-motion" dangerouslySetInnerHTML={{ __html: html }} />
      <Script id="home-motion-reveal" strategy="afterInteractive">
        {`
          (function () {
            var root = document.querySelector('.home-motion');
            if (!root) return;
            if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
            root.classList.add('motion-ready');
            var secs = root.querySelectorAll('section');
            if (!('IntersectionObserver' in window)) {
              secs.forEach(function (s) { s.classList.add('is-visible'); });
              return;
            }
            var io = new IntersectionObserver(function (entries) {
              entries.forEach(function (e) {
                if (e.isIntersecting) {
                  e.target.classList.add('is-visible');
                  io.unobserve(e.target);
                }
              });
            }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
            secs.forEach(function (s) { io.observe(s); });
          })();
        `}
      </Script>
      <Script id="home-vendors-owl" strategy="afterInteractive">
        {`
          (function () {
            function initOwl() {
              if (!window.jQuery || !window.jQuery.fn || !window.jQuery.fn.owlCarousel) return;
              var $ = window.jQuery;
              $(document).ready(function () {
                var sync1 = $("#sync1");
                var sync2 = $("#sync2");
                var sync3 = $("#sync3");
                if (!sync1.length) return;
                var slidesPerPage = 3;
                var syncedSecondary = true;

                function fixNavText(arr) {
                  return (arr || []).map(function (s) {
                    return String(s).replaceAll('src="assets/', 'src="/assets/');
                  });
                }

                sync1
                  .owlCarousel({
                    items: 1,
                    slideSpeed: 2000,
                    nav: true,
                    autoplay: false,
                    dots: false,
                    loop: true,
                    responsiveRefreshRate: 200,
                    navText: fixNavText([
                      '<img src="/assets/images/app-icons/fluent-emoji-high-contrast_left-arrow.svg" alt="" />',
                      '<img src="/assets/images/app-icons/fluent-emoji-high-contrast_right-arrow.svg" alt="" />',
                    ]),
                  })
                  .on("changed.owl.carousel", syncPosition);

                sync2
                  .on("initialized.owl.carousel", function () {
                    sync2.find(".owl-item").eq(0).addClass("current");
                  })
                  .owlCarousel({
                    items: slidesPerPage,
                    dots: false,
                    nav: true,
                    smartSpeed: 200,
                    slideSpeed: 500,
                    slideBy: slidesPerPage,
                    responsiveRefreshRate: 100,
                    navText: fixNavText([
                      '<img src="/assets/images/app-icons/fluent-emoji-high-contrast_left-arrow.svg" alt="" />',
                      '<img src="/assets/images/app-icons/fluent-emoji-high-contrast_right-arrow.svg" alt="" />',
                    ]),
                  })
                  .on("changed.owl.carousel", syncPosition2);

                function syncPosition(el) {
                  var count = el.item.count - 1;
                  var current = Math.round(el.item.index - el.item.count / 2 - 0.5);
                  if (current < 0) current = count;
                  if (current > count) current = 0;

                  sync2
                    .find(".owl-item")
                    .removeClass("current")
                    .eq(current)
                    .addClass("current");

                  var onscreen = sync2.find(".owl-item.active").length - 1;
                  var start = sync2.find(".owl-item.active").first().index();
                  var end = sync2.find(".owl-item.active").last().index();

                  if (current > end) sync2.data("owl.carousel").to(current, 100, true);
                  if (current < start)
                    sync2.data("owl.carousel").to(current - onscreen, 100, true);
                }

                function syncPosition2(el) {
                  if (syncedSecondary) {
                    var number = el.item.index;
                    sync1.data("owl.carousel").to(number, 100, true);
                  }
                }

                sync2.on("click", ".owl-item", function (e) {
                  e.preventDefault();
                  var number = $(this).index();
                  sync1.data("owl.carousel").to(number, 300, true);
                });

                sync3.owlCarousel({
                  items: 2,
                  slideSpeed: 2000,
                  nav: false,
                  autoplay: false,
                  dots: true,
                  loop: true,
                  responsiveRefreshRate: 200,
                });
              });
            }

            function loadOwl() {
              var s = document.createElement("script");
              s.src = "/assets/vendor/owlcarousel/owl.carousel.min.js";
              s.onload = initOwl;
              document.body.appendChild(s);
            }

            if (window.jQuery) {
              loadOwl();
              return;
            }

            var jq = document.createElement("script");
            jq.src = "/assets/vendor/jquery/jquery.min.js";
            jq.onload = loadOwl;
            document.body.appendChild(jq);
          })();
        `}
      </Script>
    </>
  );
}

import Script from "next/script";
import { loadTemplateMainHtml } from "@/lib/templateHtml";

export default function Home() {
  const html = loadTemplateMainHtml("home.html");

  return (
    <>
      <main dangerouslySetInnerHTML={{ __html: html }} />
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js"
        strategy="afterInteractive"
      />
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.0.0-beta.3/owl.carousel.min.js"
        strategy="afterInteractive"
      />
      <Script id="home-owl-init" strategy="afterInteractive">
        {`
          (function () {
            if (!window.jQuery) return;
            var $ = window.jQuery;
            $(document).ready(function () {
              var sync1 = $("#sync1");
              var sync2 = $("#sync2");
              var sync3 = $("#sync3");
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
                    '<img src="assets/images/app-icons/fluent-emoji-high-contrast_left-arrow.svg" alt="arrow" />',
                    '<img src="assets/images/app-icons/fluent-emoji-high-contrast_right-arrow.svg" alt="arrow" />',
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
                    '<img src="assets/images/app-icons/fluent-emoji-high-contrast_left-arrow.svg" alt="arrow" />',
                    '<img src="assets/images/app-icons/fluent-emoji-high-contrast_right-arrow.svg" alt="arrow" />',
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
          })();
        `}
      </Script>
    </>
  );
}

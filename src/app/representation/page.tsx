import type { Metadata } from "next";
import { RepresentationForm } from "@/components/RepresentationForm";

export const metadata: Metadata = {
  title: "اعطای نمایندگی - مانا الکترونیک",
  description:
    "فرم درخواست نمایندگی و همکاری با مانا الکترونیک؛ تجهیزات امنیتی و نظارت تصویری.",
};

export default function RepresentationPage() {
  return (
    <main>
      <section className="page-hero container-sm">
        <div className="page-hero__inner">
          <div className="page-hero__content">
            <h1 className="page-hero__title">اعطای نمایندگی</h1>
            <p className="page-hero__desc">
              اگر در زمینهٔ فروش، نصب یا پشتیبانی تجهیزات امنیتی و نظارت تصویری
              فعالیت می‌کنید، با ثبت درخواست نمایندگی از شرایط ویژهٔ همکاری، تخفیف‌ها
              و پشتیبانی فنی مانا الکترونیک بهره‌مند شوید.
            </p>
            <div className="page-hero__actions">
              <a href="#representation-form" className="services-btn services-btn--primary">
                تکمیل فرم درخواست
              </a>
              <a href="/services" className="services-btn services-btn--ghost">
                مشاهده خدمات
              </a>
            </div>
          </div>
          <div className="page-hero__media">
            <img src="/assets/images/img/banner2.png" alt="اعطای نمایندگی" />
          </div>
        </div>
      </section>

      <section className="contact container-sm" id="representation-form">
        <div className="contact-grid">
          <div className="contact-card">
            <h2 className="services-title">مزایای همکاری</h2>
            <div className="contact-hours">
              <div className="contact-hours__row">
                <strong>تخفیف ویژهٔ همکاران</strong>
                <span>قیمت‌گذاری پلکانی</span>
              </div>
              <div className="contact-hours__row">
                <strong>پشتیبانی فنی</strong>
                <span>آموزش و راهنمایی نصب</span>
              </div>
              <div className="contact-hours__row">
                <strong>گارانتی معتبر</strong>
                <span>خدمات پس از فروش</span>
              </div>
              <div className="contact-hours__row">
                <strong>زمان بررسی درخواست</strong>
                <span>کمتر از ۴۸ ساعت کاری</span>
              </div>
            </div>
          </div>

          <RepresentationForm />
        </div>
      </section>
    </main>
  );
}

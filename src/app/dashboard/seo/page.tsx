import { PageSeoAdminClient } from "@/components/admin/PageSeoAdminClient";
import { PAGE_DEFS, getAllPageSeo } from "@/lib/pageSeo";

export const dynamic = "force-dynamic";

export default async function DashboardSeoPage() {
  const seo = await getAllPageSeo();
  return (
    <div>
      <p className="text-muted small mb-3">
        عنوان سئو، توضیحات متا و سایر تنظیمات سئوی هر برگهٔ ثابت سایت را اینجا تنظیم کنید. در صورت
        خالی بودن، مقدار پیش‌فرض هر برگه استفاده می‌شود.
      </p>
      <PageSeoAdminClient pages={PAGE_DEFS} initialSeo={seo} />
    </div>
  );
}

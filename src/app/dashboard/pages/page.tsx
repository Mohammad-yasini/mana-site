import { PageContentAdminClient } from "@/components/admin/PageContentAdminClient";
import {
  PAGE_CONTENT_DEFS,
  defaultTemplateHtml,
  getAllPageContentRecords,
} from "@/lib/pageContent";

export const dynamic = "force-dynamic";

export default async function DashboardPagesPage() {
  const records = await getAllPageContentRecords();
  const defaultHtml: Record<string, string> = {};
  const initialEditorHtml: Record<string, string> = {};

  for (const def of PAGE_CONTENT_DEFS) {
    const template = defaultTemplateHtml(def);
    defaultHtml[def.key] = template;
    const record = records[def.key];
    initialEditorHtml[def.key] =
      record?.isCustom && record.bodyHtml ? record.bodyHtml : template;
  }

  return (
    <>
      <p className="text-muted small mb-3">
        محتوای اصلی برگه‌های ثابت (صفحه اصلی، درباره ما، خدمات، تماس) را اینجا ویرایش کنید.
      </p>
      <PageContentAdminClient
        pages={PAGE_CONTENT_DEFS}
        initialRecords={records}
        initialEditorHtml={initialEditorHtml}
        defaultHtml={defaultHtml}
      />
    </>
  );
}

import { SiteSettingsAdminClient } from "@/components/admin/SiteSettingsAdminClient";
import { DEFAULT_FAVICON_URL, getSiteSettings } from "@/lib/siteSettings";

export const dynamic = "force-dynamic";

export default async function DashboardSiteSettingsPage() {
  const config = await getSiteSettings();
  return (
    <SiteSettingsAdminClient initialConfig={config} defaultFaviconUrl={DEFAULT_FAVICON_URL} />
  );
}

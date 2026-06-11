import { SiteSettingsAdminClient } from "@/components/admin/SiteSettingsAdminClient";
import { getSiteSettings } from "@/lib/siteSettings";

export const dynamic = "force-dynamic";

const DEFAULT_FAVICON_URL = "/icon.png";

export default async function DashboardSiteSettingsPage() {
  const config = await getSiteSettings();
  return (
    <SiteSettingsAdminClient initialConfig={config} defaultFaviconUrl={DEFAULT_FAVICON_URL} />
  );
}

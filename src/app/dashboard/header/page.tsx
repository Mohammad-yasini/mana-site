import { HeaderAdminClient } from "@/components/admin/HeaderAdminClient";
import { getSiteHeaderConfig } from "@/lib/siteHeader";

export default async function DashboardHeaderPage() {
  const config = await getSiteHeaderConfig();
  return <HeaderAdminClient initialConfig={config} />;
}

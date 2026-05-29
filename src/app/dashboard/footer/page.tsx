import { FooterAdminClient } from "@/components/admin/FooterAdminClient";
import { getSiteFooterConfig } from "@/lib/siteFooter";

export default async function DashboardFooterPage() {
  const config = await getSiteFooterConfig();
  return <FooterAdminClient initialConfig={config} />;
}

import { RobotsAdminClient } from "@/components/admin/RobotsAdminClient";
import { getRobotsTxtContent } from "@/lib/siteRobots";

export const dynamic = "force-dynamic";

export default async function DashboardRobotsPage() {
  const content = await getRobotsTxtContent();
  return (
    <div>
      <p className="text-muted small mb-3">
        محتوای فایل robots.txt را ویرایش کنید. sitemap.xml به‌صورت خودکار از دیتابیس ساخته می‌شود.
      </p>
      <RobotsAdminClient initialContent={content} />
    </div>
  );
}

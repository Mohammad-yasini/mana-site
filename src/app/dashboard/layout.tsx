import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_SESSION_COOKIE, verifyAdminJwt } from "@/lib/auth";
import { DashboardShell } from "@/components/admin/DashboardShell";
import "./dashboard.css";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  const payload = token ? verifyAdminJwt(token) : null;
  if (!payload) {
    redirect("/login");
  }
  return <DashboardShell adminEmail={payload.email}>{children}</DashboardShell>;
}

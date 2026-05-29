import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, verifyAdminJwt, type AdminJwtPayload } from "@/lib/auth";

export async function getAdminFromCookies(): Promise<AdminJwtPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifyAdminJwt(token);
}

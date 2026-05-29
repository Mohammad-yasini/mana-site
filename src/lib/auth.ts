import jwt from "jsonwebtoken";

export const ADMIN_SESSION_COOKIE = "admin_session";

export function getJwtSecret(): string {
  const s = process.env.JWT_SECRET;
  if (!s) {
    throw new Error("JWT_SECRET is not set");
  }
  return s;
}

export type AdminJwtPayload = {
  sub: number;
  email: string;
  role: string;
};

export function signAdminJwt(payload: AdminJwtPayload): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: "7d" });
}

export function verifyAdminJwt(token: string): AdminJwtPayload | null {
  try {
    const decoded = jwt.verify(token, getJwtSecret()) as unknown;
    if (typeof decoded !== "object" || decoded === null) {
      return null;
    }
    const o = decoded as Record<string, unknown>;
    const subRaw = o.sub;
    const sub = typeof subRaw === "number" ? subRaw : Number(subRaw);
    if (!Number.isFinite(sub)) {
      return null;
    }
    if (typeof o.email !== "string" || typeof o.role !== "string") {
      return null;
    }
    return { sub, email: o.email, role: o.role };
  } catch {
    return null;
  }
}

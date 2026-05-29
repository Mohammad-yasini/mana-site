import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { ADMIN_SESSION_COOKIE, signAdminJwt } from "@/lib/auth";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "بدنه درخواست نامعتبر است" }, { status: 400 });
  }

  if (
    typeof body !== "object" ||
    body === null ||
    typeof (body as { email?: unknown }).email !== "string" ||
    typeof (body as { password?: unknown }).password !== "string"
  ) {
    return NextResponse.json(
      { error: "فیلدهای email و password الزامی هستند" },
      { status: 400 },
    );
  }

  const { email, password } = body as { email: string; password: string };
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail || !password) {
    return NextResponse.json({ error: "ایمیل یا رمز خالی است" }, { status: 400 });
  }

  try {
    const pool = getPool();
    const [rows] = await pool.execute(
      "SELECT id, email, password, role FROM admins WHERE email = ? LIMIT 1",
      [normalizedEmail],
    );

    const list = rows as {
      id: number;
      email: string;
      password: string;
      role: string;
    }[];
    const admin = list[0];
    if (!admin) {
      return NextResponse.json({ error: "ایمیل یا رمز اشتباه است" }, { status: 401 });
    }

    const ok = bcrypt.compareSync(password, admin.password);
    if (!ok) {
      return NextResponse.json({ error: "ایمیل یا رمز اشتباه است" }, { status: 401 });
    }

    const token = signAdminJwt({
      sub: admin.id,
      email: admin.email,
      role: admin.role,
    });

    const res = NextResponse.json({ ok: true });
    res.cookies.set(ADMIN_SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { getAdminFromCookies } from "@/lib/admin-session";
import type { RowDataPacket } from "mysql2";

export async function GET() {
  const admin = await getAdminFromCookies();
  if (!admin) {
    return NextResponse.json({ error: "لطفاً وارد شوید" }, { status: 401 });
  }

  try {
    const pool = getPool();
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT id, full_name, company_name, phone, email, city, activity_field, message, status, created_at
       FROM representation_requests
       ORDER BY created_at DESC`,
    );
    return NextResponse.json({ requests: rows });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "خطای دیتابیس" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import type { ResultSetHeader } from "mysql2";

function str(v: unknown, max: number): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "بدنه نامعتبر" }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "بدنه نامعتبر" }, { status: 400 });
  }

  const b = body as Record<string, unknown>;
  const fullName = str(b.full_name, 150);
  const companyName = str(b.company_name, 200) || null;
  const phone = str(b.phone, 40);
  const email = str(b.email, 191) || null;
  const city = str(b.city, 120) || null;
  const activityField = str(b.activity_field, 200) || null;
  const message = str(b.message, 4000) || null;

  if (!fullName) {
    return NextResponse.json({ error: "نام و نام خانوادگی الزامی است" }, { status: 400 });
  }
  if (!phone) {
    return NextResponse.json({ error: "شماره تماس الزامی است" }, { status: 400 });
  }
  if (!/^[0-9+\-\s()]{7,40}$/.test(phone)) {
    return NextResponse.json({ error: "شماره تماس معتبر نیست" }, { status: 400 });
  }

  try {
    const pool = getPool();
    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO representation_requests
        (full_name, company_name, phone, email, city, activity_field, message)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [fullName, companyName, phone, email, city, activityField, message],
    );
    return NextResponse.json({ ok: true, id: result.insertId });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "ثبت نشد؛ لطفاً بعداً تلاش کنید." },
      { status: 500 },
    );
  }
}

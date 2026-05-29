import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { getAdminFromCookies } from "@/lib/admin-session";
import type { ResultSetHeader } from "mysql2";

const ALLOWED_STATUS = ["new", "reviewed", "done", "rejected"];

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await getAdminFromCookies();
  if (!admin) {
    return NextResponse.json({ error: "لطفاً وارد شوید" }, { status: 401 });
  }

  const { id } = await params;
  const numId = Number(id);
  if (!Number.isInteger(numId) || numId <= 0) {
    return NextResponse.json({ error: "شناسه نامعتبر" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "بدنه نامعتبر" }, { status: 400 });
  }

  const status = (body as { status?: unknown })?.status;
  if (typeof status !== "string" || !ALLOWED_STATUS.includes(status)) {
    return NextResponse.json({ error: "وضعیت نامعتبر" }, { status: 400 });
  }

  try {
    const pool = getPool();
    await pool.execute("UPDATE representation_requests SET status = ? WHERE id = ?", [status, numId]);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "خطای دیتابیس" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await getAdminFromCookies();
  if (!admin) {
    return NextResponse.json({ error: "لطفاً وارد شوید" }, { status: 401 });
  }

  const { id } = await params;
  const numId = Number(id);
  if (!Number.isInteger(numId) || numId <= 0) {
    return NextResponse.json({ error: "شناسه نامعتبر" }, { status: 400 });
  }

  try {
    const pool = getPool();
    const [res] = await pool.execute<ResultSetHeader>(
      "DELETE FROM representation_requests WHERE id = ?",
      [numId],
    );
    if (res.affectedRows === 0) {
      return NextResponse.json({ error: "یافت نشد" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "خطای دیتابیس" }, { status: 500 });
  }
}

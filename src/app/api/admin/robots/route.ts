import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { getAdminFromCookies } from "@/lib/admin-session";
import {
  assertValidRobotsContent,
  DEFAULT_ROBOTS_TXT,
  getRobotsTxtContent,
} from "@/lib/siteRobots";
import type { ResultSetHeader } from "mysql2";

export async function GET() {
  const admin = await getAdminFromCookies();
  if (!admin) {
    return NextResponse.json({ error: "لطفاً وارد شوید" }, { status: 401 });
  }

  try {
    const content = await getRobotsTxtContent();
    return NextResponse.json({ content, defaultContent: DEFAULT_ROBOTS_TXT });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "خطای دیتابیس" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const admin = await getAdminFromCookies();
  if (!admin) {
    return NextResponse.json({ error: "لطفاً وارد شوید" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "بدنه نامعتبر" }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "بدنه نامعتبر" }, { status: 400 });
  }

  let content: string;
  try {
    content = assertValidRobotsContent((body as { content?: unknown }).content);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "محتوای نامعتبر";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  try {
    const pool = getPool();
    const [upd] = await pool.execute<ResultSetHeader>(
      "UPDATE site_robots_config SET content = ? WHERE id = 1",
      [content],
    );
    if (upd.affectedRows === 0) {
      await pool.execute("INSERT INTO site_robots_config (id, content) VALUES (1, ?)", [content]);
    }
    return NextResponse.json({ ok: true, content });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "ذخیره نشد؛ جدول site_robots_config را در MySQL ساخته‌اید؟" },
      { status: 500 },
    );
  }
}

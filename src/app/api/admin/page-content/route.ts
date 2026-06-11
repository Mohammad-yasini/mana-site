import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { getAdminFromCookies } from "@/lib/admin-session";
import {
  PAGE_CONTENT_DEFS,
  defaultTemplateHtml,
  getAllPageContentRecords,
  getPageContentDef,
  sanitizePageContentInput,
} from "@/lib/pageContent";
import type { ResultSetHeader } from "mysql2";

export async function GET(request: Request) {
  const admin = await getAdminFromCookies();
  if (!admin) {
    return NextResponse.json({ error: "لطفاً وارد شوید" }, { status: 401 });
  }

  const url = new URL(request.url);
  const key = url.searchParams.get("pageKey");
  const def = key ? getPageContentDef(key) : undefined;

  try {
    const records = await getAllPageContentRecords();
    if (def) {
      const record = records[def.key];
      const defaultHtml = defaultTemplateHtml(def);
      const editorHtml = record?.isCustom && record.bodyHtml ? record.bodyHtml : defaultHtml;
      return NextResponse.json({
        pages: PAGE_CONTENT_DEFS,
        record,
        editorHtml,
        defaultHtml,
      });
    }
    return NextResponse.json({ pages: PAGE_CONTENT_DEFS, records });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "خطای دیتابیس" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
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

  const key = (body as { pageKey?: unknown }).pageKey;
  const def = typeof key === "string" ? getPageContentDef(key) : undefined;
  if (typeof key !== "string" || !def) {
    return NextResponse.json({ error: "برگه نامعتبر است" }, { status: 400 });
  }

  const input = sanitizePageContentInput(key, body);

  try {
    const pool = getPool();
    if (input.useDefault) {
      await pool.execute<ResultSetHeader>("DELETE FROM page_content WHERE page_key = ?", [key]);
    } else {
      await pool.execute<ResultSetHeader>(
        `INSERT INTO page_content (page_key, body_html) VALUES (?, ?)
         ON DUPLICATE KEY UPDATE body_html = VALUES(body_html)`,
        [key, input.bodyHtml],
      );
    }

    revalidatePath(def.path);
    if (def.key === "home") revalidatePath("/", "layout");

    const record = {
      pageKey: key,
      bodyHtml: input.bodyHtml,
      isCustom: !input.useDefault,
    };

    return NextResponse.json({ ok: true, record });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "ذخیره نشد؛ جدول page_content را در MySQL ساخته‌اید؟" },
      { status: 500 },
    );
  }
}

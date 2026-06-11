import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { getAdminFromCookies } from "@/lib/admin-session";
import {
  assertValidSiteSettings,
  DEFAULT_SITE_SETTINGS,
  getSiteSettings,
  type SiteSettingsConfig,
} from "@/lib/siteSettings";
import type { ResultSetHeader } from "mysql2";

export async function GET() {
  const admin = await getAdminFromCookies();
  if (!admin) {
    return NextResponse.json({ error: "لطفاً وارد شوید" }, { status: 401 });
  }

  try {
    const config = await getSiteSettings();
    return NextResponse.json({
      config,
      defaults: DEFAULT_SITE_SETTINGS,
    } satisfies { config: SiteSettingsConfig; defaults: SiteSettingsConfig });
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

  const cfgIn = (body as { config?: unknown }).config;
  if (cfgIn === undefined) {
    return NextResponse.json({ error: "فیلد config الزامی است" }, { status: 400 });
  }

  let validated: SiteSettingsConfig;
  try {
    validated = assertValidSiteSettings(cfgIn);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "پیکربندی نامعتبر است";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const json = JSON.stringify(validated);

  try {
    const pool = getPool();
    const [upd] = await pool.execute<ResultSetHeader>(
      "UPDATE site_settings_config SET config_json = ? WHERE id = 1",
      [json],
    );
    if (upd.affectedRows === 0) {
      await pool.execute("INSERT INTO site_settings_config (id, config_json) VALUES (1, ?)", [json]);
    }

    revalidatePath("/", "layout");

    return NextResponse.json({ ok: true, config: validated });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "ذخیره نشد؛ جدول site_settings_config را در MySQL ساخته‌اید؟" },
      { status: 500 },
    );
  }
}

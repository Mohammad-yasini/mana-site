import { randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { getAdminFromCookies } from "@/lib/admin-session";

export const runtime = "nodejs";

const MAX_BYTES = 5 * 1024 * 1024;
const MAX_SITE_BYTES = 512 * 1024;
const ALLOWED = new Map<string, string>([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["image/gif", ".gif"],
  ["image/x-icon", ".ico"],
  ["image/vnd.microsoft.icon", ".ico"],
]);

export async function POST(request: Request) {
  const admin = await getAdminFromCookies();
  if (!admin) {
    return NextResponse.json({ error: "لطفاً وارد شوید" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "فرم نامعتبر" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!file || !(file instanceof Blob)) {
    return NextResponse.json({ error: "فایل ارسال نشد" }, { status: 400 });
  }

  const scope = String(formData.get("scope") ?? "blog");
  const isSiteUpload = scope === "site";

  const type = file.type || "";
  const ext = ALLOWED.get(type);
  if (!ext) {
    return NextResponse.json(
      { error: "فقط تصویر jpg، png، webp، gif یا ico مجاز است" },
      { status: 400 },
    );
  }

  const maxBytes = isSiteUpload ? MAX_SITE_BYTES : MAX_BYTES;
  if (file.size > maxBytes) {
    return NextResponse.json(
      { error: isSiteUpload ? "حداکثر حجم favicon ۵۱۲ کیلوبایت" : "حداکثر حجم ۵ مگابایت" },
      { status: 400 },
    );
  }

  const buf = Buffer.from(await file.arrayBuffer());
  const name = `${randomBytes(16).toString("hex")}${ext}`;
  const uploadSubdir = isSiteUpload ? "site" : "blog";
  const relDir = path.join("public", "uploads", uploadSubdir);
  const absDir = path.join(process.cwd(), relDir);
  await mkdir(absDir, { recursive: true });
  const absPath = path.join(absDir, name);
  await writeFile(absPath, buf);

  const url = `/uploads/${uploadSubdir}/${name}`;
  return NextResponse.json({ ok: true, url });
}

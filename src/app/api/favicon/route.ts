import { readFile } from "node:fs/promises";
import { NextResponse } from "next/server";
import {
  faviconMimeType,
  getPublicFaviconPath,
  getSiteSettings,
  resolveFaviconUrl,
} from "@/lib/siteSettings";

export const dynamic = "force-dynamic";

export async function GET() {
  const settings = await getSiteSettings();
  const url = resolveFaviconUrl(settings);

  try {
    const buf = await readFile(getPublicFaviconPath(url));
    const type = faviconMimeType(url) ?? "image/png";
    return new NextResponse(buf, {
      headers: {
        "Content-Type": type,
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      },
    });
  } catch (e) {
    console.error("favicon read failed:", url, e);
    return new NextResponse(null, { status: 404 });
  }
}

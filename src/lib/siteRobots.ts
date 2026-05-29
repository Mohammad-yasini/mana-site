import { getPool } from "@/lib/db";
import { DEFAULT_ROBOTS_TXT } from "@/lib/robotsDefaults";
import type { RowDataPacket } from "mysql2";

export { DEFAULT_ROBOTS_TXT };

const MAX_LEN = 20000;

export function normalizeRobotsContent(raw: string): string {
  return raw.replace(/\r\n/g, "\n").trim().slice(0, MAX_LEN);
}

export function assertValidRobotsContent(input: unknown): string {
  if (typeof input !== "string") throw new Error("محتوای robots.txt باید متن باشد");
  const content = normalizeRobotsContent(input);
  if (!content) throw new Error("محتوای robots.txt نباید خالی باشد");
  if (!/^User-agent:/im.test(content) && !/^Disallow:/im.test(content) && !/^Allow:/im.test(content)) {
    throw new Error("فرمت robots.txt نامعتبر است؛ حداقل یک قانون User-agent یا Allow/Disallow لازم است");
  }
  return content;
}

export async function getRobotsTxtContent(): Promise<string> {
  try {
    const pool = getPool();
    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT content FROM site_robots_config WHERE id = 1 LIMIT 1",
    );
    const row = rows[0];
    if (row?.content != null && String(row.content).trim()) {
      return normalizeRobotsContent(String(row.content));
    }
  } catch {
    /* use default */
  }
  return DEFAULT_ROBOTS_TXT;
}

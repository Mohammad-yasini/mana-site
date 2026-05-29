import { getRobotsTxtContent } from "@/lib/siteRobots";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const content = await getRobotsTxtContent();
  return new Response(`${content}\n`, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}

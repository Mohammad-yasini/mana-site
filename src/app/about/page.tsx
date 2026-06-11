import type { Metadata } from "next";
import { resolvePageMainHtml } from "@/lib/pageContent";
import { metadataForPage } from "@/lib/pageSeo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return metadataForPage("about");
}

export default async function AboutPage() {
  const html = await resolvePageMainHtml("about");
  return <main dangerouslySetInnerHTML={{ __html: html }} />;
}


import type { Metadata } from "next";
import { resolvePageMainHtml } from "@/lib/pageContent";
import { metadataForPage } from "@/lib/pageSeo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return metadataForPage("contact");
}

export default async function ContactPage() {
  const html = await resolvePageMainHtml("contact");
  return <main dangerouslySetInnerHTML={{ __html: html }} />;
}


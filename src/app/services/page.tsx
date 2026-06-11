import type { Metadata } from "next";
import { resolvePageMainHtml } from "@/lib/pageContent";
import { metadataForPage } from "@/lib/pageSeo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return metadataForPage("services");
}

export default async function ServicesPage() {
  const html = await resolvePageMainHtml("services");
  return <main dangerouslySetInnerHTML={{ __html: html }} />;
}


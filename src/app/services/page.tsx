import type { Metadata } from "next";
import { loadTemplateMainHtml } from "@/lib/templateHtml";
import { metadataForPage } from "@/lib/pageSeo";

export async function generateMetadata(): Promise<Metadata> {
  return metadataForPage("services");
}

export default function ServicesPage() {
  const html = loadTemplateMainHtml("services.html");
  return <main dangerouslySetInnerHTML={{ __html: html }} />;
}


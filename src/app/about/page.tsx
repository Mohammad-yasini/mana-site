import type { Metadata } from "next";
import { loadTemplateMainHtml } from "@/lib/templateHtml";
import { metadataForPage } from "@/lib/pageSeo";

export async function generateMetadata(): Promise<Metadata> {
  return metadataForPage("about");
}

export default function AboutPage() {
  const html = loadTemplateMainHtml("about.html");
  return <main dangerouslySetInnerHTML={{ __html: html }} />;
}


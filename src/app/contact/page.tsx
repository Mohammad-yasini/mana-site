import type { Metadata } from "next";
import { loadTemplateMainHtml } from "@/lib/templateHtml";
import { metadataForPage } from "@/lib/pageSeo";

export async function generateMetadata(): Promise<Metadata> {
  return metadataForPage("contact");
}

export default function ContactPage() {
  const html = loadTemplateMainHtml("contact.html");
  return <main dangerouslySetInnerHTML={{ __html: html }} />;
}


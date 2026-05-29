import { loadTemplateMainHtml } from "@/lib/templateHtml";

export default function ServicesPage() {
  const html = loadTemplateMainHtml("services.html");
  return <main dangerouslySetInnerHTML={{ __html: html }} />;
}


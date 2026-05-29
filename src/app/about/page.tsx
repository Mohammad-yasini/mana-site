import { loadTemplateMainHtml } from "@/lib/templateHtml";

export default function AboutPage() {
  const html = loadTemplateMainHtml("about.html");
  return <main dangerouslySetInnerHTML={{ __html: html }} />;
}


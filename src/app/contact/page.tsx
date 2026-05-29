import { loadTemplateMainHtml } from "@/lib/templateHtml";

export default function ContactPage() {
  const html = loadTemplateMainHtml("contact.html");
  return <main dangerouslySetInnerHTML={{ __html: html }} />;
}


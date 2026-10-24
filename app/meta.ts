import type { MetaDescriptor } from "react-router";

export const SITE_NAME = "Nikola Pacek Vetnić";

const SITE_URL = "https://nikolapacekvetnic.rs";

type Page = { title: string; description: string; path: string };

// Title and description for search engines, plus the Open Graph tags that link previews read.
export function getPageMeta({ title, description, path }: Page): MetaDescriptor[] {
  const url = `${SITE_URL}${path}`;

  return [
    { title },
    { name: "description", content: description },
    { tagName: "link", rel: "canonical", href: url },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
  ];
}

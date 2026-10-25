import type { MetaDescriptor } from "react-router";

import { getAppPath, type DesktopApp } from "~/desktop/apps";

export const SITE_NAME = "Nikola Pacek Vetnić";

export const SITE_URL = "https://nikolapacekvetnic.rs";

type Page = {
  title: string;
  description: string;
  path: string;
  // A page with a publishing day (`2026-10-25`) is an article to link previews.
  published?: string;
};

// Title and description for search engines, plus the Open Graph tags that link previews read.
export function getPageMeta({ title, description, path, published }: Page): MetaDescriptor[] {
  const url = `${SITE_URL}${path}`;

  return [
    { title },
    { name: "description", content: description },
    { tagName: "link", rel: "canonical", href: url },
    { property: "og:type", content: published ? "article" : "website" },
    ...(published ? [{ property: "article:published_time", content: published }] : []),
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
  ];
}

// The page of an app itself (`/blog`).
export function getAppMeta(app: DesktopApp): MetaDescriptor[] {
  return getPageMeta({ title: `${app.title} · ${SITE_NAME}`, description: app.description, path: getAppPath(app.id) });
}

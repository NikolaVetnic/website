import { getSitemap } from "~/blog/feeds";
import { getPostPath } from "~/blog/posts";
import { getPosts } from "~/blog/posts.server";
import { APPS, getAppPath } from "~/desktop/apps";
import { SITE_URL } from "~/meta";

// Pre-rendered to /sitemap.xml at build time: the desktop, every app and every post.
export function loader() {
  const sitemap = getSitemap(
    [
      { path: "/" },
      ...APPS.map((app) => ({ path: getAppPath(app.id) })),
      ...getPosts().map((post) => ({ path: getPostPath(post.slug), lastModified: post.date })),
    ],
    SITE_URL,
  );

  return new Response(sitemap, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}

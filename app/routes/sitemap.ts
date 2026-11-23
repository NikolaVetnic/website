import { getSitemap } from "~/blog/feeds";
import { getPostPath } from "~/blog/posts";
import { getPosts } from "~/blog/posts.server";
import { APPS, getAppPath } from "~/desktop/apps";
import { SITE_URL } from "~/meta";
import { getProjectPath } from "~/projects/projects";
import { getProjects } from "~/projects/projects.server";

// Pre-rendered to /sitemap.xml at build time: the desktop, every app, the resume, every post and every project.
export function loader() {
  const sitemap = getSitemap(
    [
      { path: "/" },
      ...APPS.map((app) => ({ path: getAppPath(app.id) })),
      { path: "/about/resume" },
      ...getPosts().map((post) => ({ path: getPostPath(post.slug), lastModified: post.date })),
      ...getProjects().map((project) => ({ path: getProjectPath(project.slug) })),
    ],
    SITE_URL,
  );

  return new Response(sitemap, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}

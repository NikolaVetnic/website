import { getSitemap } from "~/blog/feeds";
import { getPostPath } from "~/blog/posts";
import { getPosts } from "~/blog/posts.server";
import { APPS, getAppPath } from "~/desktop/apps";
import { SITE_URL } from "~/meta";
import { OPEN_SOURCE_PATH } from "~/projects/open-source";
import { getProjectPath } from "~/projects/projects";
import { getProjects } from "~/projects/projects.server";

// Pre-rendered to /sitemap.xml at build time: the desktop, every app, the resume, every post, every project and the open-source contributions.
export function loader() {
  const sitemap = getSitemap(
    [
      { path: "/" },
      ...APPS.map((app) => ({ path: getAppPath(app.id) })),
      { path: "/about/resume" },
      ...getPosts().map((post) => ({ path: getPostPath(post.slug), lastModified: post.date })),
      ...getProjects().map((project) => ({ path: getProjectPath(project.slug) })),
      { path: OPEN_SOURCE_PATH },
    ],
    SITE_URL,
  );

  return new Response(sitemap, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}

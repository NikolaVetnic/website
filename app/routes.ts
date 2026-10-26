import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

import { APPS, getAppPath } from "./desktop/apps";

// One layout draws the desktop for every page, so it stays mounted while the URL moves between apps.
// The Blog has routes of its own, for its post list and for each post, and About for its bio and resume; the
// feed and the sitemap are files. Any other address gets the desktop too, saying there's nothing there.
export default [
  layout("routes/shell.tsx", [
    index("routes/home.tsx"),
    route("blog", "routes/blog.tsx"),
    route("blog/:slug", "routes/blog-post.tsx"),
    route("about", "routes/about.tsx"),
    route("about/resume", "routes/about-resume.tsx"),
    ...APPS.filter((app) => app.id !== "blog" && app.id !== "about").map((app) =>
      route(getAppPath(app.id).slice(1), "routes/app.tsx", { id: `routes/app-${app.id}` }),
    ),
    route("*", "routes/not-found.tsx"),
  ]),
  route("rss.xml", "routes/rss.ts"),
  route("sitemap.xml", "routes/sitemap.ts"),
] satisfies RouteConfig;

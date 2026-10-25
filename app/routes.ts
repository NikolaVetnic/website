import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

import { APPS } from "./desktop/apps";

// One layout draws the desktop for every page, so it stays mounted while the URL moves between apps.
// The Blog has routes of its own, for its post list and for each post; its feed and the sitemap are files.
export default [
  layout("routes/shell.tsx", [
    index("routes/home.tsx"),
    route("blog", "routes/blog.tsx"),
    route("blog/:slug", "routes/blog-post.tsx"),
    ...APPS.filter((app) => app.id !== "blog").map((app) =>
      route(app.id, "routes/app.tsx", { id: `routes/app-${app.id}` }),
    ),
  ]),
  route("rss.xml", "routes/rss.ts"),
  route("sitemap.xml", "routes/sitemap.ts"),
] satisfies RouteConfig;

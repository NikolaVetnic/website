import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

import { APPS, getAppPath } from "./desktop/apps";

// One layout draws the desktop for every page, so it stays mounted while the URL moves between apps.
// The Blog has routes of its own, for its post list and for each post, Projects for its cards and for each
// project, Music for its tabs and for each entry, About for its bio and resume, and the small games in the Games
// folder for their pages; the
// feed, the sitemap and the Blog's search index are files. Any other address gets the desktop too, saying
// there's nothing there.
export default [
  layout("routes/shell.tsx", [
    index("routes/home.tsx"),
    route("blog", "routes/blog.tsx"),
    route("blog/:slug", "routes/blog-post.tsx"),
    route("about", "routes/about.tsx"),
    route("about/resume", "routes/about-resume.tsx"),
    route("projects", "routes/projects.tsx"),
    route("projects/open-source", "routes/projects-open-source.tsx"),
    route("projects/:slug", "routes/project.tsx"),
    route("music", "routes/music.tsx"),
    route("music/bands", "routes/music-bands.tsx"),
    route("music/soundtracks", "routes/music-soundtracks.tsx"),
    route("music/:slug", "routes/music-entry.tsx"),
    route("games/:slug", "routes/game.tsx"),
    ...APPS.filter((app) => !["blog", "about", "projects", "music"].includes(app.id) && !app.content).map((app) =>
      route(getAppPath(app.id).slice(1), "routes/app.tsx", { id: `routes/app-${app.id}` }),
    ),
    route("*", "routes/not-found.tsx"),
  ]),
  route("rss.xml", "routes/rss.ts"),
  route("blog/search.json", "routes/blog-search.ts"),
  route("sitemap.xml", "routes/sitemap.ts"),
] satisfies RouteConfig;

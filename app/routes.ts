import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

import { APPS } from "./desktop/apps";

// One layout draws the desktop for every page, so it stays mounted while the URL moves between apps.
export default [
  layout("routes/shell.tsx", [
    index("routes/home.tsx"),
    ...APPS.map((app) => route(app.id, "routes/app.tsx", { id: `routes/app-${app.id}` })),
  ]),
] satisfies RouteConfig;

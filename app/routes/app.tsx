import { getApp, getAppFromPath, getAppPath, type AppId } from "~/desktop/apps";
import { SITE_NAME, getPageMeta } from "~/meta";
import type { Route } from "./+types/app";

// Only app paths reach this route (see routes.ts).
export const meta: Route.MetaFunction = ({ location }) => {
  const app = getApp(getAppFromPath(location.pathname) as AppId);

  return getPageMeta({ title: `${app.title} · ${SITE_NAME}`, description: app.description, path: getAppPath(app.id) });
};

// The layout route draws the page and opens the window; this route only gives it its meta tags.
export default function AppPage() {
  return null;
}

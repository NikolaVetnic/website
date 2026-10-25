import { getApp, getAppFromPath, type AppId } from "~/desktop/apps";
import { getAppMeta } from "~/meta";
import type { Route } from "./+types/app";

// Only app paths reach this route (see routes.ts).
export const meta: Route.MetaFunction = ({ location }) =>
  getAppMeta(getApp(getAppFromPath(location.pathname) as AppId));

// The layout route draws the page and opens the window; this route only gives it its meta tags.
export default function AppPage() {
  return null;
}

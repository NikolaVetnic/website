import { SITE_NAME } from "~/meta";
import type { Route } from "./+types/not-found";

// An address the site doesn't have. The host serves the SPA fallback for it, whose body is empty; waiting for a
// client loader keeps the first render empty too, so hydration matches, and the desktop draws after it.
export function clientLoader() {
  return { notFound: true as const };
}

export const meta: Route.MetaFunction = () => [
  { title: `Not found · ${SITE_NAME}` },
  { name: "robots", content: "noindex" },
];

// The layout route draws the desktop and says there's nothing here; this route only gives it its meta tags.
export default function NotFoundPage() {
  return null;
}

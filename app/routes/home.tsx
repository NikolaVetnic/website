import { SITE_NAME, getPageMeta } from "~/meta";
import type { Route } from "./+types/home";

export const meta: Route.MetaFunction = () =>
  getPageMeta({
    title: SITE_NAME,
    description: "Software developer, game developer and musician. Projects, music and a blog.",
    path: "/",
  });

// The layout route draws the page; this route only gives it its meta tags.
export default function Home() {
  return null;
}

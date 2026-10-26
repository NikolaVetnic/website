import type { AboutData } from "~/about/about";
import { getAboutVersions } from "~/about/about.server";
import { getApp } from "~/desktop/apps";
import { getAppMeta } from "~/meta";
import type { Route } from "./+types/about";

// Runs at build time; the About window shows the bio in every language it's written in (see About.tsx).
export function loader(): AboutData {
  return { page: "bio", versions: getAboutVersions("bio") };
}

export const meta: Route.MetaFunction = () => getAppMeta(getApp("about"));

export default function AboutPage() {
  return null;
}

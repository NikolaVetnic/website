import type { AboutData } from "~/about/about";
import { getAboutPage } from "~/about/about.server";
import { getApp } from "~/desktop/apps";
import { getAppMeta } from "~/meta";
import type { Route } from "./+types/about";

// Runs at build time; the About window shows the bio in both languages (see About.tsx).
export function loader(): AboutData {
  return { page: "bio", bio: getAboutPage("bio"), bioSr: getAboutPage("bio-sr") };
}

export const meta: Route.MetaFunction = () => getAppMeta(getApp("about"));

export default function AboutPage() {
  return null;
}

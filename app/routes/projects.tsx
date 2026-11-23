import { getApp } from "~/desktop/apps";
import { getAppMeta } from "~/meta";
import { toProjectSummary } from "~/projects/projects";
import { getProjects } from "~/projects/projects.server";
import type { Route } from "./+types/projects";

// Runs at build time; the Projects window shows the cards (see Projects.tsx).
export function loader() {
  return { projects: getProjects().map(toProjectSummary) };
}

export const meta: Route.MetaFunction = () => getAppMeta(getApp("projects"));

export default function ProjectsPage() {
  return null;
}

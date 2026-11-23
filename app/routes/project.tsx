import { data } from "react-router";

import { SITE_NAME, getPageMeta } from "~/meta";
import { getProjectPath } from "~/projects/projects";
import { getProjects } from "~/projects/projects.server";
import type { Route } from "./+types/project";

// Runs at build time for every project (see react-router.config.ts); the Projects window shows it.
export function loader({ params }: Route.LoaderArgs) {
  const project = getProjects().find((entry) => entry.slug === params.slug);
  if (!project) {
    throw data(null, { status: 404 });
  }

  return { project };
}

// In the browser, a project that wasn't pre-rendered has no data file. Say so in the Projects window rather than
// replacing the whole desktop with an error page.
export async function clientLoader({ serverLoader }: Route.ClientLoaderArgs) {
  try {
    return await serverLoader();
  } catch {
    return { missing: true as const };
  }
}

export const meta: Route.MetaFunction = ({ loaderData }) => {
  if (!loaderData || !("project" in loaderData)) {
    return [{ title: `Project not found · ${SITE_NAME}` }];
  }

  const { project } = loaderData;

  return getPageMeta({
    title: `${project.title} · ${SITE_NAME}`,
    description: project.summary,
    path: getProjectPath(project.slug),
  });
};

export default function ProjectPage() {
  return null;
}

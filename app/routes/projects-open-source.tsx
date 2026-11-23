import { SITE_NAME, getPageMeta } from "~/meta";
import { OPEN_SOURCE_PATH } from "~/projects/open-source";
import { getOpenSource } from "~/projects/open-source.server";
import type { Route } from "./+types/projects-open-source";

// Runs at build time; the Projects window shows the contributions on its Open source tab (see Projects.tsx).
export function loader() {
  return { openSource: getOpenSource() };
}

export const meta: Route.MetaFunction = () =>
  getPageMeta({
    title: `Open source · ${SITE_NAME}`,
    description: `Open-source contributions by ${SITE_NAME}.`,
    path: OPEN_SOURCE_PATH,
  });

export default function OpenSourcePage() {
  return null;
}

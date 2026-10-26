import type { AboutData } from "~/about/about";
import { getAboutPage } from "~/about/about.server";
import { SITE_NAME, getPageMeta } from "~/meta";
import type { Route } from "./+types/about-resume";

// Runs at build time; the About window shows the resume (see About.tsx).
export function loader(): AboutData {
  return { page: "resume", resume: getAboutPage("resume") };
}

export const meta: Route.MetaFunction = () =>
  getPageMeta({
    title: `Resume · ${SITE_NAME}`,
    description: "Resume of Nikola Pacek Vetnić: experience, internships, projects, skills and education.",
    path: "/about/resume",
  });

export default function AboutResumePage() {
  return null;
}

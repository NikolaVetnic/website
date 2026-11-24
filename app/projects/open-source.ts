export const OPEN_SOURCE_PATH = "/projects/open-source";

export type Contribution = {
  // What it did, in a sentence.
  summary: string;
  // The day it was merged, `2026-11-11`.
  date: string;
  // Its pull or merge request.
  link: string;
};

export type UpstreamProject = {
  name: string;
  about: string;
  url: string;
  // The newest first.
  contributions: Contribution[];
};

// A contribution's link as it reads: "MR 5762" on GitLab, "PR 1805" on GitHub, else "Link".
export function getLinkLabel(link: string): string {
  const request = /\/(pull|merge_requests)\/(\d+)\/?$/.exec(new URL(link).pathname);
  if (!request) return "Link";
  return `${request[1] === "pull" ? "PR" : "MR"} ${request[2]}`;
}

// Fixed locale and time zone, so the month reads the same in the pre-rendered page and in every browser.
const monthFormat = new Intl.DateTimeFormat("en-GB", { month: "short", year: "numeric", timeZone: "UTC" });

export function formatContributionDate(date: string): string {
  return monthFormat.format(new Date(`${date}T00:00:00Z`));
}

// "3 merged contributions to 2 projects".
export function describeContributions(projects: UpstreamProject[]): string {
  const count = projects.reduce((sum, project) => sum + project.contributions.length, 0);
  const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;
  return `${plural(count, "merged contribution")} to ${plural(projects.length, "project")}`;
}

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import { parse as parseYaml } from "yaml";

import { isText } from "../content/markdown.server";
import type { Contribution, UpstreamProject } from "./open-source";

// Read at build time only.
const OPEN_SOURCE_FILE = path.resolve("content/open-source.yml");

const DATE = /^\d{4}-\d{2}-\d{2}$/;

function isLink(value: unknown): value is string {
  return isText(value) && /^https:\/\//.test(value);
}

// The open-source contributions, each upstream project once, the most recently contributed to first, and its
// contributions newest first. Anything missing or malformed throws, so the build fails saying where.
export function parseOpenSource(source: string): UpstreamProject[] {
  const fail = (where: string, problem: string) => new Error(`content/open-source.yml, ${where}: ${problem}`);

  const data: unknown = parseYaml(source) ?? [];
  if (!Array.isArray(data)) {
    throw fail("top", "must be a list of projects");
  }

  const projects = data.map((entry: Record<string, unknown>, index): UpstreamProject => {
    const where = isText(entry?.project) ? `"${entry.project}"` : `project ${index + 1}`;
    if (!isText(entry?.project)) throw fail(where, "`project` missing (its name)");
    if (!isText(entry.about)) throw fail(where, "`about` missing (what it is, in a sentence)");
    if (!isLink(entry.url)) throw fail(where, "`url` must be an https:// link");
    if (!Array.isArray(entry.contributions) || entry.contributions.length === 0) {
      throw fail(where, "`contributions` must be a list");
    }

    const contributions = entry.contributions.map((item: Record<string, unknown>, number): Contribution => {
      const at = `${where}, contribution ${number + 1}`;
      // YAML may read an unquoted date as a date rather than text.
      const date = item?.date instanceof Date ? item.date.toISOString().slice(0, 10) : item?.date;
      if (!isText(item?.summary)) throw fail(at, "`summary` missing");
      if (typeof date !== "string" || !DATE.test(date) || Number.isNaN(Date.parse(date))) {
        throw fail(at, "`date` must be the day it was merged, YYYY-MM-DD");
      }
      if (!isLink(item.link)) throw fail(at, "`link` must be an https:// link to the pull or merge request");
      return { summary: item.summary, date, link: item.link };
    });

    return {
      name: entry.project,
      about: entry.about,
      url: entry.url,
      contributions: contributions.sort((a, b) => b.date.localeCompare(a.date)),
    };
  });

  const names = projects.map((project) => project.name);
  const repeated = names.find((name, index) => names.indexOf(name) !== index);
  if (repeated) {
    throw fail(`"${repeated}"`, "listed twice; put all its contributions under one entry");
  }

  return projects.sort(
    (a, b) => b.contributions[0].date.localeCompare(a.contributions[0].date) || a.name.localeCompare(b.name),
  );
}

export function getOpenSource(file = OPEN_SOURCE_FILE): UpstreamProject[] {
  return existsSync(file) ? parseOpenSource(readFileSync(file, "utf8")) : [];
}

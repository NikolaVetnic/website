import { describe, expect, it } from "vitest";

import { describeContributions, formatContributionDate, getLinkLabel } from "./open-source";
import { getOpenSource, parseOpenSource } from "./open-source.server";

const entry = (project: string, dates: string[]) =>
  [
    `- project: ${project}`,
    "  about: A thing.",
    "  url: https://example.com/",
    "  contributions:",
    ...dates.flatMap((date, index) => [
      `    - summary: Change ${index + 1}.`,
      `      date: ${date}`,
      `      link: https://github.com/example/${project}/pull/${index + 1}`,
    ]),
  ].join("\n");

describe("parseOpenSource", () => {
  it("puts the most recent project and contribution first", () => {
    const projects = parseOpenSource(
      [entry("old", ["2026-10-27"]), entry("new", ["2026-11-11", "2026-11-22"])].join("\n"),
    );

    expect(projects.map((project) => project.name)).toEqual(["new", "old"]);
    expect(projects[0].contributions.map((contribution) => contribution.date)).toEqual(["2026-11-22", "2026-11-11"]);
    expect(projects[0]).toMatchObject({ about: "A thing.", url: "https://example.com/" });
  });

  it("refuses entries with missing or malformed fields, saying where", () => {
    const valid = entry("a", ["2026-11-11"]);
    expect(() => parseOpenSource("project: a")).toThrow(/a list of projects/);
    expect(() => parseOpenSource(valid.replace("  about: A thing.\n", ""))).toThrow(/"a": `about` missing/);
    expect(() => parseOpenSource(valid.replace("https://example.com/", "example.com"))).toThrow(/`url`/);
    expect(() => parseOpenSource(valid.replace("2026-11-11", "11.11.2026"))).toThrow(/"a", contribution 1: `date`/);
    expect(() => parseOpenSource(valid.replace("https://github.com", "http://github.com"))).toThrow(/`link`/);
    expect(() => parseOpenSource(`${valid}\n${entry("a", ["2026-10-01"])}`)).toThrow(/listed twice/);
  });

  it("reads the site's own file", () => {
    expect(getOpenSource().length).toBeGreaterThan(0);
  });
});

describe("open source text", () => {
  it("names a pull or merge request by its number", () => {
    expect(getLinkLabel("https://github.com/testcontainers/testcontainers-dotnet/pull/1805")).toBe("PR 1805");
    expect(getLinkLabel("https://gitlab.com/OpenMW/openmw/-/merge_requests/5762")).toBe("MR 5762");
    expect(getLinkLabel("https://example.com/patch")).toBe("Link");
  });

  it("writes the month and the totals", () => {
    expect(formatContributionDate("2026-11-22")).toBe("Nov 2026");
    const one = parseOpenSource(entry("a", ["2026-11-11"]));
    expect(describeContributions(one)).toBe("1 merged contribution to 1 project");
    expect(describeContributions(parseOpenSource(entry("a", ["2026-11-11", "2026-11-12"])))).toBe(
      "2 merged contributions to 1 project",
    );
  });
});

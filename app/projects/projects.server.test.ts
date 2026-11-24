import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import { afterAll, describe, expect, it } from "vitest";

import { getProjectPath, toProjectSummary } from "./projects";
import { getProjects, parseProject } from "./projects.server";

const project = (front: string, body = "About it.") => `---\n${front}\n---\n${body}\n`;
const valid = [
  "title: Voxel ray tracer",
  "summary: Ray tracing voxel worlds.",
  "years: 2020–2021",
  "status: finished",
  "tech: [Java, JavaFX]",
  "repo: https://github.com/example/rt",
].join("\n");

describe("parseProject", () => {
  it("reads the front matter and renders the Markdown", () => {
    const parsed = parseProject("voxel-ray-tracer", project(valid, "## How\n\nWith *octrees*."));

    expect(toProjectSummary(parsed)).toEqual({
      slug: "voxel-ray-tracer",
      title: "Voxel ray tracer",
      summary: "Ray tracing voxel worlds.",
      years: "2020–2021",
      status: "finished",
      tech: ["Java", "JavaFX"],
      repo: "https://github.com/example/rt",
    });
    expect(parsed.html).toBe("<h2>How</h2>\n<p>With <em>octrees</em>.</p>\n");
    expect(getProjectPath(parsed.slug)).toBe("/projects/voxel-ray-tracer");
  });

  it("takes a single year written as a number", () => {
    expect(parseProject("a", project(valid.replace("2020–2021", "2026"))).years).toBe("2026");
  });

  it("refuses projects with missing or malformed fields", () => {
    const without = (field: string) => valid.replace(new RegExp(`^${field}:.*$`, "m"), "");
    expect(() => parseProject("a", "No front matter")).toThrow(/front matter missing/);
    expect(() => parseProject("a", project(without("title")))).toThrow(/`title` missing/);
    expect(() => parseProject("a", project(without("summary")))).toThrow(/`summary` missing/);
    expect(() => parseProject("a", project(valid.replace("2020–2021", "2020-2021")))).toThrow(/`years`/);
    expect(() => parseProject("a", project(valid.replace("finished", "done")))).toThrow(/`status`/);
    expect(() => parseProject("a", project(valid.replace("[Java, JavaFX]", "Java")))).toThrow(/`tech`/);
    expect(() => parseProject("a", project(valid.replace("[Java, JavaFX]", "[]")))).toThrow(/`tech`/);
    expect(() => parseProject("a", project(valid.replace("https://", "http://")))).toThrow(/`repo`/);
    expect(() => parseProject("Voxel Tracer", project(valid))).toThrow(/file name/);
    expect(() => parseProject("open-source", project(valid))).toThrow(/taken/);
  });
});

describe("projects on disk", () => {
  const root = mkdtempSync(path.join(tmpdir(), "projects-"));
  const dir = path.join(root, "content");
  const publicDir = path.join(root, "public");
  mkdirSync(dir);
  mkdirSync(path.join(publicDir, "projects/rt"), { recursive: true });
  writeFileSync(path.join(publicDir, "projects/rt/card.webp"), "");
  writeFileSync(path.join(publicDir, "projects/rt/render.webp"), "");
  afterAll(() => rmSync(root, { recursive: true }));

  it("checks the card image and the images in the text", () => {
    const withImage = `${valid}\nimage: card.webp`;
    expect(parseProject("rt", project(withImage), publicDir).image).toBe("/projects/rt/card.webp");
    expect(parseProject("rt", project(valid, "![A render](render.webp)"), publicDir).html).toContain(
      'src="/projects/rt/render.webp"',
    );
    expect(() => parseProject("rt", project(`${valid}\nimage: missing.webp`), publicDir)).toThrow(/not found/);
    expect(() => parseProject("rt", project(`${valid}\nimage: ../x.webp`), publicDir)).toThrow(/`image`/);
    expect(() => parseProject("rt", project(valid, "![A render](gone.webp)"), publicDir)).toThrow(/not found/);
  });

  it("lists the most recent first, then by title", () => {
    writeFileSync(path.join(dir, "old.md"), project(valid.replace("Voxel ray tracer", "Old")));
    writeFileSync(path.join(dir, "b.md"), project(valid.replace("2020–2021", "2026").replace("Voxel ray tracer", "B")));
    writeFileSync(path.join(dir, "a.md"), project(valid.replace("2020–2021", "2026").replace("Voxel ray tracer", "A")));
    writeFileSync(path.join(dir, "notes.txt"), "not a project");

    expect(getProjects(dir, publicDir).map((entry) => entry.title)).toEqual(["A", "B", "Old"]);
  });
});

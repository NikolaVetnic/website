import { describe, expect, it } from "vitest";

import { renderMarkdown, splitFrontMatter } from "./markdown.server";

const render = (body: string) => renderMarkdown(body, { imageBase: "/", fail: (problem) => new Error(problem) });

describe("renderMarkdown", () => {
  it("keeps a mermaid block's source for the browser to draw", () => {
    expect(render("```mermaid\nflowchart LR\n  a[A & B] --> b\n```")).toBe(
      '<figure class="prose-diagram"><pre class="prose-diagram__source">flowchart LR\n  a[A &amp; B] --&gt; b</pre></figure>\n',
    );
  });

  it("leaves other code blocks as code", () => {
    expect(render("```text\na --> b\n```")).toBe('<pre><code class="language-text">a --&gt; b\n</code></pre>\n');
  });
});

describe("splitFrontMatter", () => {
  it("says which file has front matter YAML can't read", () => {
    const fail = (problem: string) => new Error(`Project "x": ${problem}`);
    expect(() => splitFrontMatter("---\nsummary: It is: broken\n---\nText", fail)).toThrow(
      /^Project "x": front matter isn't valid YAML/,
    );
  });
});

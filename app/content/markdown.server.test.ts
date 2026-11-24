import { describe, expect, it } from "vitest";

import { renderMarkdown, splitFrontMatter } from "./markdown.server";

const render = (body: string) => renderMarkdown(body, { imageBase: "/", fail: (problem) => new Error(problem) });

describe("renderMarkdown", () => {
  it("folds a song's lyrics under its title, stanza by stanza", () => {
    expect(render("```lyrics Last Summer\n[CHORUS]\nLast summer <ere>\nwe parted\n\nGodspeed...\n```")).toBe(
      '<details class="prose-lyrics"><summary>Last Summer</summary><p><span class="prose-lyrics__part">CHORUS</span>Last summer &lt;ere&gt;<br>we parted</p><p>Godspeed...</p></details>\n',
    );
  });

  it("keeps a mermaid block's source for the browser to draw", () => {
    expect(render("```mermaid\nflowchart LR\n  a[A & B] --> b\n```")).toBe(
      '<figure class="prose-diagram"><pre class="prose-diagram__source">flowchart LR\n  a[A &amp; B] --&gt; b</pre></figure>\n',
    );
  });

  it("leaves other code blocks as code", () => {
    expect(render("```text\na --> b\n```")).toBe('<pre><code class="language-text">a --&gt; b\n</code></pre>\n');
  });

  it("writes a player on a line of its own as a button that loads it, with its caption", () => {
    const html = render('![Divide ut Regnes](bandcamp:album/1622045203 "Self-released, 2019")');
    expect(html).toMatch(
      /^<figure class="prose-player prose-player--bandcamp" data-player="bandcamp:album\/1622045203">/,
    );
    expect(html).toContain('aria-label="Play Divide ut Regnes (loads Bandcamp\'s player)"');
    expect(html).toContain("<figcaption>Self-released, 2019</figcaption>");
    expect(html).not.toContain("<img");
  });

  it("refuses a player that isn't well written", () => {
    expect(() => render("![Psalm](soundcloud:tracks/876670129)")).toThrow(
      /player "soundcloud:tracks\/876670129" isn't one/,
    );
  });

  it("refuses a player in the middle of a paragraph", () => {
    expect(() => render("Listen: ![Psalm](soundcloud:track/876670129)")).toThrow(/must be on a line of its own/);
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

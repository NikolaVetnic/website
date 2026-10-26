import { existsSync } from "node:fs";
import path from "node:path";

import { Marked, Renderer, type Tokens } from "marked";
import { parse as parseYaml } from "yaml";

// Read at build time only: loaders and the pre-render list run in Node, so none of this reaches the browser.
// Where the site's static files are, so the images in content can be checked before the build ships it.
export const PUBLIC_DIR = path.resolve("public");

const FRONT_MATTER = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/;

// Only used to resolve image paths; any origin would do.
const SITE = "https://site.invalid";

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

const markdown = new Marked({
  renderer: {
    // Links out of the site open in a new tab, so the desktop stays where it was.
    link(token) {
      const html = Renderer.prototype.link.call(this, token);
      return /^https?:\/\//.test(token.href)
        ? html.replace(/^<a /, '<a target="_blank" rel="noopener noreferrer" ')
        : html;
    },
    // Images load as the reader scrolls to them.
    image(token) {
      return Renderer.prototype.image.call(this, token).replace(/^<img /, '<img loading="lazy" decoding="async" ');
    },
    // An image on a line of its own is a figure, and its title the caption under it.
    paragraph({ tokens }) {
      const [image] = tokens;
      if (tokens.length !== 1 || image.type !== "image") {
        return false;
      }

      const { title } = image as Tokens.Image;
      const img = this.parser.parseInline([{ ...image, title: null } as Tokens.Image]);
      const caption = title ? `<figcaption>${escapeHtml(title)}</figcaption>` : "";
      return `<figure>${img}${caption}</figure>\n`;
    },
  },
});

export function isText(value: unknown): value is string {
  return typeof value === "string" && value.trim() !== "";
}

// The YAML front matter between `---` lines at the top, and the Markdown after it.
export function splitFrontMatter(source: string, fail: (problem: string) => Error) {
  const match = FRONT_MATTER.exec(source);
  if (!match) {
    throw fail("front matter missing (a `---` block at the top)");
  }

  return {
    data: (parseYaml(match[1]) ?? {}) as Record<string, unknown>,
    body: source.slice(match[0].length),
  };
}

type RenderOptions = {
  // The folder the content's own images are written relative to (`/blog/<slug>/`).
  imageBase: string;
  publicDir?: string;
  fail: (problem: string) => Error;
};

// Markdown to HTML. An image written by file name (`photo.jpg`) is in `public/` under `imageBase`; paths from
// the site root stay as they are. A local image that isn't there throws, so the build fails instead of
// shipping a broken page. Images elsewhere on the web are left alone.
export function renderMarkdown(body: string, { imageBase, publicDir = PUBLIC_DIR, fail }: RenderOptions): string {
  const tokens = markdown.lexer(body);
  markdown.walkTokens(tokens, (token) => {
    if (token.type !== "image") {
      return;
    }

    const image = token as Tokens.Image;
    const url = new URL(image.href, `${SITE}${imageBase}`);
    if (url.origin !== SITE) {
      return;
    }

    const file = decodeURIComponent(url.pathname);
    if (!existsSync(path.join(publicDir, file))) {
      throw fail(`image "${image.href}" not found (looked for public${file})`);
    }
    image.href = url.pathname + url.search + url.hash;
  });

  return markdown.parser(tokens);
}

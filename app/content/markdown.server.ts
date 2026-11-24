import { existsSync } from "node:fs";
import path from "node:path";

import { Marked, Renderer, type Tokens } from "marked";
import { parse as parseYaml } from "yaml";

import { getPlayerVariant, isPlayerReference, parsePlayer, PLAYER_SERVICES } from "./players";

// Read at build time only: loaders and the pre-render list run in Node, so none of this reaches the browser.
// Where the site's static files are, so the images in content can be checked before the build ships it.
export const PUBLIC_DIR = path.resolve("public");

const FRONT_MATTER = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/;

// Only used to resolve image paths; any origin would do.
const SITE = "https://site.invalid";

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// What a player shows until it's pressed: its name, and whose player it loads.
function renderPlayerButton(name: string, service: string): string {
  const label = escapeHtml(name || "Play");
  return `<button type="button" class="prose-player__start" aria-label="Play ${label} (loads ${service}'s player)"><span class="prose-player__icon" aria-hidden="true"></span><span class="prose-player__text"><span class="prose-player__name">${label}</span><span class="prose-player__service">Plays from ${service}</span></span></button>`;
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
    // A ```mermaid block is a diagram: its source, kept for the browser to draw (see Prose.tsx).
    code(token) {
      if (token.lang !== "mermaid") {
        return false;
      }
      return `<figure class="prose-diagram"><pre class="prose-diagram__source">${escapeHtml(token.text)}</pre></figure>\n`;
    },
    // Images load as the reader scrolls to them.
    image(token) {
      return Renderer.prototype.image.call(this, token).replace(/^<img /, '<img loading="lazy" decoding="async" ');
    },
    // An image on a line of its own is a figure, and its title the caption under it. A player is written the same
    // way, and becomes a button that loads it (see players.ts).
    paragraph({ tokens }) {
      const [image] = tokens;
      if (tokens.length !== 1 || image.type !== "image") {
        return false;
      }

      const { href, text, title } = image as Tokens.Image;
      const caption = title ? `<figcaption>${escapeHtml(title)}</figcaption>` : "";
      const player = parsePlayer(href);
      if (player) {
        return `<figure class="prose-player prose-player--${getPlayerVariant(player)}" data-player="${escapeHtml(href)}">${renderPlayerButton(text, PLAYER_SERVICES[player.service])}${caption}</figure>\n`;
      }

      const img = this.parser.parseInline([{ ...image, title: null } as Tokens.Image]);
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

  let data: Record<string, unknown>;
  try {
    data = (parseYaml(match[1]) ?? {}) as Record<string, unknown>;
  } catch (error) {
    // A value with ": " in it, unquoted, is the usual cause.
    throw fail(`front matter isn't valid YAML (${error instanceof Error ? error.message.split("\n")[0] : error})`);
  }

  return { data, body: source.slice(match[0].length) };
}

type RenderOptions = {
  // The folder the content's own images are written relative to (`/blog/<slug>/`).
  imageBase: string;
  publicDir?: string;
  fail: (problem: string) => Error;
};

// Markdown to HTML. An image written by file name (`photo.jpg`) is in `public/` under `imageBase`; paths from
// the site root stay as they are. A local image that isn't there throws, so the build fails instead of
// shipping a broken page. Images elsewhere on the web are left alone. A player that isn't well written, or shares
// its line with other text, throws too.
export function renderMarkdown(body: string, { imageBase, publicDir = PUBLIC_DIR, fail }: RenderOptions): string {
  const tokens = markdown.lexer(body);
  // Players stand on lines of their own; their paragraphs come before them in the walk.
  const players = new Set<Tokens.Image>();
  markdown.walkTokens(tokens, (token) => {
    if (token.type === "paragraph") {
      const [image] = (token as Tokens.Paragraph).tokens;
      if ((token as Tokens.Paragraph).tokens.length === 1 && image.type === "image") {
        players.add(image as Tokens.Image);
      }
      return;
    }
    if (token.type !== "image") {
      return;
    }

    const image = token as Tokens.Image;
    if (isPlayerReference(image.href)) {
      if (!parsePlayer(image.href)) {
        throw fail(
          `player "${image.href}" isn't one (bandcamp:album/<id>, bandcamp:track/<id>, soundcloud:track/<id>, soundcloud:playlist/<id> or youtube:<id>, optionally ?t=<seconds>)`,
        );
      }
      if (!players.has(image)) {
        throw fail(`player "${image.href}" must be on a line of its own`);
      }
      return;
    }

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

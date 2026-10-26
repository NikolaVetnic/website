// Imports the posts of the old WordPress site as Markdown in content/blog, with their images in public/blog, and
// the pages listed in PAGES into the apps' folders in content/. It reads WordPress's public REST API, so it needs
// no login, and it overwrites what it wrote before, so it can be run again until the old site goes offline. Run
// with `npm run import:wordpress`.
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import TurndownService from "turndown";
import { Document, type YAMLSeq } from "yaml";

const SITE = "https://nikolapacekvetnic.rs";
const API = `${SITE}/?rest_route=/wp/v2`;

// Images WordPress shows from another host though it has a copy of its own.
const IMAGE_COPIES: Record<string, string> = {
  "https://qph.fs.quoracdn.net/main-qimg-fd9f8d4c4a8c1a857c0523c6d32d9c4d": `${SITE}/wp-content/uploads/2020/08/main-qimg-fd9f8d4c4a8c1a857c0523c6d32d9c4d.jpg`,
};

type WordPressPost = {
  id: number;
  date: string;
  slug: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  categories: number[];
};
type WordPressPage = { id: number; content: { rendered: string } };
type WordPressMedia = {
  id: number;
  source_url: string;
  media_details?: { sizes?: Record<string, { width: number; source_url: string }> };
};
type WordPressCategory = { id: number; name: string };

type Page = {
  id: number;
  // Where the Markdown goes in content/, and the new address of the page.
  file: string;
  path: string;
  title: string;
  lang?: string;
  // Old navigation left out of the page, as HTML.
  drop?: RegExp[];
  // Front matter taken out of the page's HTML: the first group of the pattern.
  fields?: Record<string, RegExp>;
};

// The pages imported so far, for the apps that show them.
const PAGES: Page[] = [
  {
    id: 7,
    file: "about/bio",
    path: "/about",
    title: "Bio",
    drop: [/<p[^>]*>\[ <a href="\?page_id=7">english[\s\S]*?<\/p>/],
  },
  {
    id: 1072,
    file: "about/bio-sr",
    path: "/about",
    title: "Biografija",
    lang: "sr",
    drop: [/<p[^>]*>\[ <a href="\?page_id=7">english[\s\S]*?<\/p>/],
  },
  {
    id: 1508,
    file: "about/resume",
    path: "/about/resume",
    title: "Resume",
    drop: [/<p[^>]*><a [^>]*>\[ download the resume as PDF \]<\/a><\/p>/],
    fields: { pdf: /<a href="([^"]+)"[^>]*>\[ download the resume as PDF \]<\/a>/ },
  },
];

// Every page of a collection; WordPress gives at most 100 items per request.
async function fetchAll<T>(collection: string): Promise<T[]> {
  const items: T[] = [];
  for (let page = 1, pages = 1; page <= pages; page++) {
    const response = await fetch(`${API}/${collection}&per_page=100&page=${page}`);
    if (!response.ok) {
      throw new Error(`${collection}, page ${page}: HTTP ${response.status}`);
    }
    pages = Number(response.headers.get("x-wp-totalpages") ?? 1);
    items.push(...((await response.json()) as T[]));
  }
  return items;
}

const ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  hellip: "…",
  ndash: "–",
  mdash: "—",
};

function toText(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&#(x?)([0-9a-f]+);/gi, (_, hex: string, code: string) =>
      String.fromCodePoint(parseInt(code, hex ? 16 : 10)),
    )
    .replace(/&([a-z]+);/gi, (entity, name: string) => ENTITIES[name.toLowerCase()] ?? entity)
    .replace(/\s+/g, " ")
    .replace(/ ([.,;:!?])/g, "$1")
    .trim();
}

// WordPress makes slugs from titles in any script; ours are lowercase Latin letters and digits.
function toSlug(wordPressSlug: string): string {
  return decodeURIComponent(wordPressSlug)
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// The excerpt WordPress cuts after 55 words, shortened to whole sentences.
function toSummary(excerpt: string): string {
  const text = toText(excerpt).replace(/\s*(\[…\]|…|Continue reading.*)$/, "");
  let summary = "";
  for (const sentence of text.match(/[^.!?]+[.!?]+(\s|$)|[^.!?]+$/g) ?? [text]) {
    if (summary.length >= 80) {
      break;
    }
    summary += sentence;
  }
  summary = summary.trim();
  return summary.length > 240 ? `${summary.slice(0, summary.lastIndexOf(" ", 237))}…` : summary;
}

function toFileName(url: string): string {
  return path
    .basename(new URL(url).pathname)
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-");
}

function fence(code: string, language: string): string {
  const ticks = "`".repeat(Math.max(3, ...(code.match(/`+/g) ?? []).map((run) => run.length + 1)));
  return `\n\n${ticks}${language}\n${code.replace(/\n$/, "")}\n${ticks}\n\n`;
}

// Where links to other posts and pages of the old site now go.
type Links = { posts: Map<number, string>; pages: Map<number, string> };

function convert(html: string, media: Map<number, string>, links: Links) {
  // Each image WordPress shows, at its original size, and the file name it gets in the post's folder.
  const images = new Map<string, string>();
  const imageFile = (img: HTMLImageElement): string => {
    const id = /wp-image-(\d+)/.exec(img.className)?.[1];
    const src = img.getAttribute("src") ?? "";
    const url = (id && media.get(Number(id))) || IMAGE_COPIES[src] || src.replace(/-\d+x\d+(\.\w+)$/, "$1");
    const absolute = new URL(url, SITE).href.replace(/^http:/, "https:");
    if (!images.has(absolute)) {
      images.set(absolute, toFileName(absolute));
    }
    return images.get(absolute)!;
  };
  const image = (img: HTMLImageElement, caption = "") => {
    const alt = (img.getAttribute("alt") ?? "").replace(/[[\]]/g, "");
    const title = caption ? ` "${caption.replace(/"/g, "'")}"` : "";
    return `![${alt}](${imageFile(img)}${title})`;
  };

  const turndown = new TurndownService({
    headingStyle: "atx",
    codeBlockStyle: "fenced",
    bulletListMarker: "-",
    emDelimiter: "_",
  });
  turndown.remove(["button", "script", "style"]);
  turndown.remove((node) => node.classList?.contains("toolbar"));
  turndown.keep(["sup", "sub"]);

  // Code highlighted by WordPress's Prism plugin: the text without its token spans, in a fence with its language.
  turndown.addRule("code", {
    filter: "pre",
    replacement: (_, node) => {
      const code = (node as HTMLElement).querySelector("code") ?? node;
      const language = /language-(\w+)/.exec(`${(code as HTMLElement).className} ${(node as HTMLElement).className}`);
      return fence(node.textContent ?? "", language?.[1] ?? "");
    },
  });

  // A YouTube embed becomes a privacy-friendly player in a block of its own, followed by its caption.
  turndown.addRule("youtube", {
    filter: (node) => node.nodeName === "FIGURE" && node.classList.contains("wp-block-embed-youtube"),
    replacement: (content, node) => {
      const iframe = (node as HTMLElement).querySelector("iframe");
      const id = /embed\/([\w-]+)/.exec(iframe?.getAttribute("src") ?? "")?.[1];
      if (!id) {
        return content;
      }
      const title = (iframe?.getAttribute("title") ?? "Video").replace(/"/g, "&quot;");
      const player = `<div class="blog-post__video">\n<iframe src="https://www.youtube-nocookie.com/embed/${id}" title="${title}" loading="lazy" allow="encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>\n</div>`;
      return `\n\n${player}\n\n${content.trim()}\n\n`;
    },
  });

  // A figure with an image: the caption becomes the image's title, which the blog shows under it. A caption with
  // links can't be a title, so it follows as a paragraph.
  turndown.addRule("figure", {
    filter: (node) => node.nodeName === "FIGURE" && Boolean(node.querySelector("img")),
    replacement: (_, node) => {
      const figure = node as HTMLElement;
      const caption = figure.querySelector("figcaption");
      const linked = caption?.querySelector("a") ? caption.innerHTML : "";
      const img = image(figure.querySelector("img")!, linked ? "" : toText(caption?.innerHTML ?? ""));
      return `\n\n${img}\n\n${linked ? `_${turndown.turndown(linked)}_\n\n` : ""}`;
    },
  });
  turndown.addRule("image", {
    filter: "img",
    replacement: (_, node) => image(node as HTMLImageElement),
  });

  // A link around an image to the image's own file adds nothing; links to other posts, and to the pages imported
  // so far, go to their new pages.
  turndown.addRule("link", {
    filter: (node) => node.nodeName === "A" && Boolean(node.getAttribute("href")),
    replacement: (content, node) => {
      const href = new URL((node as HTMLElement).getAttribute("href")!, SITE);
      if (href.origin.replace("http:", "https:") === SITE && href.pathname.startsWith("/wp-content/uploads/")) {
        if ((node as HTMLElement).querySelector("img")) {
          return content;
        }
      }
      const own = href.origin.replace("http:", "https:") === SITE;
      const target =
        (own && links.posts.get(Number(href.searchParams.get("p")))) ||
        (own && links.pages.get(Number(href.searchParams.get("page_id")))) ||
        href.href.replace(/^http:\/\/nikolapacekvetnic\.rs/, SITE);
      return content.trim() ? `[${content.trim()}](${target})` : "";
    },
  });

  // Tables as GitHub tables, the first row as the header.
  turndown.addRule("tableCell", {
    filter: ["th", "td"],
    replacement: (content) => ` ${content.replace(/\s+/g, " ").replace(/\|/g, "\\|").trim()} |`,
  });
  turndown.addRule("tableRow", {
    filter: "tr",
    replacement: (content, node) => {
      let table = node.parentNode;
      while (table && table.nodeName !== "TABLE") {
        table = table.parentNode;
      }
      const first = (table as HTMLElement | null)?.querySelector("tr") === node;
      const cells = [...node.childNodes].filter((cell) => cell.nodeName === "TD" || cell.nodeName === "TH");
      const separator = first ? `\n|${" --- |".repeat(cells.length)}` : "";
      return `\n|${content}${separator}`;
    },
  });
  turndown.addRule("table", {
    filter: "table",
    replacement: (content) => `\n\n${content.trim()}\n\n`,
  });

  const markdown = turndown
    .turndown(html)
    .replace(/^[ \u00a0]+$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return { markdown, images };
}

// A post's window is at most about 800 pixels wide, so 1536 is sharp on screens with twice the pixels. WordPress
// keeps smaller copies of each upload; the smallest that is still that wide, or the original when it is smaller.
function imageUrl(item: WordPressMedia): string {
  const sizes = Object.values(item.media_details?.sizes ?? {}).filter((size) => size.width >= 1536);
  sizes.sort((a, b) => a.width - b.width);
  return sizes[0]?.source_url ?? item.source_url;
}

async function download(url: string, file: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`${url}: HTTP ${response.status}`);
  }
  await writeFile(file, Buffer.from(await response.arrayBuffer()));
}

// Images of a post or page, into its folder in public/.
async function saveImages(images: Map<string, string>, dir: string) {
  if (images.size > 0) {
    await mkdir(dir, { recursive: true });
  }
  for (const [url, file] of images) {
    await download(url, `${dir}/${file}`);
  }
}

const [posts, pages, media, categories] = await Promise.all([
  fetchAll<WordPressPost>("posts"),
  fetchAll<WordPressPage>("pages"),
  fetchAll<WordPressMedia>("media"),
  fetchAll<WordPressCategory>("categories"),
]);
const mediaUrls = new Map(media.map((item) => [item.id, imageUrl(item)]));
const categoryNames = new Map(categories.map((category) => [category.id, category.name.toLowerCase()]));
const slugs = new Map(posts.map((post) => [post.id, toSlug(post.slug)]));
const links: Links = {
  posts: new Map([...slugs].map(([id, slug]) => [id, `/blog/${slug}`])),
  pages: new Map(PAGES.map((page) => [page.id, page.path])),
};

for (const post of posts) {
  const slug = slugs.get(post.id)!;
  const { markdown, images } = convert(post.content.rendered, mediaUrls, links);

  const frontMatter = new Document({
    title: toText(post.title.rendered),
    date: post.date.slice(0, 10),
    // Some posts have no excerpt; their first paragraph instead.
    summary:
      toSummary(post.excerpt.rendered) || toSummary(/<p[^>]*>([\s\S]*?)<\/p>/.exec(post.content.rendered)?.[1] ?? ""),
    tags: post.categories.map((id) => categoryNames.get(id)).filter(Boolean),
  });
  (frontMatter.get("tags", true) as YAMLSeq).flow = true;

  await writeFile(`content/blog/${slug}.md`, `---\n${frontMatter.toString({ lineWidth: 0 })}---\n\n${markdown}\n`);
  await saveImages(images, `public/blog/${slug}`);
  console.log(`${slug}: ${images.size} image(s)`);
}

const pagesById = new Map(pages.map((page) => [page.id, page]));
for (const { id, file, title, lang, drop = [], fields = {} } of PAGES) {
  const page = pagesById.get(id);
  if (!page) {
    throw new Error(`Page ${id} (${file}) is not on the old site`);
  }

  let html = page.content.rendered;
  const frontMatter = new Document({ title, ...(lang ? { lang } : {}) });
  for (const [name, pattern] of Object.entries(fields)) {
    const value = pattern.exec(html)?.[1];
    if (!value) {
      throw new Error(`Page ${id} (${file}): no ${name} in the page`);
    }
    frontMatter.set(name, value);
  }
  for (const pattern of drop) {
    html = html.replace(pattern, "");
  }

  const { markdown, images } = convert(html, mediaUrls, links);
  await mkdir(path.dirname(`content/${file}.md`), { recursive: true });
  await writeFile(`content/${file}.md`, `---\n${frontMatter.toString({ lineWidth: 0 })}---\n\n${markdown}\n`);
  await saveImages(images, `public/${file}`);
  console.log(`${file}: ${images.size} image(s)`);
}

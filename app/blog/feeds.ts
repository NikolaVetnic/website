import { getPostPath, type PostSummary } from "./posts";

const XML_ESCAPES: Record<string, string> = { "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" };

function escapeXml(text: string): string {
  return text.replace(/[<>&"']/g, (char) => XML_ESCAPES[char]);
}

// RSS wants RFC 822 dates; a post's day is taken as midnight UTC.
function toRssDate(date: string): string {
  return new Date(`${date}T00:00:00Z`).toUTCString();
}

type Channel = { siteUrl: string; title: string; description: string };

// Dated by the newest post, not the build, so building twice gives the same file.
export function getRssFeed(posts: PostSummary[], { siteUrl, title, description }: Channel): string {
  const items = posts.map((post) => {
    const url = `${siteUrl}${getPostPath(post.slug)}`;
    const categories = post.tags.map((tag) => `      <category>${escapeXml(tag)}</category>\n`).join("");

    return (
      "    <item>\n" +
      `      <title>${escapeXml(post.title)}</title>\n` +
      `      <link>${url}</link>\n` +
      `      <guid isPermaLink="true">${url}</guid>\n` +
      `      <pubDate>${toRssDate(post.date)}</pubDate>\n` +
      `      <description>${escapeXml(post.summary)}</description>\n` +
      categories +
      "    </item>\n"
    );
  });
  const updated = posts[0] ? `    <lastBuildDate>${toRssDate(posts[0].date)}</lastBuildDate>\n` : "";

  return (
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n' +
    "  <channel>\n" +
    `    <title>${escapeXml(title)}</title>\n` +
    `    <link>${siteUrl}/blog</link>\n` +
    `    <description>${escapeXml(description)}</description>\n` +
    "    <language>en</language>\n" +
    `    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>\n` +
    updated +
    items.join("") +
    "  </channel>\n" +
    "</rss>\n"
  );
}

export type SitemapEntry = { path: string; lastModified?: string };

export function getSitemap(entries: SitemapEntry[], siteUrl: string): string {
  const urls = entries.map(
    ({ path, lastModified }) =>
      "  <url>\n" +
      `    <loc>${escapeXml(`${siteUrl}${path}`)}</loc>\n` +
      (lastModified ? `    <lastmod>${lastModified}</lastmod>\n` : "") +
      "  </url>\n",
  );

  return (
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls.join("") +
    "</urlset>\n"
  );
}

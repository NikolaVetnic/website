export type PostSummary = {
  slug: string;
  title: string;
  // A calendar day, `2026-10-25`.
  date: string;
  summary: string;
  tags: string[];
};

export type Post = PostSummary & {
  // Rendered from Markdown at build time.
  html: string;
};

export function getPostPath(slug: string): string {
  return `/blog/${slug}`;
}

// Fixed locale and time zone, so the date reads the same in the pre-rendered page and in every browser.
const dateFormat = new Intl.DateTimeFormat("en-GB", { dateStyle: "long", timeZone: "UTC" });

export function formatPostDate(date: string): string {
  return dateFormat.format(new Date(`${date}T00:00:00Z`));
}

export function toSummary({ slug, title, date, summary, tags }: Post): PostSummary {
  return { slug, title, date, summary, tags };
}

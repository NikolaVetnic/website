import type { PostSummary } from "./posts";

// A post's words for the search: its slug and its text without the markup. Built at build time into
// `/blog/search.json`, which the Blog fetches only once someone searches.
export type SearchEntry = { slug: string; text: string };

export const SEARCH_INDEX_PATH = "/blog/search.json";

export type BlogFilter = { query: string; tags: string[] };

// Lower case, without accents, so "Đorđe", "dorde" and "DORĐE" find each other.
export function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/\p{Mn}/gu, "")
    .replace(/đ/gi, "d")
    .toLowerCase();
}

// The text of a post's HTML: tags dropped, the common entities decoded, white space collapsed.
export function toPlainText(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

// Every tag the posts use, alphabetically.
export function getAllTags(posts: PostSummary[]): string[] {
  return [...new Set(posts.flatMap((post) => post.tags))].sort((a, b) => a.localeCompare(b));
}

export function isFiltering({ query, tags }: BlogFilter): boolean {
  return query.trim() !== "" || tags.length > 0;
}

// A post matches when it has every chosen tag, and every word of the query is in its title, summary, tags or text
// (the text only once the search index has arrived).
export function matchesFilter(post: PostSummary, { query, tags }: BlogFilter, text = ""): boolean {
  if (!tags.every((tag) => post.tags.includes(tag))) {
    return false;
  }

  const words = normalize(query).split(/\s+/).filter(Boolean);
  if (words.length === 0) {
    return true;
  }
  const haystack = normalize([post.title, post.summary, ...post.tags, text].join(" "));
  return words.every((word) => haystack.includes(word));
}

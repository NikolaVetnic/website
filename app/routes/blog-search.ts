import { getPosts } from "~/blog/posts.server";
import { toPlainText, type SearchEntry } from "~/blog/search";

// Pre-rendered to /blog/search.json at build time: each post's text, for the Blog's search. It isn't part of the
// list page's data, so a visit pays for it only when someone searches.
export function loader() {
  const index: SearchEntry[] = getPosts().map((post) => ({ slug: post.slug, text: toPlainText(post.html) }));
  return Response.json(index);
}

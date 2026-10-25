import type { Config } from "@react-router/dev/config";

import { getPostPath } from "./app/blog/posts";
import { getPosts } from "./app/blog/posts.server";

export default {
  // No runtime server: the hosting only serves static files.
  ssr: false,
  // Render every static route to HTML at build time, plus a page for each blog post.
  prerender: ({ getStaticPaths }) => [...getStaticPaths(), ...getPosts().map((post) => getPostPath(post.slug))],
} satisfies Config;

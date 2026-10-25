import { toSummary } from "~/blog/posts";
import { getPosts } from "~/blog/posts.server";
import { getApp } from "~/desktop/apps";
import { getAppMeta } from "~/meta";
import type { Route } from "./+types/blog";

// Runs at build time; the Blog window shows the list (see Blog.tsx).
export function loader() {
  return { posts: getPosts().map(toSummary) };
}

export const meta: Route.MetaFunction = () => getAppMeta(getApp("blog"));

export default function BlogPage() {
  return null;
}

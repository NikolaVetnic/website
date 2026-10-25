import { data } from "react-router";

import { getPostPath } from "~/blog/posts";
import { getPosts } from "~/blog/posts.server";
import { SITE_NAME, getPageMeta } from "~/meta";
import type { Route } from "./+types/blog-post";

// Runs at build time for every post (see react-router.config.ts); the Blog window shows it (see Blog.tsx).
export function loader({ params }: Route.LoaderArgs) {
  const post = getPosts().find((entry) => entry.slug === params.slug);
  if (!post) {
    throw data(null, { status: 404 });
  }

  return { post };
}

// In the browser, a post that wasn't pre-rendered has no data file. Say so in the Blog window rather than
// replacing the whole desktop with an error page.
export async function clientLoader({ serverLoader }: Route.ClientLoaderArgs) {
  try {
    return await serverLoader();
  } catch {
    return { missing: true as const };
  }
}

export const meta: Route.MetaFunction = ({ loaderData }) => {
  if (!loaderData || !("post" in loaderData)) {
    return [{ title: `Post not found · ${SITE_NAME}` }];
  }

  const { post } = loaderData;

  return getPageMeta({
    title: `${post.title} · ${SITE_NAME}`,
    description: post.summary,
    path: getPostPath(post.slug),
    published: post.date,
  });
};

export default function BlogPostPage() {
  return null;
}

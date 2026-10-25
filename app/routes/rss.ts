import { getRssFeed } from "~/blog/feeds";
import { toSummary } from "~/blog/posts";
import { getPosts } from "~/blog/posts.server";
import { getApp } from "~/desktop/apps";
import { SITE_NAME, SITE_URL } from "~/meta";

// Pre-rendered to /rss.xml at build time.
export function loader() {
  const blog = getApp("blog");
  const feed = getRssFeed(getPosts().map(toSummary), {
    siteUrl: SITE_URL,
    title: `${blog.title} · ${SITE_NAME}`,
    description: blog.description,
  });

  return new Response(feed, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}

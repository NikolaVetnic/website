import type { Config } from "@react-router/dev/config";

import { getPostPath } from "./app/blog/posts";
import { getPosts } from "./app/blog/posts.server";
import { getProjectPath } from "./app/projects/projects";
import { getProjects } from "./app/projects/projects.server";

export default {
  // No runtime server: the hosting only serves static files.
  ssr: false,
  // Render every static route to HTML at build time, plus a page for each blog post and each project.
  prerender: ({ getStaticPaths }) => [
    ...getStaticPaths(),
    ...getPosts().map((post) => getPostPath(post.slug)),
    ...getProjects().map((project) => getProjectPath(project.slug)),
  ],
} satisfies Config;

import type { Config } from "@react-router/dev/config";

import { getPostPath } from "./app/blog/posts";
import { getPosts } from "./app/blog/posts.server";
import { getGamePath } from "./app/games/games";
import { getGames } from "./app/games/games.server";
import { getMusicPath } from "./app/music/music";
import { getMusic } from "./app/music/music.server";
import { getProjectPath } from "./app/projects/projects";
import { getProjects } from "./app/projects/projects.server";

export default {
  // No runtime server: the hosting only serves static files.
  ssr: false,
  // Render every static route to HTML at build time, plus a page for each blog post, project, piece of music and
  // small game.
  prerender: ({ getStaticPaths }) => [
    ...getStaticPaths(),
    ...getPosts().map((post) => getPostPath(post.slug)),
    ...getProjects().map((project) => getProjectPath(project.slug)),
    ...getMusic().map((entry) => getMusicPath(entry.slug)),
    ...getGames().map((game) => getGamePath(game.slug)),
  ],
} satisfies Config;

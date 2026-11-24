import { data } from "react-router";

import { getGamePath } from "~/games/games";
import { getGames } from "~/games/games.server";
import { SITE_NAME, getPageMeta } from "~/meta";
import type { Route } from "./+types/game";

// Runs at build time for every game page (see react-router.config.ts); the game's own window shows it.
export function loader({ params }: Route.LoaderArgs) {
  const game = getGames().find((entry) => entry.slug === params.slug);
  if (!game) {
    throw data(null, { status: 404 });
  }

  return { game };
}

// In the browser, a game that wasn't pre-rendered has no data file; the Games folder opens instead of an error page.
export async function clientLoader({ serverLoader }: Route.ClientLoaderArgs) {
  try {
    return await serverLoader();
  } catch {
    return { missing: true as const };
  }
}

export const meta: Route.MetaFunction = ({ loaderData }) => {
  if (!loaderData || !("game" in loaderData)) {
    return [{ title: `Not found · ${SITE_NAME}` }];
  }

  const { game } = loaderData;

  return getPageMeta({
    title: `${game.title} · ${SITE_NAME}`,
    description: game.summary,
    path: getGamePath(game.slug),
  });
};

export default function GamePage() {
  return null;
}

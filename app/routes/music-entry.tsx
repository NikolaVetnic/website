import { data } from "react-router";

import { SITE_NAME, getPageMeta } from "~/meta";
import { getMusicPath } from "~/music/music";
import { getMusic } from "~/music/music.server";
import type { Route } from "./+types/music-entry";

// Runs at build time for every entry (see react-router.config.ts); the Music window shows it.
export function loader({ params }: Route.LoaderArgs) {
  const musicEntry = getMusic().find((entry) => entry.slug === params.slug);
  if (!musicEntry) {
    throw data(null, { status: 404 });
  }

  return { musicEntry };
}

// In the browser, an entry that wasn't pre-rendered has no data file. Say so in the Music window rather than
// replacing the whole desktop with an error page.
export async function clientLoader({ serverLoader }: Route.ClientLoaderArgs) {
  try {
    return await serverLoader();
  } catch {
    return { missing: true as const };
  }
}

export const meta: Route.MetaFunction = ({ loaderData }) => {
  if (!loaderData || !("musicEntry" in loaderData)) {
    return [{ title: `Not found · ${SITE_NAME}` }];
  }

  const { musicEntry } = loaderData;

  return getPageMeta({
    title: `${musicEntry.title} · ${SITE_NAME}`,
    description: musicEntry.summary,
    path: getMusicPath(musicEntry.slug),
  });
};

export default function MusicEntryPage() {
  return null;
}

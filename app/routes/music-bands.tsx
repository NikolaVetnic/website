import { getMusicTabMeta } from "~/music/music-meta";
import { getMusicTabData } from "~/music/music.server";
import type { Route } from "./+types/music-bands";

// Runs at build time; the Music window shows the bands under its tabs (see Music.tsx).
export function loader() {
  return getMusicTabData("band");
}

export const meta: Route.MetaFunction = () => getMusicTabMeta("band");

export default function MusicBandsPage() {
  return null;
}

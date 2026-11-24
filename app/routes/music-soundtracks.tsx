import { getMusicTabMeta } from "~/music/music-meta";
import { getMusicTabData } from "~/music/music.server";
import type { Route } from "./+types/music-soundtracks";

// Runs at build time; the Music window shows the soundtracks under its tabs (see Music.tsx).
export function loader() {
  return getMusicTabData("soundtrack");
}

export const meta: Route.MetaFunction = () => getMusicTabMeta("soundtrack");

export default function MusicSoundtracksPage() {
  return null;
}

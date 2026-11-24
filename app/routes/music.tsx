import { getMusicTabMeta } from "~/music/music-meta";
import { getMusicTabData } from "~/music/music.server";
import type { Route } from "./+types/music";

// Runs at build time; the Music window shows the compositions under its tabs (see Music.tsx).
export function loader() {
  return getMusicTabData("composition");
}

export const meta: Route.MetaFunction = () => getMusicTabMeta("composition");

export default function MusicPage() {
  return null;
}

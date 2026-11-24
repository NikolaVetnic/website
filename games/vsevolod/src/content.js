// Everything the page says and links to, in one place. The page replaces the old site's VSEVOLOD page
// (nikolapacekvetnic.rs/?page_id=770), whose text, screenshots, soundtrack and download it keeps.

import graveyard from "./images/shots/graveyard.webp";
import graveyardThumb from "./images/shots/graveyard-thumb.webp";
import inventory from "./images/shots/inventory.webp";
import inventoryThumb from "./images/shots/inventory-thumb.webp";
import laboratory from "./images/shots/laboratory.webp";
import laboratoryThumb from "./images/shots/laboratory-thumb.webp";
import library from "./images/shots/library.webp";
import libraryThumb from "./images/shots/library-thumb.webp";
import puzzle from "./images/shots/puzzle.webp";
import puzzleThumb from "./images/shots/puzzle-thumb.webp";

export const DOWNLOADS = {
  game: {
    label: "Download for Windows",
    href: "https://drive.google.com/file/d/1SePyWco28eHL9-6sq9mBmyP_AS8vpb1D/view?usp=drive_link",
  },
  walkthrough: {
    label: "Walkthrough (PDF)",
    href: "https://drive.google.com/file/d/18zZqwvRIz4p4CM7hjFsHjSC3JIAg_pta/view?usp=drive_link",
  },
};

// Words between double asterisks are bold, those between single ones highlighted.
export const STORY = [
  "**VSEVOLOD Prologue** is a bite-size preview of what was to become a full-fledged *classic 2D point-and-click adventure*, in the style of the best titles of yesteryear.",
  "A self-funded re-telling of an obscure Slavonic myth, the game is set in an *alternate history* in which Christianity never emerged, leaving autochthonous European spirituality to shape the culture of the continent.",
];

export const FEATURES = [
  {
    numeral: "I",
    title: "Drawn by Hand",
    text: "Detailed hand-drawn scenes and characters in 1280×720, with frame-by-frame character animation.",
  },
  {
    numeral: "II",
    title: "Spells Sung in Melodies",
    text: "A spell system built on seeking out and reproducing short melodic sequences, not unlike the one in LucasFilm’s classic Loom.",
  },
  {
    numeral: "III",
    title: "A Classic Adventure",
    text: "The staples of the genre: dialogues, inventory puzzles and several mechanical puzzles, deeply rooted in the peculiar lore of its world.",
  },
];

// In the order the Prologue shows them.
export const SCREENSHOTS = [
  { src: library, thumb: libraryThumb, caption: "The Library" },
  { src: graveyard, thumb: graveyardThumb, caption: "The Graveyard" },
  { src: laboratory, thumb: laboratoryThumb, caption: "The Laboratory" },
  { src: inventory, thumb: inventoryThumb, caption: "The Inventory" },
  { src: puzzle, thumb: puzzleThumb, caption: "A Puzzle" },
];

export const SOUNDTRACK = {
  title: "VSEVOLOD Official Soundtrack",
  player:
    "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/336182804&color=%23e9e1cf&auto_play=true&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=true",
  // The soundtrack's page in the site's Music window.
  path: "/music/vsevolod-soundtrack",
};

// Who made it.
export const CREDITS = [
  { role: "Coding", name: "Zdeněk Mihula" },
  { role: "Art", name: "Simon Ketteniss" },
  { role: "Story & Audio", name: "Nikola Vetnić" },
];

// Where the project stands.
export const STATUS = [
  "VSEVOLOD has been on hiatus since 2012. The brunt of the work was done by *Simon Ketteniss*, who in later years lost the desire to make games.",
  "A **recreation of the Prologue in Unity** is going to happen at some point. A continuation is unlikely, at least for now.",
];

// Everything the page says and links to, in one place. The texts are the old site's K’NOSSOS page
// (nikolapacekvetnic.rs/?page_id=746); headings and the short feature lines are new.

import chapter1CryoDeck from "./images/shots/chapter-1-cryo-deck.webp";
import chapter1CryoDeckThumb from "./images/shots/chapter-1-cryo-deck-thumb.webp";
import chapter2ResearchCenter from "./images/shots/chapter-2-research-center.webp";
import chapter2ResearchCenterThumb from "./images/shots/chapter-2-research-center-thumb.webp";
import chapter3 from "./images/shots/chapter-3.webp";
import chapter3Thumb from "./images/shots/chapter-3-thumb.webp";
import chapter4Bridge from "./images/shots/chapter-4-bridge.webp";
import chapter4BridgeThumb from "./images/shots/chapter-4-bridge-thumb.webp";
import chapter4MedBay from "./images/shots/chapter-4-med-bay.webp";
import chapter4MedBayThumb from "./images/shots/chapter-4-med-bay-thumb.webp";
import chapter4MedBayEntrance from "./images/shots/chapter-4-med-bay-entrance.webp";
import chapter4MedBayEntranceThumb from "./images/shots/chapter-4-med-bay-entrance-thumb.webp";
import chapter4Square from "./images/shots/chapter-4-square.webp";
import chapter4SquareThumb from "./images/shots/chapter-4-square-thumb.webp";
import chapter5Garden from "./images/shots/chapter-5-garden.webp";
import chapter5GardenThumb from "./images/shots/chapter-5-garden-thumb.webp";
import chapter5Island from "./images/shots/chapter-5-island.webp";
import chapter5IslandThumb from "./images/shots/chapter-5-island-thumb.webp";
import chapter6VoquevPalace from "./images/shots/chapter-6-voquev-palace.webp";
import chapter6VoquevPalaceThumb from "./images/shots/chapter-6-voquev-palace-thumb.webp";
import prologueCryoDeck from "./images/shots/prologue-cryo-deck.webp";
import prologueCryoDeckThumb from "./images/shots/prologue-cryo-deck-thumb.webp";
import tutorial from "./images/shots/tutorial.webp";
import tutorialThumb from "./images/shots/tutorial-thumb.webp";
import devlogChapter5 from "./images/devlog-chapter-5.webp";

export const DOWNLOADS = [
  { label: "Windows", href: "https://drive.google.com/file/d/1tYuxT49canQjJ2HYlv5ITU1lvz9ORVEA/view?usp=drive_link" },
  { label: "macOS", href: "https://drive.google.com/file/d/1V8PawaM1xPbsuA94idRLCzBVOXi_0kvG/view?usp=drive_link" },
];

export const TAGLINE = "A cold, surreal adventure across the unknown reaches of the cosmos";

// Words written between asterisks are highlighted.
export const STORY = [
  "K’NOSSOS is a *cold surreal adventure game* about a man traveling the unknown reaches of the cosmos, and the things he uncovers on his journey. Gameplay is reminiscent of the *point-n’-click adventure game classics* such as “The Dig” or “Chronomaster”, as well as the more recent titles such as “Primordia”. The game puts equal emphasis on characterization, atmosphere and storytelling on the one hand, and problem solving and challenging puzzles on the other.",
  "This dark sci fi adventure game lets you explore an *alien and foreboding universe*, taking the player on a journey across a vast and unknown solar system down to the surface of a *sunken planet*. The endless oceans of this world hide in their depths an *enigmatic metropolis without people*, an ancient city which at its heart keeps *a terrible secret* – a secret which will turn your perception of this story on its head. The dark finale will pit the player against a bizarre and unfathomable force, an eerie presence which lurked in the dark the entire time.",
];

// The motif is one of the shapes drawn by Motif.jsx.
export const FEATURES = [
  {
    motif: "circles",
    title: "A Kandinsky-inspired world",
    text: "A unique visual style reminiscent of the art of Wassily Kandinsky.",
  },
  {
    motif: "triangle",
    title: "Classic point-n’-click",
    text: "Classical point-n’-click adventure gameplay, with problem solving and challenging puzzles.",
  },
  { motif: "orbit", title: "A sci-fi mystery", text: "A complex storyline set in a sci fi setting." },
  {
    motif: "lines",
    title: "A story told in dialogue",
    text: "A vast amount of dialogues, and equal emphasis on characterization, atmosphere and storytelling.",
  },
  { motif: "waves", title: "An experimental soundtrack", text: "A cross-genre experimental soundtrack." },
];

export const TRAILER = { id: "VXCvAkalz7c", title: "K’NOSSOS Prologue Trailer" };

export const SOUNDTRACK = {
  title: "K’NOSSOS Official Soundtrack",
  player:
    "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/332651723&color=%23d8b45a&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true",
};

// In the order of the story.
export const SCREENSHOTS = [
  { src: prologueCryoDeck, thumb: prologueCryoDeckThumb, caption: "Prologue · Cryo Deck" },
  { src: tutorial, thumb: tutorialThumb, caption: "Tutorial" },
  { src: chapter1CryoDeck, thumb: chapter1CryoDeckThumb, caption: "Chapter I · Cryo Deck" },
  { src: chapter2ResearchCenter, thumb: chapter2ResearchCenterThumb, caption: "Chapter II · Research Center" },
  { src: chapter3, thumb: chapter3Thumb, caption: "Chapter III" },
  { src: chapter4Bridge, thumb: chapter4BridgeThumb, caption: "Chapter IV · The Bridge" },
  { src: chapter4Square, thumb: chapter4SquareThumb, caption: "Chapter IV · The Square" },
  { src: chapter4MedBayEntrance, thumb: chapter4MedBayEntranceThumb, caption: "Chapter IV · Med Bay Entrance" },
  { src: chapter4MedBay, thumb: chapter4MedBayThumb, caption: "Chapter IV · Med Bay" },
  { src: chapter5Garden, thumb: chapter5GardenThumb, caption: "Chapter V" },
  { src: chapter5Island, thumb: chapter5IslandThumb, caption: "Chapter V · The Island" },
  { src: chapter6VoquevPalace, thumb: chapter6VoquevPalaceThumb, caption: "Chapter VI · Voquev Palace" },
];

// Posts on this site; in the site's window they open in the Blog (see Devlog.jsx).
export const DEVLOG = [
  {
    path: "/blog/knossos-chapter-v-assets-completed",
    title: "K’NOSSOS Chapter V Assets Completed",
    date: "22 August 2020",
    image: devlogChapter5,
    summary:
      "The Displacement Maze will take you from K’nossos I to K’nossos II, the lowest geographical point of our adventure.",
  },
  {
    path: "/blog/sights-of-chapter-vi",
    title: "Sights of K’NOSSOS Chapter VI",
    date: "23 September 2020",
    image: chapter6VoquevPalaceThumb,
    summary: "The great Assembly Hall of K’nossos, and one of the lavish mansions in the living quarters of the city.",
  },
];

// The campaign that funded the game (successful, ended 22 November 2017).
export const KICKSTARTER = {
  href: "https://www.kickstarter.com/projects/533772585/knossos-a-classic-point-and-click-sci-fi-adventure",
  backers: 373,
};

export const SOCIAL = [
  { label: "Kickstarter", href: KICKSTARTER.href },
  { label: "Facebook", href: "https://www.facebook.com/KnossosTheGame" },
  { label: "Twitter", href: "https://twitter.com/SvarunEnt" },
  { label: "YouTube", href: "https://www.youtube.com/channel/UC8abQM1r8OlrsCR1dyuVUHw" },
];

import { SITE_NAME } from "~/meta";

// What the Contact window shows. A profile is one more entry in PROFILES.

export const CONTACT = {
  name: SITE_NAME,
  role: "Developer and composer",
  // The old site's Contact page, word for word.
  intro:
    "Feel free to get in touch with me. I am always open to discussing art, code, game dev or music. Creativity never gets stale.",
  // A square crop of the bio photo (public/about/belgrade-2018.webp).
  photo: "/contact/portrait.webp",
};

export type Profile = { name: string; url: string };

export const PROFILES: Profile[] = [
  { name: "GitHub", url: "https://github.com/NikolaVetnic" },
  { name: "Bandcamp", url: "https://nikolapacekvetnic.bandcamp.com" },
];

// The address, joined only in the browser: the pre-rendered HTML doesn't contain it, so address collectors that
// read pages don't find it there.
const EMAIL_PARTS = ["admin", "nikolapacekvetnic.rs"];

export function getEmail(): string {
  return EMAIL_PARTS.join("@");
}

// A profile's address as it is read: without the scheme or a closing slash.
export function getProfileLabel(profile: Profile): string {
  return profile.url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

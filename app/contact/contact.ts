// What the Contact window shows. A profile is one more entry in PROFILES.

export const CONTACT = {
  name: "Nikola Vetnić",
  role: "Software developer · AI engineer · Composer",
  // The old site's Contact page, narrowed to code and music.
  intro:
    "Feel free to get in touch with me. I am always open to discussing code and music. Creativity never gets stale.",
  // A square crop of the bookstore portrait (Bookstore_WideShot.JPG, 1000 × 800: 520 px from 240, 20), 192 px.
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

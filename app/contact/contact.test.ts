import { describe, expect, it } from "vitest";

import { getEmail, getProfileLabel, PROFILES } from "./contact";

describe("contact", () => {
  it("joins the address", () => {
    expect(getEmail()).toBe("admin@nikolapacekvetnic.rs");
  });

  it("writes a profile's address without the scheme or a closing slash", () => {
    expect(getProfileLabel({ name: "GitHub", url: "https://github.com/NikolaVetnic/" })).toBe(
      "github.com/NikolaVetnic",
    );
    expect(getProfileLabel({ name: "Bandcamp", url: "http://example.bandcamp.com" })).toBe("example.bandcamp.com");
  });

  it("links every profile over HTTPS", () => {
    for (const profile of PROFILES) {
      expect(profile.url, profile.name).toMatch(/^https:\/\//);
    }
  });
});

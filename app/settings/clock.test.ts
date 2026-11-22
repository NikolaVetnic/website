import { describe, expect, it } from "vitest";

import { getTimeFormat } from "./clock";

// Normalizes the narrow spaces some engines put before AM and PM.
const format =
  (...args: Parameters<typeof getTimeFormat>) =>
  (date: Date) =>
    getTimeFormat(...args)
      .format(date)
      .replace(/\s/g, " ");

describe("getTimeFormat", () => {
  const evening = new Date(2026, 10, 22, 21, 5);
  const midnight = new Date(2026, 10, 22, 0, 5);

  it("follows the language when left to the browser", () => {
    expect(format("auto", "en-US")(evening)).toBe("9:05 PM");
    expect(format("auto", "en-GB")(evening)).toBe("21:05");
  });

  it("uses 12 or 24 hours when chosen, whatever the language", () => {
    expect(format("12", "en-GB")(evening)).toMatch(/^9:05 pm$/i);
    expect(format("24", "en-US")(evening)).toBe("21:05");
  });

  it("writes midnight as 0 in 24 hours and 12 in 12 hours", () => {
    expect(format("24", "en-US")(midnight)).toBe("00:05");
    expect(format("12", "en-US")(midnight)).toBe("12:05 AM");
  });
});

import type { ClockFormat } from "./settings";

// How the taskbar's clock writes the time: in the browser's language, with 12 or 24 hours as the setting says,
// or as that language usually has it.
export function getTimeFormat(clock: ClockFormat, locale?: string): Intl.DateTimeFormat {
  return new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    minute: "2-digit",
    ...(clock === "auto" ? {} : { hourCycle: clock === "12" ? "h12" : "h23" }),
  });
}

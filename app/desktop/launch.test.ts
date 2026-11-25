import { describe, expect, it } from "vitest";

import { getLaunchTransform, getMinimizeKeyframes, getOpenKeyframes } from "./launch";

const WINDOW = { x: 300, y: 100, width: 640, height: 440 };
const ICON = { x: 16, y: 16, width: 80, height: 96 };

describe("getLaunchTransform", () => {
  it("centres the window on the control, scaled until its longer side spans it", () => {
    // Centres: the icon's at (56, 64), the window's at (620, 320); 96 / 440 is the larger of the two ratios.
    expect(getLaunchTransform(ICON, WINDOW)).toBe("translate(-564px, -256px) scale(0.218)");
  });

  it("leaves a window alone where it already is", () => {
    expect(getLaunchTransform(WINDOW, WINDOW)).toBe("translate(0px, 0px) scale(1)");
  });

  it("never scales a window up past its size", () => {
    expect(getLaunchTransform({ x: 0, y: 0, width: 2000, height: 1000 }, WINDOW)).toMatch(/scale\(1\)$/);
  });
});

describe("keyframes", () => {
  it("grow a window out of the control and shrink it into the button", () => {
    const open = getOpenKeyframes(ICON, WINDOW);
    expect(open[0]).toEqual({ transform: getLaunchTransform(ICON, WINDOW), opacity: 0 });
    expect(open.at(-1)).toEqual({ transform: "none", opacity: 1 });

    const minimize = getMinimizeKeyframes(WINDOW, ICON);
    expect(minimize[0]).toEqual({ transform: "none", opacity: 1 });
    expect(minimize.at(-1)).toEqual({ transform: getLaunchTransform(ICON, WINDOW), opacity: 0 });
  });
});

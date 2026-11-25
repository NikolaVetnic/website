import { useEffect, useState, type CSSProperties } from "react";

import usePhoneLayout from "~/hooks/usePhoneLayout";
import useSettings from "~/settings/useSettings";
import "./Screensaver.css";

// How far the pointer has to move to wake the screen: a mouse can twitch on its own.
const WAKE_DISTANCE = 8;

// How long the logo takes to cross the screen each way (Screensaver.css); a random point in each is where it starts.
const CROSS_X = 13;
const CROSS_Y = 8.3;

// Whether the screensaver should wait: the tab isn't showing, the visitor asked for less motion, a player or a game
// has focus (they're in iframes, whose own presses never reach the page), or something is playing with sound.
function shouldWait(): boolean {
  return (
    document.hidden ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    document.activeElement instanceof HTMLIFrameElement ||
    Array.from(document.querySelectorAll<HTMLMediaElement>("video, audio")).some(
      (media) => !media.paused && !media.muted,
    )
  );
}

// After the minutes the Settings give without a press, a move or a key, the screen dims and the logo drifts across
// it, bouncing off the edges, until the visitor is back. Not in the phone layout: a phone dims on its own.
function Screensaver() {
  const [{ screensaver }] = useSettings();
  const isPhone = usePhoneLayout();
  const delay = screensaver === "off" || isPhone ? null : Number(screensaver) * 60_000;
  // Where in its two crossings the logo starts, once on; null while off.
  const [start, setStart] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (delay === null) {
      return;
    }

    let lastActive = performance.now();
    let isOn = false;
    // Where the pointer was last, which it has to leave to wake the screen; unknown until it first moves.
    let pointer: { x: number; y: number } | null = null;
    let timer = 0;

    const schedule = (wait: number) => {
      window.clearTimeout(timer);
      timer = window.setTimeout(check, wait);
    };
    const check = () => {
      const idle = performance.now() - lastActive;
      if (idle < delay) {
        schedule(delay - idle);
      } else if (shouldWait()) {
        lastActive = performance.now();
        schedule(delay);
      } else {
        isOn = true;
        setStart({ x: Math.random() * CROSS_X, y: Math.random() * CROSS_Y });
      }
    };
    const wake = () => {
      lastActive = performance.now();
      if (isOn) {
        isOn = false;
        setStart(null);
        schedule(delay);
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      const at = { x: event.clientX, y: event.clientY };
      if (!isOn) {
        lastActive = performance.now();
        pointer = at;
      } else if (!pointer) {
        pointer = at;
      } else if (Math.hypot(at.x - pointer.x, at.y - pointer.y) > WAKE_DISTANCE) {
        wake();
      }
    };
    // The key that wakes the screen does nothing else, as a press on it lands on the screensaver.
    const onKeyDown = (event: KeyboardEvent) => {
      if (isOn) {
        event.preventDefault();
        event.stopPropagation();
      }
      wake();
    };

    const options = { capture: true, passive: true };
    window.addEventListener("pointermove", onPointerMove, options);
    window.addEventListener("pointerdown", wake, options);
    window.addEventListener("wheel", wake, options);
    window.addEventListener("keydown", onKeyDown, true);
    schedule(delay);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("pointermove", onPointerMove, options);
      window.removeEventListener("pointerdown", wake, options);
      window.removeEventListener("wheel", wake, options);
      window.removeEventListener("keydown", onKeyDown, true);
    };
  }, [delay]);

  if (!start || delay === null) {
    return null;
  }

  // Negative delays start each crossing part of the way through, so the logo doesn't always set off from a corner.
  const style = { "--start-x": `-${start.x}s`, "--start-y": `-${start.y}s` } as CSSProperties;
  return (
    <div className="screensaver" style={style} aria-hidden="true">
      <div className="screensaver__across">
        <img className="screensaver__logo" src="/icon-192.png" alt="" draggable={false} />
      </div>
    </div>
  );
}

export default Screensaver;

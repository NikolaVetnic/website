import { useEffect, useState } from "react";

const timeFormat = new Intl.DateTimeFormat(undefined, { hour: "2-digit", minute: "2-digit" });
const dateFormat = new Intl.DateTimeFormat(undefined, { dateStyle: "full" });

// Empty until it runs in the browser: the pre-rendered page must not show the build time.
function Clock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    let timer = 0;

    // Ticks right after each minute turns over instead of polling every second.
    const tick = () => {
      const date = new Date();
      setNow(date);
      timer = window.setTimeout(tick, 60_000 - (date.getSeconds() * 1000 + date.getMilliseconds()));
    };

    timer = window.setTimeout(tick, 0);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <time className="taskbar__clock" dateTime={now?.toISOString()} title={now ? dateFormat.format(now) : undefined}>
      {now ? timeFormat.format(now) : null}
    </time>
  );
}

export default Clock;

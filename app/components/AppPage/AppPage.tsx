import { useEffect, useRef } from "react";

import type { DesktopApp } from "~/desktop/apps";
import "./AppPage.css";

type AppPageProps = {
  app: DesktopApp & { page: string };
  // Brings the window to the front.
  onActivate: () => void;
};

// An app that is a page of its own (a game's landing page), shown in its window through an iframe, so its own
// responsive design follows the window's size and its styles stay apart from the site's.
function AppPage({ app, onActivate }: AppPageProps) {
  const frameRef = useRef<HTMLIFrameElement | null>(null);

  // The listener below reads it without being added again on every render.
  const activate = useRef(onActivate);
  useEffect(() => {
    activate.current = onActivate;
  });

  // Clicks inside the page never reach the window around it. Clicking into it takes the focus away from the site,
  // though, which then finds the iframe focused: that window comes to the front, as for any other click on it.
  useEffect(() => {
    const handleBlur = () => {
      if (document.activeElement === frameRef.current) {
        activate.current();
      }
    };
    window.addEventListener("blur", handleBlur);
    return () => window.removeEventListener("blur", handleBlur);
  }, []);

  return <iframe ref={frameRef} className="app-page" src={app.page} title={app.title} />;
}

export default AppPage;

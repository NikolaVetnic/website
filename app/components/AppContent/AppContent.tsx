import type { DesktopApp } from "~/desktop/apps";
import "./AppContent.css";

type AppContentProps = {
  app: DesktopApp;
  // Where the window is within its app, and what that page's route loaded at build time (if anything).
  path: string;
  data: unknown;
};

// What each app shows inside its window.
function AppContent({ app }: AppContentProps) {
  return <p className="app-content__placeholder">{app.title} is on its way.</p>;
}

export default AppContent;

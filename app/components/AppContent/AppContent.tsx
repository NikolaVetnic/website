import Blog from "~/components/Blog/Blog";
import type { DesktopApp } from "~/desktop/apps";
import "./AppContent.css";

type AppContentProps = {
  app: DesktopApp;
  // What the route for the window's path loaded at build time (if anything).
  data: unknown;
};

// What each app shows inside its window.
function AppContent({ app, data }: AppContentProps) {
  switch (app.id) {
    case "blog":
      return <Blog data={data} />;
    default:
      return <p className="app-content__placeholder">{app.title} is on its way.</p>;
  }
}

export default AppContent;

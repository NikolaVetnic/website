import About from "~/components/About/About";
import Blog from "~/components/Blog/Blog";
import Settings from "~/components/Settings/Settings";
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
    case "about":
      return <About data={data} />;
    case "blog":
      return <Blog data={data} />;
    case "settings":
      return <Settings />;
    default:
      return <p className="app-content__placeholder">{app.title} is on its way.</p>;
  }
}

export default AppContent;

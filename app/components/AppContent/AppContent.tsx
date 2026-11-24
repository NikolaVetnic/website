import About from "~/components/About/About";
import AppPage from "~/components/AppPage/AppPage";
import Blog from "~/components/Blog/Blog";
import Contact from "~/components/Contact/Contact";
import Folder from "~/components/Folder/Folder";
import Game from "~/components/Game/Game";
import Music from "~/components/Music/Music";
import Projects from "~/components/Projects/Projects";
import Settings from "~/components/Settings/Settings";
import { getFolderApps, type DesktopApp } from "~/desktop/apps";
import "./AppContent.css";

type AppContentProps = {
  app: DesktopApp;
  // What the route for the window's path loaded at build time (if anything).
  data: unknown;
  // Brings the window to the front, for content the window can't tell was clicked (a page in an iframe).
  onActivate: () => void;
};

// What each app shows inside its window.
function AppContent({ app, data, onActivate }: AppContentProps) {
  if (app.page) {
    return <AppPage app={{ ...app, page: app.page }} onActivate={onActivate} />;
  }
  if (app.content === "games") {
    return <Game data={data} />;
  }

  switch (app.id) {
    case "about":
      return <About data={data} />;
    case "blog":
      return <Blog data={data} />;
    case "contact":
      return <Contact />;
    case "games":
      return <Folder apps={getFolderApps("games")} />;
    case "music":
      return <Music data={data} />;
    case "projects":
      return <Projects data={data} />;
    case "settings":
      return <Settings />;
    default:
      return <p className="app-content__placeholder">{app.title} is on its way.</p>;
  }
}

export default AppContent;

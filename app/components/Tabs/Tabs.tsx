import { Link } from "react-router";

import "./Tabs.css";

export type Tab = { title: string; path: string };

// Links between the pages of one window (About's Bio and Resume, Projects and Open source), drawn as tabs.
function Tabs({ label, tabs, current }: { label: string; tabs: Tab[]; current: string }) {
  return (
    <nav className="tabs" aria-label={label}>
      {tabs.map((tab) => (
        <Link
          key={tab.path}
          className="tabs__tab"
          to={tab.path}
          aria-current={tab.path === current ? "page" : undefined}
        >
          {tab.title}
        </Link>
      ))}
    </nav>
  );
}

export default Tabs;

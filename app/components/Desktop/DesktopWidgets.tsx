import { Link } from "react-router";
import widgets from "virtual:desktop-widgets";

import { formatPostDate, getPostPath } from "~/blog/posts";
import type { Featured } from "~/desktop/widgets";
import "./DesktopWidgets.css";

// The featured card's link: a page of the site opens in its window, anything else in a new tab. It covers the
// whole card.
function FeaturedLink({ featured }: { featured: Featured }) {
  if (featured.link.startsWith("/")) {
    return (
      <Link className="desktop-widget__button" to={featured.link}>
        {featured.label}
      </Link>
    );
  }
  return (
    <a className="desktop-widget__button" href={featured.link} target="_blank" rel="noopener noreferrer">
      {featured.label}
    </a>
  );
}

// Cards on the desktop, behind the windows and the icons: the newest post, and something featured for now. Both
// come from the content at build time (see vite.config.ts), so every page has them from its first paint.
function DesktopWidgets() {
  const { latestPost, featured } = widgets;
  if (!latestPost && !featured) {
    return null;
  }

  return (
    <aside className="desktop-widgets" aria-label="Widgets">
      {latestPost && (
        <Link className="desktop-widget desktop-widget--post" to={getPostPath(latestPost.slug)}>
          <span className="desktop-widget__kicker">Latest from the blog</span>
          <span className="desktop-widget__title">{latestPost.title}</span>
          <span className="desktop-widget__text">{latestPost.summary}</span>
          <span className="desktop-widget__date">{formatPostDate(latestPost.date)}</span>
        </Link>
      )}
      {featured && (
        <article className="desktop-widget desktop-widget--featured">
          {featured.image && (
            <img className="desktop-widget__image" src={featured.image} alt="" width={84} height={84} />
          )}
          <div className="desktop-widget__body">
            <span className="desktop-widget__kicker">Featured</span>
            <h2 className="desktop-widget__title">{featured.title}</h2>
            <p className="desktop-widget__text">{featured.text}</p>
            <div className="desktop-widget__footer">
              <span className="desktop-widget__date">{formatPostDate(featured.date)}</span>
              <FeaturedLink featured={featured} />
            </div>
          </div>
        </article>
      )}
    </aside>
  );
}

export default DesktopWidgets;

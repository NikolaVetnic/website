import type { MouseEvent } from "react";
import { useNavigate } from "react-router";

import "./Prose.css";

type ProseProps = {
  // Rendered from Markdown at build time (see content/markdown.server.ts).
  html: string;
  className?: string;
  lang?: string;
};

// Rendered Markdown. Links within the site move the window instead of reloading the page; links out open a new
// tab (see markdown.server.ts).
function Prose({ html, className, lang }: ProseProps) {
  const navigate = useNavigate();

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    const link = (event.target as Element).closest("a");
    if (
      !link ||
      link.target ||
      link.origin !== window.location.origin ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();
    navigate(link.pathname + link.search + link.hash);
  };

  return (
    <div
      className={className ? `prose ${className}` : "prose"}
      lang={lang}
      onClick={handleClick}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export default Prose;

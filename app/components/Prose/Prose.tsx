import { useEffect, useRef, type MouseEvent } from "react";
import { useNavigate } from "react-router";

import { getPlayerSource, parsePlayer, toHex } from "~/content/players";
import { drawDiagrams } from "./diagrams";
import "./Prose.css";

type ProseProps = {
  // Rendered from Markdown at build time (see content/markdown.server.ts).
  html: string;
  className?: string;
  lang?: string;
};

// Puts a player's own player in place of its button: only now does the page reach the service.
function startPlayer(figure: HTMLElement) {
  const player = parsePlayer(figure.dataset.player ?? "");
  const button = figure.querySelector<HTMLButtonElement>(".prose-player__start");
  if (!player || !button) {
    return;
  }

  const style = getComputedStyle(figure);
  const iframe = document.createElement("iframe");
  iframe.className = "prose-player__frame";
  iframe.src = getPlayerSource(player, {
    background: toHex(style.getPropertyValue("--raised")),
    accent: toHex(style.getPropertyValue("--accent")),
  });
  iframe.title = figure.querySelector(".prose-player__name")?.textContent ?? "Player";
  iframe.allow = "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";
  iframe.allowFullscreen = true;
  button.replaceWith(iframe);
  iframe.focus();
}

// Rendered Markdown. Links within the site move the window instead of reloading the page; links out open a new
// tab (see markdown.server.ts). Diagrams are drawn once the page runs, and again when the theme or accent changes.
// Players load when their button is pressed.
function Prose({ html, className, lang }: ProseProps) {
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container?.querySelector(".prose-diagram")) {
      return;
    }

    void drawDiagrams(container);
    const observer = new MutationObserver(() => void drawDiagrams(container));
    observer.observe(document.documentElement, { attributeFilter: ["data-theme", "data-accent"] });
    return () => observer.disconnect();
  }, [html]);

  // Clips play on their own like animated pictures, unless the visitor asks for less motion: then they wait,
  // with their controls.
  useEffect(() => {
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    for (const clip of ref.current?.querySelectorAll<HTMLVideoElement>(".prose-clip") ?? []) {
      clip.autoplay = false;
      clip.pause();
      clip.controls = true;
    }
  }, [html]);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    const start = (event.target as Element).closest(".prose-player__start");
    if (start) {
      startPlayer(start.closest<HTMLElement>(".prose-player")!);
      return;
    }

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
      ref={ref}
      className={className ? `prose ${className}` : "prose"}
      lang={lang}
      onClick={handleClick}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export default Prose;

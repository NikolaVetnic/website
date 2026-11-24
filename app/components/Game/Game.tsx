import Prose from "~/components/Prose/Prose";
import type { Game as GameEntry } from "~/games/games";
import "./Game.css";

type GameProps = {
  // What the game's route loaded at build time: its page.
  data: unknown;
};

function isGamePage(data: unknown): data is { game: GameEntry } {
  return typeof data === "object" && data !== null && "game" in data;
}

// Where the code is, as the button says it.
function getRepoLabel(repo: string): string {
  return new URL(repo).hostname === "github.com" ? "Code on GitHub" : "Code";
}

// A small game's window (Dungeon Gunner, Rogue C): its page, read like a project's.
function Game({ data }: GameProps) {
  if (!isGamePage(data)) {
    return <p className="game__empty">Loading…</p>;
  }

  const { game } = data;
  return (
    <article className="game">
      <h1 className="game__title">{game.title}</h1>
      <p className="game__summary">{game.summary}</p>
      <div className="game__bar">
        <p className="game__facts">
          <span className="game__years">{game.years}</span>
          {game.tech.map((tech) => (
            <span key={tech} className="game__tech">
              {tech}
            </span>
          ))}
        </p>
        {game.repo && (
          <a className="game__repo" href={game.repo} target="_blank" rel="noopener noreferrer">
            {getRepoLabel(game.repo)}
          </a>
        )}
      </div>
      <Prose className="game__body" html={game.html} />
    </article>
  );
}

export default Game;

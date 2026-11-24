import { Link } from "react-router";

import Prose from "~/components/Prose/Prose";
import Tabs from "~/components/Tabs/Tabs";
import {
  getMusicPath,
  getMusicTab,
  MUSIC_TABS,
  type MusicEntry,
  type MusicKind,
  type MusicSummary,
} from "~/music/music";
import "./Music.css";

type MusicProps = {
  // What the Music routes loaded: a tab's cards (`/music`, `/music/bands`, `/music/soundtracks`), one entry
  // (`/music/<slug>`), or one that doesn't exist.
  data: unknown;
};

function isListPage(data: unknown): data is { musicKind: MusicKind; entries: MusicSummary[] } {
  return typeof data === "object" && data !== null && "musicKind" in data && "entries" in data;
}

function isEntryPage(data: unknown): data is { musicEntry: MusicEntry } {
  return typeof data === "object" && data !== null && "musicEntry" in data;
}

function isMissingEntry(data: unknown): boolean {
  return typeof data === "object" && data !== null && "missing" in data;
}

// When, and what it's for or what Nikola did.
function MusicFacts({ years, detail }: { years: string; detail?: string }) {
  return (
    <div className="music__facts">
      <span className="music__years">{years}</span>
      {detail && <span className="music__detail">{detail}</span>}
    </div>
  );
}

// A card: its cover (or, without one, what it's written for in large type), title, line and facts. The title's
// link covers the whole card.
function MusicCard({ entry }: { entry: MusicSummary }) {
  return (
    <li className="music__card">
      {entry.image ? (
        <img className="music__cover" src={entry.image} alt="" loading="lazy" decoding="async" />
      ) : (
        <span className="music__cover music__cover--plain" aria-hidden="true">
          {entry.scoring ?? entry.role ?? entry.title}
        </span>
      )}
      <div className="music__body">
        <h2 className="music__title">
          <Link className="music__link" to={getMusicPath(entry.slug)}>
            {entry.title}
          </Link>
        </h2>
        <p className="music__summary">{entry.summary}</p>
        {/* Without a cover, the panel already says what it's for. */}
        <MusicFacts years={entry.years} detail={entry.image ? (entry.scoring ?? entry.role) : undefined} />
      </div>
    </li>
  );
}

// A tab: its cards under the tabs.
function MusicList({ kind, entries }: { kind: MusicKind; entries: MusicSummary[] }) {
  return (
    <div className="music-page">
      <Tabs label="Music" tabs={MUSIC_TABS} current={getMusicTab(kind).path} />
      {entries.length === 0 ? (
        <p className="music__empty">Nothing here yet.</p>
      ) : (
        <ul className="music">
          {entries.map((entry) => (
            <MusicCard key={entry.slug} entry={entry} />
          ))}
        </ul>
      )}
    </div>
  );
}

function BackLink({ kind }: { kind: MusicKind }) {
  const tab = getMusicTab(kind);
  return (
    <Link className="music__back" to={tab.path}>
      ← {tab.title}
    </Link>
  );
}

// An entry's page, read like a post, with its players in the text and where else to hear it under the title.
function MusicEntryPage({ entry }: { entry: MusicEntry }) {
  return (
    <article className="music-entry">
      <BackLink kind={entry.kind} />
      <h1 className="music-entry__title">{entry.title}</h1>
      <p className="music-entry__summary">{entry.summary}</p>
      <div className="music-entry__bar">
        <MusicFacts years={entry.years} detail={entry.scoring ?? entry.role} />
        {entry.links.length > 0 && (
          <ul className="music-entry__links">
            {entry.links.map((link) => (
              <li key={link.url}>
                <a className="music-entry__link" href={link.url} target="_blank" rel="noopener noreferrer">
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Prose className="music-entry__body" html={entry.html} />
    </article>
  );
}

// The Music window: a tab's cards, or one entry's page.
function Music({ data }: MusicProps) {
  if (isEntryPage(data)) {
    return <MusicEntryPage entry={data.musicEntry} />;
  }
  if (isListPage(data)) {
    return <MusicList kind={data.musicKind} entries={data.entries} />;
  }
  if (isMissingEntry(data)) {
    return (
      <div className="music-entry">
        <BackLink kind={MUSIC_TABS[0].kind} />
        <p className="music__empty">This doesn't exist, or it has moved.</p>
      </div>
    );
  }

  return <p className="music__empty">Loading…</p>;
}

export default Music;

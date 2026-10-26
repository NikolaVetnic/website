import { useState } from "react";
import { Link } from "react-router";

import { ABOUT_TABS, DEFAULT_LANG, type AboutData, type AboutVersion } from "~/about/about";
import Prose from "~/components/Prose/Prose";
import "./About.css";

type AboutProps = {
  // What the About routes loaded: the bio (`/about`) or the resume (`/about/resume`), in all its languages.
  data: unknown;
};

function isAboutData(data: unknown): data is AboutData {
  return typeof data === "object" && data !== null && "versions" in data;
}

// The language picked last, kept while the visitor moves between the tabs, whose content mounts anew each time.
// The page always loads in English, the language the pre-rendered HTML has.
let chosenLang = DEFAULT_LANG;

function LanguageSwitch({
  versions,
  lang,
  onChange,
}: {
  versions: AboutVersion[];
  lang: string;
  onChange: (lang: string) => void;
}) {
  return (
    <div className="about__languages" role="group" aria-label="Language">
      {versions.map((version) => (
        <button
          key={version.lang}
          type="button"
          className="about__language"
          lang={version.lang}
          aria-pressed={version.lang === lang}
          onClick={() => onChange(version.lang)}
        >
          <img className="about__flag" src={version.flag} alt="" width={16} height={12} />
          {version.language}
        </button>
      ))}
    </div>
  );
}

function About({ data }: AboutProps) {
  const [lang, setLang] = useState(chosenLang);

  if (!isAboutData(data)) {
    return <p className="about__loading">Loading…</p>;
  }

  // The chosen language where the page has it, else English.
  const version = data.versions.find((entry) => entry.lang === lang) ?? data.versions[0];
  const choose = (next: string) => {
    chosenLang = next;
    setLang(next);
  };

  return (
    <div className="about">
      <div className="about__bar">
        <nav className="about__tabs" aria-label="About">
          {ABOUT_TABS.map((tab) => (
            <Link
              key={tab.page}
              className="about__tab"
              to={tab.path}
              aria-current={tab.page === data.page ? "page" : undefined}
            >
              {tab.title}
            </Link>
          ))}
        </nav>
        <div className="about__actions">
          {data.versions.length > 1 ? (
            <LanguageSwitch versions={data.versions} lang={version.lang} onChange={choose} />
          ) : null}
          {version.pdf ? (
            <a className="about__pdf" href={version.pdf} target="_blank" rel="noopener noreferrer">
              Download PDF
            </a>
          ) : null}
        </div>
      </div>
      <Prose className={`about__${data.page}`} html={version.html} lang={version.lang} />
    </div>
  );
}

export default About;

import { useState } from "react";
import { Link } from "react-router";

import { ABOUT_TABS, type AboutData, type AboutPage } from "~/about/about";
import Prose from "~/components/Prose/Prose";
import "./About.css";

type AboutProps = {
  // What the About routes loaded: the bio (`/about`) or the resume (`/about/resume`).
  data: unknown;
};

const LANGUAGE_NAMES: Record<string, string> = { en: "English", sr: "Srpski" };

function isAboutData(data: unknown): data is AboutData {
  return typeof data === "object" && data !== null && "page" in data;
}

// The bio's languages, English first: that's what the pre-rendered page shows.
function LanguageSwitch({
  options,
  lang,
  onChange,
}: {
  options: AboutPage[];
  lang: string;
  onChange: (lang: string) => void;
}) {
  return (
    <div className="about__languages" role="group" aria-label="Language">
      {options.map((option) => (
        <button
          key={option.lang}
          type="button"
          className="about__language"
          lang={option.lang}
          aria-pressed={option.lang === lang}
          onClick={() => onChange(option.lang)}
        >
          {LANGUAGE_NAMES[option.lang] ?? option.lang}
        </button>
      ))}
    </div>
  );
}

function About({ data }: AboutProps) {
  const [lang, setLang] = useState("en");

  if (!isAboutData(data)) {
    return <p className="about__loading">Loading…</p>;
  }

  const page = data.page === "resume" ? data.resume : lang === data.bioSr.lang ? data.bioSr : data.bio;

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
        {data.page === "bio" ? (
          <LanguageSwitch options={[data.bio, data.bioSr]} lang={page.lang} onChange={setLang} />
        ) : page.pdf ? (
          <a className="about__pdf" href={page.pdf} target="_blank" rel="noopener noreferrer">
            Download PDF
          </a>
        ) : null}
      </div>
      <Prose className={`about__${data.page}`} html={page.html} lang={page.lang} />
    </div>
  );
}

export default About;

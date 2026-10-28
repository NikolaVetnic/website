import { KICKSTARTER, TAGLINE } from "../content";
import hero1280 from "../images/hero-1280.webp";
import hero2400 from "../images/hero-2400.webp";
import logo from "../images/logo.webp";
import "./Hero.css";

// The Square of Chapter IV behind the logo, which carries the taglines ("A classic point-n’-click adventure game",
// "Independently developed by Svarun Entertainment").
const Hero = () => (
  <section id="top" className="hero">
    <img
      className="hero__art"
      src={hero1280}
      srcSet={`${hero1280} 1280w, ${hero2400} 2400w`}
      sizes="100vw"
      alt=""
      fetchPriority="high"
    />
    <div className="hero__content">
      <h1 className="hero__title">
        <img
          className="hero__logo"
          src={logo}
          width={1600}
          height={663}
          alt="K’NOSSOS: a classic point-n’-click adventure game, independently developed by Svarun Entertainment"
        />
      </h1>
      <p className="hero__tagline">{TAGLINE}</p>
      <div className="hero__actions">
        <a className="button button--primary" href="#download">
          Play the free Prologue
        </a>
        <a className="button button--ghost" href="#trailer">
          Watch the trailer
        </a>
      </div>
      <p className="hero__platforms">Windows · macOS · English</p>
      <a className="hero__kickstarter" href={KICKSTARTER.href} target="_blank" rel="noopener noreferrer">
        Funded on Kickstarter by {KICKSTARTER.backers} backers ↗
      </a>
    </div>
  </section>
);

export default Hero;

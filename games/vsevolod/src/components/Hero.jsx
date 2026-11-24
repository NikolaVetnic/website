import hero1280 from "../images/hero-1280.webp";
import hero2160 from "../images/hero-2160.webp";
import "./Hero.css";

// The cover, the two elders facing each other across a cold white sky, with the title in the sky between them.
const Hero = () => (
  <section id="top" className="hero">
    <img
      className="hero__art"
      src={hero1280}
      srcSet={`${hero1280} 1280w, ${hero2160} 2160w`}
      sizes="100vw"
      alt=""
      fetchPriority="high"
    />
    <div className="hero__content">
      <div className="hero__heading">
        <h1 className="hero__title">VSEVOLOD</h1>
        <p className="hero__tagline">A classic point-and-click adventure</p>
      </div>
      <div className="hero__actions">
        <a className="button button--primary" href="#download">
          Play the Prologue
        </a>
        <a className="button button--ghost" href="#screenshots">
          See the screenshots
        </a>
      </div>
      <p className="hero__credit">Svarun Entertainment · Prologue, 2012</p>
    </div>
  </section>
);

export default Hero;

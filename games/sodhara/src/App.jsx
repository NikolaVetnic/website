import "./App.css";

import splashPortrait from "./Images/splash_portrait.jpg";

import evasionDemo from "./Images/gif/evasion-demo.gif";
import tripleJumpAndBall from "./Images/gif/triple-jump-and-ball.gif";
import bombJump from "./Images/gif/bomb-jump.gif";
import iceBeamDemo from "./Images/gif/ice-beam-demo.gif";
import wallClingAndDash from "./Images/gif/wall-cling-and-dash.gif";

import { Header, MobileHeader } from "./Components/Header/Header";
import VerticalLogoOverlay from "./Components/LogoOverlay/Vertical/VerticalLogoOverlay";
import TextBlock from "./Components/TextBlock/TextBlock";
import Feature from "./Components/Feature/Feature";
import Footer from "./Components/Footer/Footer";
import Gallery from "./Components/Gallery/Gallery";
import Trailer from "./Components/Trailer/Trailer";

const LandingPage = () => {
  const features = [
    {
      image: tripleJumpAndBall,
      overtitle: "Experience the motion unbound",
      title: "Mobility",
      text: "SODHARA offers a plethora of ways to traverse its vast game world. String together divergent moveset elements to explore hidden secrets tucked away in even the most unreachable places.",
      highlights: ["a plethora of ways to traverse", "hidden secrets"],
      textLeft: true,
    },
    {
      image: wallClingAndDash,
      overtitle: "Conquer the vertical world",
      title: "Agility",
      text: "Expansive levels unfold in every direction, beckoning the intrepid explorer to scale towering peaks and venture into the deepest depths. Draw on your dexterity as you chase your goal through the menacing dark.",
      highlights: ["expansive levels", "dexterity"],
      textLeft: false,
    },
    {
      image: bombJump,
      overtitle: "Step beyond the well-worn trail",
      title: "Ingenuity",
      text: "SODHARA rewards curiosity – as your arsenal expands, you’re encouraged to discover new uses for familiar tools. When faced with a challenge, explore, adapt, and think beyond the obvious!",
      highlights: ["curiosity", "new uses for familiar tools"],
      textLeft: true,
    },
    {
      image: evasionDemo,
      overtitle: "Survive against the odds",
      title: "Tenacity",
      text: "Slip past enemies and avoid confrontation, or unleash destruction and wreak havoc on your foes! With a robust arsenal of defensive and offensive abilities, you have many ways to face the dangers that lie in this perilous world.",
      highlights: ["avoid confrontation", "wreak havoc on your foes"],
      textLeft: false,
    },
    {
      image: iceBeamDemo,
      overtitle: "Repurpose the weapons",
      title: "Versatility",
      text: "In SODHARA, no tool or weapon is limited to a single use, and every challenge invites diverse strategies – wield weapons to shape your surroundings, and turn tools into assets in the heat of battle.",
      highlights: ["shape your surroundings", "turn tools into assets"],
      textLeft: true,
    },
  ];

  return (
    <div className="content-container">
      <div className="landing-page">
        <Header />
        <MobileHeader />

        <div className="spacer"></div>

        <section id="splash" className="hero-section">
          <div className="mobile-logo-div">
            <img src={splashPortrait} alt="SplashMobile" className="hero-image" />
            <VerticalLogoOverlay />
          </div>
        </section>

        <section id="features" className="content">
          <AboutSection />
          <FeatureList features={features} />
        </section>

        <section id="screenshots" className="gallery">
          <Gallery />
        </section>

        <section id="trailer" className="trailer">
          <Trailer />
        </section>

        <Footer />
      </div>
    </div>
  );
};

const AboutSection = () => (
  <section id="about">
    <TextBlock
      title="&nbsp; About &nbsp;"
      paragraphs={[
        /* "SODHARA is an actively developed retro-inspired 2D sci-fi Metroidvania, drawing inspiration from the classics of the genre.", */
        "Embark on a journey to explore an uncharted world in search of a motherlode of priceless minerals, for which you have been promised a fortune. Delve deep into the heart of a mysterious city, unravel the secrets of its former denizens, and use your agility and deadly force to defeat the evil that brought them to ruin.",
        "Or, should you choose, surrender to the darkness and allow the hollow void to engulf you whole.",
      ]}
      highlights={[
        "uncharted world",
        "promised a fortune",
        "sodhara",
        "actively developed",
        "metroidvania",
        "uncharted planet",
        "mysterious city",
        "secrets",
        "agility",
        "deadly force",
        "surrender to the darkness",
        "hollow void",
      ]}
    />
  </section>
);

const FeatureList = ({ features }) => (
  <div className="features">
    {features.map((feature, index) => (
      <Feature
        key={index}
        image={feature.image}
        overtitle={feature.overtitle}
        title={feature.title}
        text={feature.text}
        highlights={feature.highlights}
        textLeft={feature.textLeft}
      />
    ))}
  </div>
);

export default LandingPage;

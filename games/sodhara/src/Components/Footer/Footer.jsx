import React from "react";
import "./Footer.css";

// Import local images
import itchioIcon from "../../Images/itchio.png";
import discordIcon from "../../Images/discord.png";
import companyLogosImage from "../../Images/facebook.png";
import overlayIcon1 from "../../Images/twitter.png"; // Add the path to your overlay icons
import overlayIcon2 from "../../Images/discord.png"; // Add the path to your overlay icons
import CheckboxWithText from "./CheckboxWithText/CheckboxWithText";

const Footer = () => {
  return (
    <footer className="footer">
      <SocialMediaSection />
      {/* <NewsletterSection /> */}
      {/* <LogosSection /> */}
      <LegalText />
    </footer>
  );
};

const SocialMediaSection = () => {
  return (
    <div className="social-media">
      <a href="https://nikolavetnic.itch.io/sodhara" target="_blank" rel="noopener noreferrer">
        <img src={itchioIcon} alt="Twitter" />
      </a>
      <a href="https://discord.gg/WDjnXeHe" target="_blank" rel="noopener noreferrer">
        <img src={discordIcon} alt="Discord" />
      </a>
    </div>
  );
};

const NewsletterSection = () => {
  return (
    <div className="newsletter">
      <h3>Sign up for the Game Newsletter</h3>
      <form>
        <input type="email" placeholder="Email" />
        <CheckboxWithText text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

const LogosSection = () => {
  return (
    <div className="overlay-image">
      <img src={companyLogosImage} alt="Company Logos" />
      <div className="overlay-icons">
        <img src={overlayIcon1} alt="Overlay Icon 1" />
        <img src={overlayIcon2} alt="Overlay Icon 2" />
      </div>
    </div>
  );
};

const LegalText = () => {
  return (
    <div className="legal-text">
      <p>SODHARA. Developed by Nikola Vetnić. © 2024. SODHARA is a trademark of Nikola Vetnić.</p>
    </div>
  );
};

export default Footer;

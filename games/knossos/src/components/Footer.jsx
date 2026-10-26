import { SOCIAL } from "../content";
import "./Footer.css";

const Footer = () => (
  <footer className="footer">
    <nav className="footer__social" aria-label="K’NOSSOS elsewhere">
      {SOCIAL.map((link) => (
        <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer">
          {link.label}
        </a>
      ))}
    </nav>
    <p className="footer__credit">K’NOSSOS · Independently developed by Svarun Entertainment</p>
  </footer>
);

export default Footer;

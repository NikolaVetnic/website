import { CREDITS } from "../content";
import "./Footer.css";

const Footer = () => (
  <footer className="footer">
    <p className="footer__name">VSEVOLOD</p>
    <dl className="footer__credits">
      {CREDITS.map((credit) => (
        <div key={credit.name} className="footer__credit-row">
          <dt className="footer__role">{credit.role}</dt>
          <dd className="footer__person">{credit.name}</dd>
        </div>
      ))}
    </dl>
    <p className="footer__credit">Svarun Entertainment, 2012. Made with the Wintermute Engine.</p>
  </footer>
);

export default Footer;

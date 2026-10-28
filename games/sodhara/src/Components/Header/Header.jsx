import { useState } from "react";
import "./Header.css";

const MENU_ITEMS = [
  { href: "#about", label: "About" },
  { href: "#features", label: "Features" },
  { href: "#screenshots", label: "Gallery" },
  { href: "#trailer", label: "Video" },
];

// The bar across the top: the game's name, the section links and a Download button that leads to the download
// buttons under the splash. Below 768 px the links fold into a menu.
const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="header">
      <div className="header__inner">
        <a className="header__name" href="#splash" onClick={closeMenu}>
          SODHARA
        </a>
        <nav className={`navbar ${menuOpen ? "active" : ""}`}>
          {MENU_ITEMS.map((item) => (
            <a key={item.href} href={item.href} onClick={closeMenu}>
              {item.label}
            </a>
          ))}
        </nav>
        <a className="header__download" href="#download" onClick={closeMenu}>
          Download
        </a>
        <button
          type="button"
          className="burger-menu"
          aria-label="Menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
};

export default Header;

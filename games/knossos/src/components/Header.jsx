import { useEffect, useState } from "react";

import "./Header.css";

const LINKS = [
  { href: "#story", label: "Story" },
  { href: "#features", label: "Features" },
  { href: "#trailer", label: "Trailer" },
  { href: "#screenshots", label: "Screenshots" },
  { href: "#soundtrack", label: "Soundtrack" },
];

// Clear over the hero, solid once the page scrolls. On narrow screens the links fold into a menu.
const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`header${isScrolled || isOpen ? " header--solid" : ""}`}>
      <a className="header__name" href="#top">
        K’NOSSOS
      </a>
      <button
        type="button"
        className="header__menu"
        aria-expanded={isOpen}
        aria-controls="header-links"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="visually-hidden">Menu</span>
        <span className="header__menu-bar" />
        <span className="header__menu-bar" />
        <span className="header__menu-bar" />
      </button>
      <nav id="header-links" className={`header__links${isOpen ? " header__links--open" : ""}`} aria-label="Sections">
        {LINKS.map((link) => (
          <a key={link.href} className="header__link" href={link.href} onClick={() => setIsOpen(false)}>
            {link.label}
          </a>
        ))}
        <a className="button button--ghost header__download" href="#download" onClick={() => setIsOpen(false)}>
          Download
        </a>
      </nav>
    </header>
  );
};

export default Header;

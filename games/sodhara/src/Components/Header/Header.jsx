import { useState } from "react";
import "./Header.css";

const Header = () => {
    return (
        <header className="header">
            <nav className="navbar active">
                <a href="#features">About</a>
                <a href="#screenshots">Gallery</a>
                <a href="#trailer">Video</a>
            </nav>
            <nav className="navbar active">
                {/*
                <a
                    className="action-button"
                    href="https://nikolapacekvetnic.rs/?page_id=1799"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Donate
                </a>
                */}
            </nav>
        </header>
    );
};

const MobileHeader = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => setMenuOpen((prev) => !prev);

    const menuItems = [
        { href: "#features", label: "About" },
        { href: "#screenshots", label: "Gallery" },
        { href: "#trailer", label: "Video" },
    ];

    return (
        <header className="mobile-header">
            <BurgerMenu toggleMenu={toggleMenu} />
            <nav className={`navbar ${menuOpen ? "active" : ""}`}>
                {menuItems.map((item, index) => (
                    <NavItem key={index} {...item} toggleMenu={toggleMenu} />
                ))}
            </nav>
            <div className="mobile-header-buttons action-button">
                {/*
                <button
                    onClick={() =>
                        window.open(
                            "https://nikolapacekvetnic.rs/?page_id=1799",
                            "_blank",
                            "noopener,noreferrer"
                        )
                    }
                >
                    Donate
                </button>
                */}
            </div>
        </header>
    );
};

const BurgerMenu = ({ toggleMenu }) => (
    <div className="burger-menu" onClick={toggleMenu}>
        <div></div>
        <div></div>
        <div></div>
    </div>
);

const NavItem = ({ href, label, toggleMenu }) => (
    <a href={href} onClick={toggleMenu}>
        {label}
    </a>
);

export { Header, MobileHeader };

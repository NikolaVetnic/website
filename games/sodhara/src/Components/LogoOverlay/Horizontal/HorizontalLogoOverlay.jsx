import React from "react";

import "./HorizontalLogoOverlay.css";

import AvailablePlatforms from "../BadgeList/PresetLists/AvailablePlatforms";
import SocialMedia from "../BadgeList/PresetLists/SocialMedia";

import logoWithSubtitle from "../../../Images/logo_with-subtitle.png";
import logoWithoutSubtitle from "../../../Images/logo_without-subtitle.png";

const useSmallLogoBelowPx = 1024;

const HorizontalLogoOverlay = () => {
    return (
        <div className="flexbox-container">
            <div className="horizontal-logo-overlay">
                <div className="horizontal-logo-overlay-content">
                    <GameLogo />
                </div>
                <SocialMedia />
                <AvailablePlatforms />
            </div>
        </div>
    );
};

const GameLogo = () => {
    return (
        <picture>
            <source
                srcSet={logoWithoutSubtitle}
                media={`(max-width: ${useSmallLogoBelowPx}px)`}
            />
            <img src={logoWithSubtitle} alt="Game Logo" className="game-logo" />
        </picture>
    );
};

export default HorizontalLogoOverlay;

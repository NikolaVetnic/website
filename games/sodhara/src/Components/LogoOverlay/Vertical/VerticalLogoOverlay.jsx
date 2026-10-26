import "./VerticalLogoOverlay.css";

import AvailablePlatforms from "../BadgeList/PresetLists/AvailablePlatforms";
import logoWithoutSubtitle from "../../../Images/logo_without-subtitle.webp";

const VerticalLogoOverlay = () => {
  return (
    <div className="vertical-logo-overlay">
      <div className="top-overlay">
        <img src={logoWithoutSubtitle} alt="Game Logo" className="logo-image" />
      </div>
      <div className="bottom-overlay">
        <AvailablePlatforms />
      </div>
    </div>
  );
};

export default VerticalLogoOverlay;

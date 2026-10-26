import BadgeList from "../BadgeList";

import windowsLogo from "../../../../Images/windows.png";
import macosLogo from "../../../../Images/macos.png";

const AvailablePlatforms = () => {
  // Version 0.4.7 on Google Drive; the links open in a new tab, since Drive won't show inside the SODHARA window.
  const platformBadges = [
    {
      href: "https://drive.google.com/file/d/12zs5m_L-NwICbAot_Y19LcrymbqwDK6m/view?usp=drive_link",
      src: windowsLogo,
      alt: "Windows",
    },
    {
      href: "https://drive.google.com/file/d/12zKE4unjpjzNZb-u7raBsL6CQgU4De8A/view?usp=drive_link",
      src: macosLogo,
      alt: "MacOS",
    },
  ];

  return (
    <BadgeList
      caption="Download for"
      fontSize="clamp(0.125rem, 2vw + 0.125rem, 1.5rem)"
      gap="20%"
      imgHeight="clamp(40px, 10vw, 100px)"
      badges={platformBadges}
    />
  );
};

export default AvailablePlatforms;

import React from "react";

import BadgeList from "../BadgeList";

import windowsLogo from "../../../../Images/windows.png";
import macosLogo from "../../../../Images/macos.png";

const AvailablePlatforms = () => {
  const platformBadges = [
    {
      href: "/releases/sodhara-win_v0.4.7_20240727-1458.zip",
      src: windowsLogo,
      alt: "Windows",
    },
    {
      href: "/releases/sodhara-mac_v0.4.7_20240727-1458.zip",
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

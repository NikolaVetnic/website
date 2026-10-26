import BadgeList from "../BadgeList";

import itchioLogo from "../../../../Images/itchio.png"; // Add the path to your overlay icons
import discordLogo from "../../../../Images/discord.png"; // Add the path to your overlay icons

const SocialMedia = () => {
  const socialBadges = [
    {
      href: "https://nikolavetnic.itch.io/sodhara",
      src: itchioLogo,
      alt: "itch.io Logo",
    },
    {
      href: "https://nikolavetnic.itch.io/sodhara",
      src: discordLogo,
      alt: "Discord Logo",
    },
  ];

  return (
    <BadgeList
      caption="Join the Community"
      fontSize="clamp(0.125rem, 1.5vw + 0.125rem, 1.25rem)"
      gap="15%"
      imgHeight="clamp(20px, 6vw, 60px)"
      badges={socialBadges}
    />
  );
};

export default SocialMedia;

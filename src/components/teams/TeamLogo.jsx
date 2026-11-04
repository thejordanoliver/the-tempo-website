import { useSyncExternalStore } from "react";
import { getResolvedTheme, subscribeTheme } from "../../app/theme.js";
import { teamIdentity, teamLogoSource } from "../../data/teams/teamIdentity.js";
import { Image } from "../ui/Image.jsx";
export default function TeamLogo({
  team,
  league,
  alt = "",
  forceDark = false,
  ...props
}) {
  const identity = teamIdentity(team, league);
  const theme = useSyncExternalStore(
    subscribeTheme,
    getResolvedTheme,
    () => "system",
  );
  return (
    <picture className="team-logo">
      <Image
        src={teamLogoSource(identity, theme, forceDark)}
        alt={alt}
        {...props}
      />
    </picture>
  );
}

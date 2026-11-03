import { teamIdentity } from "../../data/teams/teamIdentity.js";
import { Image } from "../ui/Image.jsx";
import ThemeSource from "../ui/ThemeSource.jsx";
export default function TeamLogo({
  team,
  league,
  alt = "",
  forceDark = false,
  ...props
}) {
  const identity = teamIdentity(team, league);
  return (
    <picture className="team-logo">
      {!forceDark && identity.logoDark && (
        <ThemeSource srcSet={identity.logoDark} />
      )}
      <Image
        src={forceDark ? identity.logoDark || identity.logo : identity.logo}
        alt={alt}
        {...props}
      />
    </picture>
  );
}

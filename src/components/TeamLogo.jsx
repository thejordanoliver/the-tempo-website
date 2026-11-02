import ThemeSource from "./ThemeSource.jsx";
import { Image } from "../components.jsx";
import { teamIdentity } from "../teamIdentity.js";
export default function TeamLogo({ team, league, alt = "", forceDark = false, ...props }) {
  const identity = teamIdentity(team, league);
  return (
    <picture className="team-logo">
      {!forceDark && identity.logoDark && (
        <ThemeSource
          srcSet={identity.logoDark}
        />
      )}
      <Image src={forceDark ? identity.logoDark || identity.logo : identity.logo} alt={alt} {...props} />
    </picture>
  );
}

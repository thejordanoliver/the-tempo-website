import { Image } from "../components.jsx";
import { teamIdentity } from "../teamIdentity.js";
export default function TeamLogo({ team, league, alt = "", ...props }) {
  const identity = teamIdentity(team, league);
  return (
    <picture className="team-logo">
      {identity.logoDark && (
        <source
          media="(prefers-color-scheme: dark)"
          srcSet={identity.logoDark}
        />
      )}
      <Image src={identity.logo} alt={alt} {...props} />
    </picture>
  );
}

import ThemeSource from "./ThemeSource.jsx";
import { conferenceIdentity } from "../conferences.js";
import { Image } from "../components.jsx";
export default function ConferenceBadge({ conference, league }) {
  const item = conferenceIdentity(conference, league);
  if (!item) return null;
  return (
    <span className="team-conference">
      {item.logo && (
        <picture>
          <ThemeSource srcSet={item.logoDark} />
          <Image src={item.logo} alt="" />
        </picture>
      )}
      <span>{item.shortName}</span>
    </span>
  );
}

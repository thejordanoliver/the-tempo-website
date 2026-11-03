import { teamIdentity } from "../../data/teams/teamIdentity.js";
import TeamLogo from "../teams/TeamLogo.jsx";
import { Image } from "../ui/Image.jsx";
import "./DraftList.css";

const basketballPositions = {
  1: "PG",
  2: "SG",
  3: "G",
  5: "SF",
  6: "PF",
  7: "F",
  9: "C",
};
const footballPositions = {
  8: "QB",
  9: "RB",
  1: "WR",
  7: "TE",
  10: "FB",
  46: "OT",
  47: "OG",
  91: "C",
  32: "DT",
  30: "LB",
  264: "EDGE",
  29: "CB",
  36: "S",
  96: "LS",
  80: "PK",
  94: "P",
};

export default function DraftList({ data, league }) {
  const teams = Array.isArray(data.teams) ? data.teams : [];
  const currentPick =
    data.current?.pickId ??
    data.picks.find((pick) => pick.status === "ON_THE_CLOCK" && !pick.athlete)
      ?.overall;
  const positions = league === "nfl" ? footballPositions : basketballPositions;

  return (
    <ol className="draft-list" aria-label="Draft picks">
      {data.picks.map((pick) => {
        const athlete = pick.athlete;
        const team = teams.find(
          (item) => String(item.id) === String(pick.teamId),
        ) || { id: pick.teamId };
        const identity = teamIdentity(team, league);
        const status =
          pick.status === "PICK_IS_IN"
            ? "PICK IS IN"
            : currentPick != null &&
                Number(currentPick) === Number(pick.overall)
              ? "ON THE CLOCK"
              : null;
        const position = positions[athlete?.positionId] || athlete?.positionId;
        return (
          <li
            className="draft-card"
            key={pick.overall ?? `${pick.round}-${pick.pick}`}
          >
            <div className="draft-background" aria-hidden="true">
              <TeamLogo team={team} league={league} loading="lazy" />
            </div>
            <div className="draft-content">
              <div className="draft-player-row">
                {status ? (
                  <h3 className="draft-status">{status}</h3>
                ) : (
                  <div className="draft-player">
                    <span className="draft-headshot">
                      <span aria-hidden="true">
                        {athlete?.name
                          ?.split(/\s+/)
                          .map((part) => part[0])
                          .slice(0, 2)
                          .join("") || "—"}
                      </span>
                      <Image
                        src={athlete?.headshot}
                        alt={athlete ? `${athlete.name} headshot` : ""}
                        loading="lazy"
                      />
                    </span>
                    <h3>{athlete?.name || "Selection pending"}</h3>
                    {position && (
                      <span className="draft-position">{position}</span>
                    )}
                  </div>
                )}
                <span
                  className="draft-pick"
                  aria-label={`Overall pick ${pick.overall ?? pick.pick}`}
                >
                  #{pick.overall ?? pick.pick}
                </span>
              </div>
              {!status && athlete && (
                <p className="draft-details">
                  {[athlete.college, athlete.height, athlete.weight]
                    .filter(Boolean)
                    .map((value, index) => (
                      <span key={index}>{value}</span>
                    ))}
                </p>
              )}
              <p className="draft-details">
                <span>RD: {pick.round}</span>
                <span>Pick: {pick.pick}</span>
                <span>{team.name || identity.shortName}</span>
              </p>
              {pick.traded && pick.tradeNote && (
                <p className="draft-trade">{pick.tradeNote}</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

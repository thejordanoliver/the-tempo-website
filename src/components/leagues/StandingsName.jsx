import { Link } from "../../app/router.jsx";
import { teamHref, hasTeamLeague } from "../../data/teams/teams.js";
import TeamLogo from "../teams/TeamLogo.jsx";
export default function StandingsName({ team, league }) {
  const fullName = team.name || team.fullName || team.shortName || "Team";
  const code =
    [team.code, team.abbreviation]
      .find((value) => typeof value === "string" && value.trim())
      ?.trim() ||
    team.shortName ||
    team.short_name ||
    fullName;
  return (
    <span className="league-team-name">
      <TeamLogo team={team} league={league} />
      <span>
        {team.id != null && hasTeamLeague(league) ? (
          <Link
            to={teamHref(league, team.id)}
            title={fullName}
            aria-label={fullName}
          >
            {code}
          </Link>
        ) : (
          <span title={fullName}>{code}</span>
        )}
      </span>
    </span>
  );
}

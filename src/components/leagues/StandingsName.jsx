import { Link } from "../../app/router.jsx";
import { teamHref, hasTeamLeague } from "../../data/teams/teams.js";
import TeamLogo from "../teams/TeamLogo.jsx";
export default function StandingsName({ team, league }) {
  return (
    <span className="league-team-name">
      <TeamLogo team={team} league={league} />
      <span>
        {team.id != null && hasTeamLeague(league) ? (
          <Link to={teamHref(league, team.id)}>
            {team.name || team.shortName || team.code || "Team"}
          </Link>
        ) : (
          team.name || team.shortName || team.code || "Team"
        )}
      </span>
    </span>
  );
}

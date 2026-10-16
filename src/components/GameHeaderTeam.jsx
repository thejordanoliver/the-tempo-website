import { teamIdentity } from "../teamIdentity.js";
import TeamLogo from "./TeamLogo.jsx";

export default function GameHeaderTeam({ team, league, postGame, side }) {
  const identity = teamIdentity(team, league);
  const name = team?.code || identity.shortName || "TBD";
  return (
    <div className={`gh-team gh-team-${side}`}>
      <TeamLogo team={team} league={league} />
      <div className="gh-team-label">
        <h2 title={team?.fullName || team?.name || identity.shortName}>
          {team?.rank > 0 && <small>{team.rank} </small>}
          {name}
        </h2>
        {postGame && team?.record && (
          <p className="gh-team-record">{team.record}</p>
        )}
      </div>
    </div>
  );
}

import Football from "../../assets/Football.png";
import FootballLight from "../../assets/FootballLight.png";
import { Link } from "../router.jsx";
import { teamIdentity } from "../teamIdentity.js";
import "./GameCard.css";
import { gameCardModel } from "./gameCardModel.js";
import TeamLogo from "./TeamLogo.jsx";

const footballSource = new URL(Football, import.meta.url).href;
const footballLightSource = new URL(FootballLight, import.meta.url).href;

function Team({ team, side, league }) {
  const name = team?.shortName || team?.name || team?.code || "TBD";
  return (
    <div className={`gc-team gc-${side}`}>
      <div className="gc-logo">
        <TeamLogo team={team} league={league} loading="lazy" />
        <span className="gc-fallback" aria-hidden="true">
          {team?.code || name.slice(0, 3).toUpperCase()}
        </span>
      </div>
      <span className="gc-name" title={name}>
        {team?.rank > 0 && <small>{team.rank} </small>}
        {name}
      </span>
    </div>
  );
}
export default function GameCard({ game, league }) {
  game = {
    ...game,
    home: teamIdentity(game.home, league),
    away: teamIdentity(game.away, league),
  };
  const model = gameCardModel(game, league);
  const teamName = (team) =>
    team?.shortName || team?.name || team?.code || "TBD";
  const value = (side) =>
    model.showRecords ? game[side]?.record || "—" : (game[side]?.score ?? "—");

  const possession = (side) =>
    (league === "nfl" || league === "cfb") &&
    model.live &&
    game.situation?.possession != null &&
    game[side]?.id != null &&
    String(game.situation.possession) === String(game[side].id);
  const score = (side) => (
    <span className="gc-score-slot">
      <span
        className={`gc-score ${model.showRecords ? "gc-record" : ""} ${model.winner && model.winner !== side ? "gc-loser" : ""}`}
      >
        {value(side)}
      </span>
      {possession(side) && (
        <picture
          className="gc-possession"
          role="img"
          aria-label="Has possession"
        >
          <source
            media="(prefers-color-scheme: dark)"
            srcSet={footballLightSource}
          />
          <img src={footballSource} alt="" width="22" height="22" />
        </picture>
      )}
    </span>
  );
  return (
    <Link
      to={`/game/?league=${encodeURIComponent(league)}&id=${encodeURIComponent(game.id)}`}
      className={`tempo-game-card ${model.championship ? "gc-championship" : ""} ${model.headline ? "gc-has-headline" : ""}`}
      aria-label={`${teamName(game.away)} ${value("away")}, ${teamName(game.home)} ${value("home")}. ${model.primary}${model.secondary ? " · " + model.secondary : ""}. View game details.`}
    >
      {model.headline && (
        <span className="gc-headline" title={model.headline}>
          {model.headline}
        </span>
      )}
      <Team team={game.away} side="away" league={league} />
      {score("away")}
      <div className="gc-info">
        <div className={`gc-status ${model.final ? "gc-final" : ""}`}>
          <span>{model.primary}</span>
          {model.secondary && (
            <>
              <span className="gc-status-divider" aria-hidden="true" />
              <span className={model.live ? "gc-clock" : ""}>
                {model.secondary}
              </span>
            </>
          )}
        </div>
        {model.broadcast && (
          <span className="gc-broadcast" title={model.broadcast}>
            {model.broadcast}
          </span>
        )}
        {(league === "nfl" || league === "cfb") &&
          model.live &&
          game.situation?.downDistanceText && (
            <span className="gc-context">
              {game.situation.downDistanceText}
            </span>
          )}
      </div>
      {score("home")}
      <Team team={game.home} side="home" league={league} />
    </Link>
  );
}

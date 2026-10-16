import { gameCardModel } from "./gameCardModel.js";
import "./GameHeader.css";
import GameHeaderTeam from "./GameHeaderTeam.jsx";
export function HeaderScore({ team, side, model }) {
  const value = model.showRecords ? team?.record || "—" : (team?.score ?? "—");
  const lost = model.winner && model.winner !== side;
  return (
    <div
      className={`gh-value ${model.showRecords ? "gh-pregame-record" : "gh-score"} ${lost ? "gh-loser" : ""}`}
      aria-label={`${side === "away" ? "Away" : "Home"} ${model.showRecords ? "record" : "score"} ${value}`}
    >
      {value}
    </div>
  );
}
export default function GameHeader({ score, details = {}, league }) {
  const model = gameCardModel(
    {
      ...score,
      headline: details.headline,
      broadcasts: details.broadcasts?.length
        ? details.broadcasts
        : details.broadcast
          ? [details.broadcast]
          : [],
    },
    league,
  );
  return (
    <section className="game-header" aria-label="Game scoreboard">
      <h1 className="sr-only">
        {score.away.code || score.away.name || "Away"} at{" "}
        {score.home.code || score.home.name || "Home"}
      </h1>
      <div className="gh-matchup">
        <GameHeaderTeam
          team={score.away}
          league={league}
          postGame={model.final}
          side="away"
        />
        <HeaderScore team={score.away} side="away" model={model} />
        <div className="gh-info">
          <p className="gh-league">{league.toUpperCase()}</p>
          <p className={`gh-status ${model.final ? "gh-final" : ""}`}>
            <span>{model.primary}</span>
            {model.secondary && (
              <span className={model.live ? "gh-clock" : "gh-secondary"}>
                {model.secondary}
              </span>
            )}
          </p>
          {model.broadcast && <p className="gh-broadcast">{model.broadcast}</p>}
        </div>
        <HeaderScore team={score.home} side="home" model={model} />
        <GameHeaderTeam
          team={score.home}
          league={league}
          postGame={model.final}
          side="home"
        />
      </div>
    </section>
  );
}

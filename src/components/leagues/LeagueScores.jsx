import {
  leagueSports,
  scoreGroups,
  playoffGroups,
} from "../../data/leagues/leagues.js";
import EventCard from "../games/EventCard.jsx";
import GameCard from "../games/GameCard.jsx";
import TennisGameCard from "../games/TennisGameCard.jsx";
import Empty from "./EmptyLeagueState.jsx";
const list = (value) => (Array.isArray(value) ? value : []);
export function LeagueScores({ data, league, playoffs = false }) {
  const sport = leagueSports[league];
  const groups = (
    playoffs ? playoffGroups(data) : scoreGroups(data, sport)
  ).filter((group) => group.games.length);
  if (!groups.length)
    return (
      <Empty>
        {playoffs ? "No postseason games." : "No games or events scheduled."}
      </Empty>
    );
  return (
    <div className="league-score-groups">
      {groups.map((group, index) => (
        <section key={index}>
          {group.label && sport !== "mma" && (
            <h3 className="league-group-title">{group.label}</h3>
          )}
          <div
            className={
              sport === "mma"
                ? "ufc-events"
                : sport === "racing"
                  ? "league-events"
                  : "home-games"
            }
          >
            {group.games.map((game, i) => {
              if (sport === "tennis")
                return <TennisGameCard key={game.id || i} match={game} />;
              if (["mma", "racing"].includes(sport))
                return (
                  <EventCard key={game.id || i} game={game} sport={sport} />
                );
              // Tournament responses use a normalized teams array rather than home/away.
              const teams = list(game.teams);
              const view = teams.length
                ? {
                    ...game,
                    home: teams.find((team) => team.homeAway === "home"),
                    away: teams.find((team) => team.homeAway === "away"),
                  }
                : game;
              return (
                <GameCard key={game.id || i} game={view} league={league} />
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

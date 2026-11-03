import { Link } from "../../app/router.jsx";
import { favoriteLeagues } from "../../data/leagues/favoriteLeagues.js";
import { leagueSports, leagueHref } from "../../data/leagues/leagues.js";
import { LeagueLogo } from "../leagues/LeagueLogo.jsx";
import { LeagueScores } from "../leagues/LeagueScores.jsx";
import "./HomeScoreSections.css";

export default function HomeScoreSections({ sections, date }) {
  return (
    <div className="home-score-sections">
      {sections.map(({ league, games }) => {
        const sport = leagueSports[league];
        const unit =
          sport === "tennis"
            ? "match"
            : ["mma", "racing"].includes(sport)
              ? "event"
              : "game";
        const data =
          sport === "tennis"
            ? { matches: games }
            : ["mma", "racing"].includes(sport)
              ? { events: games }
              : { games };
        return (
          <section
            key={league}
            className="home-league-section"
            aria-labelledby={`home-league-${league}`}
          >
            <header className="home-league-heading">
              <div className="home-league-title">
                <LeagueLogo league={league} />
                <div>
                  <h3 id={`home-league-${league}`}>
                    {favoriteLeagues[league].label}
                  </h3>
                  <span className="small">
                    {games.length} {unit}
                    {games.length === 1 ? "" : "s"}
                  </span>
                </div>
              </div>
              <Link
                to={leagueHref(league, { date })}
                aria-label={`View all ${favoriteLeagues[league].label} scores`}
              >
                View league
              </Link>
            </header>
            <LeagueScores league={league} data={data} />
          </section>
        );
      })}
    </div>
  );
}

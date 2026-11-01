import { useState } from "react";
import { Link } from "../router.jsx";
import { favoriteLeagues } from "../favoriteLeagues.js";
import { sportLeagues, leagueHref } from "../leagues.js";
import "../components/League.css";

export function LeagueLogo({ league }) {
  const config = favoriteLeagues[league];
  return (
    <picture className="league-logo">
      <source media="(prefers-color-scheme: dark)" srcSet={config.logoDark} />
      <img src={config.logo} alt="" loading="lazy" />
    </picture>
  );
}
export default function Leagues() {
  const [query, setQuery] = useState("");
  const groups = Object.entries(sportLeagues)
    .map(([sport, leagues]) => [
      sport,
      leagues.filter((league) =>
        `${league} ${favoriteLeagues[league].label} ${sport}`
          .toLowerCase()
          .includes(query.trim().toLowerCase()),
      ),
    ])
    .filter(([, leagues]) => leagues.length);
  return (
    <section className="leagues-page">
      <header className="league-directory-heading">
        <div>
          <p className="eyebrow">Every league. One Tempo.</p>
          <h1>Leagues</h1>
          <p>
            Scores, stories, standings, and conversations from around the sports
            world.
          </p>
        </div>
        <label className="league-search">
          Search leagues
          <input
            type="search"
            placeholder="NBA, soccer, college…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
      </header>
      {!groups.length && (
        <p role="status" className="page-state">
          No leagues match “{query}”. Try another name or sport.
        </p>
      )}
      {groups.map(([sport, leagues]) => (
        <section className="league-sport" key={sport} aria-label={sport}>
          <h2>{sport}</h2>
          <div className="league-grid">
            {leagues.map((league) => (
              <Link
                key={league}
                to={leagueHref(league)}
                className="league-tile"
                style={{ "--league-color": favoriteLeagues[league].color }}
              >
                <LeagueLogo league={league} />
                <div>
                  <h3>{favoriteLeagues[league].label}</h3>
                  <span>Scores &amp; more</span>
                </div>
                <span className="league-tile-arrow" aria-hidden="true">
                  ↗
                </span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </section>
  );
}

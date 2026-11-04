import { useState } from "react";

import { Link } from "../app/router.jsx";
import { LeagueLogo } from "../components/leagues/LeagueLogo.jsx";
import Icon from "../components/ui/Icon.jsx";
import { favoriteLeagues } from "../data/leagues/favoriteLeagues.js";
import { sportLeagues, leagueHref } from "../data/leagues/leagues.js";
import "../components/leagues/League.css";

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
      <h1 className="sr-only">Leagues</h1>
      <div className="league-directory-heading page-toolbar">
        <label className="league-search">
          Search leagues
          <input
            type="search"
            placeholder="NBA, soccer, college…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
      </div>
      {!groups.length && (
        <p role="status" className="page-state">
          No leagues match “{query}”.
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
                </div>
                <Icon name="chevron-forward" className="league-tile-arrow" />
              </Link>
            ))}
          </div>
        </section>
      ))}
    </section>
  );
}

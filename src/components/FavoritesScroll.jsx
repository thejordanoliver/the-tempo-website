import { useRef } from "react";
import { favoriteTeamAssets } from "../favoriteTeamAssets.js";
import HeadingTwo from "./HeadingTwo.jsx";
import TeamLogo from "./TeamLogo.jsx";
import { State } from "../components.jsx";
import "./FavoritesScroll.css";
export default function FavoritesScroll({
  teams = [],
  loading,
  error,
  onRetry,
  selected,
  onSelect,
  supportedLeagues = [],
}) {
  const rail = useRef(null);
  const scroll = (direction) =>
    rail.current?.scrollBy({
      left: direction * rail.current.clientWidth * 0.75,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  return (
    <section className="favorites-section" aria-label="Favorite teams">
      <div className="favorites-heading">
        <HeadingTwo>Favorites</HeadingTwo>
        <div className="favorites-arrows">
          <button
            type="button"
            aria-label="Scroll favorites left"
            onClick={() => scroll(-1)}
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Scroll favorites right"
            onClick={() => scroll(1)}
          >
            ›
          </button>
        </div>
      </div>
      <State loading={loading} error={error} onRetry={onRetry} />
      {!loading &&
        !error &&
        (teams.length ? (
          <div
            className="favorites-scroll"
            ref={rail}
            role="group"
            aria-label="Filter games by favorite team"
            tabIndex={0}
          >
            <button
              type="button"
              className="favorite-item"
              aria-pressed={!selected}
              onClick={() => onSelect(null)}
            >
              <span className="favorite-logo favorite-all" aria-hidden="true">
                ★
              </span>
              <strong>All Games</strong>
            </button>
            {teams.map((savedTeam) => {
              const team = {
                ...savedTeam,
                ...favoriteTeamAssets[`${savedTeam.league}:${savedTeam.id}`],
              };
              const rawColor = team.primaryColor || team.color || "";
              const color = /^#?[0-9a-f]{6}$/i.test(rawColor)
                ? `#${rawColor.replace(/^#/, "")}`
                : "var(--surface)";
              const key = `${team.league}:${team.id}`,
                name =
                  team.shortName ||
                  team.name ||
                  team.fullName ||
                  team.code ||
                  "Team",
                supported = supportedLeagues.includes(team.league);
              return (
                <button
                  className="favorite-item"
                  type="button"
                  key={key}
                  aria-pressed={selected === key}
                  disabled={!supported}
                  title={
                    supported
                      ? `Show ${name} games`
                      : `${team.league.toUpperCase()} games are not available on the website yet`
                  }
                  onClick={() => onSelect(team)}
                >
                  <span
                    className="favorite-logo"
                    style={{ backgroundColor: color }}
                  >
                    <span className="favorite-initials" aria-hidden="true">
                      {team.code || name.slice(0, 3).toUpperCase()}
                    </span>
                    <TeamLogo team={team} league={team.league} loading="lazy" />
                  </span>
                  <strong className="favorite-caption">
                    {name}
                    <span aria-hidden="true"> | </span>
                    <span className="favorite-league">
                      {team.league.toUpperCase()}
                    </span>
                  </strong>
                </button>
              );
            })}
          </div>
        ) : (
          <p className="small">
            Add favorite teams in the Tempo app to see them here.
          </p>
        ))}
    </section>
  );
}

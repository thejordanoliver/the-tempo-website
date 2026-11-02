import { teamHref, hasTeamLeague } from "../teams.js";
import Icon from "./Icon.jsx";
import { favoriteLeagues } from "../favoriteLeagues.js";
import { hasLeague, leagueHref } from "../leagues.js";
import { Link } from "../router.jsx";
import { useRef } from "react";
import { favoriteTeamAssets } from "../favoriteTeamAssets.js";
import HeadingTwo from "./HeadingTwo.jsx";
import TeamLogo from "./TeamLogo.jsx";
import { State } from "../components.jsx";
import "./FavoritesScroll.css";
export default function FavoritesScroll({
  teams = [],
  leagues = [],
  loading,
  error,
  onRetry,
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
    <section
      className="favorites-section"
      aria-label="Favorite leagues and teams"
    >
      <div className="favorites-heading">
        <HeadingTwo>Favorites</HeadingTwo>
        <div className="favorites-arrows">
          <button
            type="button"
            aria-label="Scroll favorites left"
            onClick={() => scroll(-1)}
          >
            <Icon name="chevron-back" size={24} />
          </button>
          <button
            type="button"
            aria-label="Scroll favorites right"
            onClick={() => scroll(1)}
          >
            <Icon name="chevron-forward" size={24} />
          </button>
        </div>
      </div>
      <State loading={loading} error={error} onRetry={onRetry} />
      {!loading &&
        !error &&
        (teams.length || leagues.length ? (
          <div
            className="favorites-scroll"
            ref={rail}
            role="group"
            aria-label="Favorite leagues and team filters"
            tabIndex={0}
          >
            {leagues.filter(hasLeague).map((key) => {
              const config = favoriteLeagues[key];
              return (
                <Link
                  className="favorite-item"
                  to={leagueHref(key)}
                  key={`league:${key}`}
                  title={`View ${config.label} league page`}
                  aria-label={`View ${config.label} league page`}
                >
                  <span
                    className="favorite-logo"
                    style={{ backgroundColor: config.color }}
                  >
                    <picture>
                      <source
                        media="(prefers-color-scheme: dark)"
                        srcSet={config.logoDark}
                      />
                      <img src={config.logo} alt="" loading="lazy" />
                    </picture>
                  </span>
                  <strong className="favorite-caption">
                    {key.toUpperCase()}
                  </strong>
                </Link>
              );
            })}
            {leagues.some(hasLeague) && teams.length > 0 && (
              <span className="favorites-section-divider" aria-hidden="true" />
            )}
            {teams
              .filter((team) => hasTeamLeague(team.league))
              .map((savedTeam) => {
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
                    "Team";
                return (
                  <Link
                    className="favorite-item"
                    key={key}
                    to={teamHref(team.league, team.id)}
                    title={`View ${name} team page`}
                  >
                    <span
                      className="favorite-logo"
                      style={{ backgroundColor: color }}
                    >
                      <TeamLogo
                        team={team}
                        league={team.league}
                        loading="lazy"
                      />
                    </span>
                    <strong className="favorite-caption">
                      {name}
                      {["cfb", "mcbb", "wcbb", "cb", "sb"].includes(
                        team.league,
                      ) && (
                        <>
                          <span
                            className="favorite-label-divider"
                            aria-hidden="true"
                          />
                          <span className="favorite-league">
                            {team.league.toUpperCase()}
                          </span>
                        </>
                      )}
                    </strong>
                  </Link>
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

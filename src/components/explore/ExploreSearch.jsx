import Icon from "../ui/Icon.jsx";
import { useState } from "react";
import { Link } from "../../app/router.jsx";
import {
  resultHref,
  resultKey,
  resultName,
} from "../../data/explore/explore.js";
import useExploreSearch from "../../hooks/useExploreSearch.js";
import { Image } from "../ui/Image.jsx";
import { State } from "../ui/State.jsx";
export default function ExploreSearch({ userId }) {
  const [query, setQuery] = useState(""),
    [scope, setScope] = useState("all"),
    [expanded, setExpanded] = useState(false);
  const search = useExploreSearch(query, scope, userId, expanded ? 25 : 5);
  const searching = query.trim().length > 0;
  const items = searching
    ? search.results
    : search.recent.filter(
        (item) => scope === "all" || `${item.type}s` === scope,
      );
  return (
    <section className="explore-search" aria-labelledby="explore-search-title">
      <h2 id="explore-search-title" className="sr-only">
        Search
      </h2>
      <div className="explore-search-fields">
        <label className="explore-search-label">
          <Icon name="search" size={21} />
          <span className="sr-only">Search players, teams and fans</span>
          <input
            type="search"
            value={query}
            maxLength={80}
            placeholder="Players, teams, fans…"
            onChange={(event) => {
              setQuery(event.target.value);
              setExpanded(false);
            }}
          />
        </label>
        <div className="explore-search-scopes" aria-label="Search categories">
          {["all", "players", "teams", "users"].map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={scope === value}
              onClick={() => {
                setScope(value);
                setExpanded(false);
              }}
            >
              {value === "users"
                ? "Fans"
                : value[0].toUpperCase() + value.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <State
        loading={search.loading}
        error={search.error}
        empty={
          searching && !search.loading && !search.error
            ? query.trim().length < 2
              ? "Enter at least 2 characters."
              : !items.length
                ? "No matches. Try another search."
                : null
            : null
        }
      />
      {!search.loading && !search.error && items.length > 0 && (
        <>
          <h3>{searching ? "Search results" : "Recent searches"}</h3>
          <ul className="explore-results">
            {items.map((item) => {
              const url = resultHref(item);
              const content = (
                <>
                  <span className="explore-result-image">
                    <Image
                      src={
                        item.headshot_url || item.logo || item.profileImageUrl
                      }
                    />
                  </span>
                  <span>
                    <strong>{resultName(item)}</strong>
                    <small>
                      {item.type === "user"
                        ? `@${item.username}`
                        : `${item.affiliation?.toUpperCase() || ""} · ${item.type}${item.position ? ` · ${item.position}` : ""}`}
                      {!url ? " · Profile unavailable" : ""}
                    </small>
                  </span>
                </>
              );
              return (
                <li key={resultKey(item)}>
                  {url ? (
                    <Link to={url} onClick={() => search.remember(item)}>
                      {content}
                    </Link>
                  ) : (
                    <div>{content}</div>
                  )}
                  {!searching && (
                    <button
                      type="button"
                      aria-label={`Remove ${resultName(item)} from recent searches`}
                      onClick={() => search.remove(item)}
                    >
                      ×
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
          {searching && !expanded && items.length >= 5 && (
            <button
              type="button"
              className="tempo-button outline"
              onClick={() => setExpanded(true)}
            >
              More results
            </button>
          )}
        </>
      )}
    </section>
  );
}

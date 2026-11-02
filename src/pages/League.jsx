import Icon from "../components/Icon.jsx";
import { useState } from "react";
import { Link, navigate } from "../router.jsx";
import { State, useResource } from "../components.jsx";
import { favoriteLeagues } from "../favoriteLeagues.js";
import {
  hasLeague,
  leagueHref,
  leagueTabs,
  leagueSports,
  leagueResource,
  defaultSeason,
} from "../leagues.js";
import { LeagueLogo } from "./Leagues.jsx";
import { localDate } from "./Home.jsx";
import GameDatePicker from "../components/GameDatePicker.jsx";
import {
  LeagueNews,
  LeagueScores,
  LeagueStandings,
  LeagueStats,
  LeagueRecords,
} from "../components/LeagueContent.jsx";
import "../components/League.css";

const yearTabs = [
  "standings",
  "stats",
  "draft",
  "recruits",
  "awards",
  "playoffs",
  "bracket",
  "transactions",
  "rankings",
];
const label = (tab) =>
  tab === "stats" ? "Stats" : tab[0].toUpperCase() + tab.slice(1);
function ResourcePanel({ path, league, tab, page, onPageChange }) {
  const [version, setVersion] = useState(0);
  const resource = useResource(path, version),
    { data, loading, error } = resource;
  const more =
    tab === "news"
      ? (data?.hasMore ?? data?.articles?.length === 12)
      : tab === "forum"
        ? page < data?.pagination?.totalPages
        : tab === "transactions"
          ? page < data?.pageCount
          : false;
  return (
    <>
      <div className="league-panel-heading">
        <h2>{label(tab)}</h2>
        <button
          type="button"
          className="league-text-button"
          disabled={loading}
          onClick={() => setVersion((value) => value + 1)}
        >
          Refresh {tab}
        </button>
      </div>
      <State {...resource} onRetry={() => setVersion((value) => value + 1)} />
      {!loading && !error && (
        <>
          {tab === "news" ? (
            <LeagueNews data={data} />
          ) : ["scores", "fights", "playoffs", "bracket"].includes(tab) ? (
            <LeagueScores
              data={data}
              league={league}
              playoffs={["playoffs", "bracket"].includes(tab)}
            />
          ) : tab === "standings" ? (
            <LeagueStandings data={data} league={league} />
          ) : tab === "stats" ? (
            <LeagueStats data={data} />
          ) : (
            <LeagueRecords data={data} tab={tab} league={league} />
          )}
        </>
      )}
      {["news", "forum", "transactions"].includes(tab) &&
        (page > 1 || more) && (
          <div className="league-pagination" aria-label="Results pages">
            <button
              disabled={loading || page === 1}
              onClick={() => onPageChange(page - 1)}
            >
              Previous
            </button>
            <span aria-live="polite">Page {page}</span>
            <button
              disabled={loading || !more}
              onClick={() => onPageChange(page + 1)}
            >
              Next
            </button>
          </div>
        )}
    </>
  );
}
export default function League({ search = "", signedIn = false }) {
  const params = new URLSearchParams(search),
    league = (params.get("league") || "").toLowerCase();
  if (!hasLeague(league))
    return (
      <section className="leagues-page">
        <h1>League not found</h1>
        <p>Choose a league to see its latest scores and stories.</p>
        <Link to="/leagues/">Browse all leagues</Link>
      </section>
    );
  const config = favoriteLeagues[league],
    tabs = leagueTabs(league);
  const tab = tabs.includes(params.get("tab")) ? params.get("tab") : tabs[0];
  const requestedDate = params.get("date"),
    date =
      /^\d{4}-\d{2}-\d{2}$/.test(requestedDate || "") &&
      !Number.isNaN(new Date(requestedDate).valueOf())
        ? requestedDate
        : localDate();
  const requestedYear = Number(params.get("season"));
  const season =
    Number.isInteger(requestedYear) &&
    requestedYear >= 1900 &&
    requestedYear <= new Date().getFullYear() + 2
      ? requestedYear
      : tab === "draft" || tab === "transactions"
        ? new Date().getFullYear()
        : tab === "recruits"
          ? new Date().getFullYear() + (new Date().getMonth() > 3 ? 1 : 0)
          : defaultSeason(league);
  const page = Math.max(
    1,
    Math.min(Number.parseInt(params.get("page"), 10) || 1, 10000),
  );
  const week = /^([1-9]|1[0-9]|2[0-2])$/.test(params.get("week") || "")
    ? params.get("week")
    : "";
  const seasonType = ["1", "2", "3"].includes(params.get("seasontype"))
    ? params.get("seasontype")
    : "2";
  function update(values) {
    const next = Object.fromEntries(params);
    delete next.league;
    delete next.page;
    Object.assign(next, values);
    for (const key of Object.keys(next))
      if (next[key] == null || next[key] === "") delete next[key];
    navigate(leagueHref(league, next));
  }
  const path = leagueResource(league, tab, {
    date,
    season,
    page,
    week,
    seasonType,
  });
  return (
    <section
      className="leagues-page league-detail"
      style={{ "--league-color": config.color }}
    >
      <Link className="league-breadcrumb" to="/leagues/">
        <Icon name="chevron-back" className="icon-before" size={18} />
        All leagues
      </Link>
      <header className="league-detail-heading">
        <LeagueLogo league={league} />
        <div>
          <p className="eyebrow">{leagueSports[league]}</p>
          <h1>{config.label}</h1>
        </div>
        <label className="league-switcher">
          Switch league
          <select
            value={league}
            onChange={(event) => navigate(leagueHref(event.target.value))}
          >
            {Object.entries(favoriteLeagues).map(([key, item]) => (
              <option key={key} value={key}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
      </header>
      <div
        className="league-tabs"
        role="tablist"
        aria-label={`${config.label} sections`}
      >
        {tabs.map((item) => (
          <button
            key={item}
            type="button"
            id={`league-tab-${item}`}
            role="tab"
            aria-selected={item === tab}
            aria-controls="league-panel"
            tabIndex={item === tab ? 0 : -1}
            onClick={() => update({ tab: item })}
            onKeyDown={(event) => {
              const current = tabs.indexOf(item),
                index =
                  event.key === "ArrowRight"
                    ? (current + 1) % tabs.length
                    : event.key === "ArrowLeft"
                      ? (current + tabs.length - 1) % tabs.length
                      : event.key === "Home"
                        ? 0
                        : event.key === "End"
                          ? tabs.length - 1
                          : null;
              if (index == null) return;
              event.preventDefault();
              update({ tab: tabs[index] });
              requestAnimationFrame(() =>
                document.getElementById(`league-tab-${tabs[index]}`)?.focus(),
              );
            }}
          >
            {label(item)}
          </button>
        ))}
      </div>
      <div className="league-controls">
        {["scores", "fights"].includes(tab) && (
          <GameDatePicker
            date={date}
            onChange={(value) => update({ date: value, week: null })}
          />
        )}
        {(yearTabs.includes(tab) ||
          (leagueSports[league] === "football" && tab === "scores")) && (
          <label>
            Season / year
            <select
              value={season}
              onChange={(event) => update({ season: event.target.value })}
            >
              {Array.from(
                { length: 32 },
                (_, index) => new Date().getFullYear() + 2 - index,
              ).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
              {season < new Date().getFullYear() - 29 && (
                <option value={season}>{season}</option>
              )}
            </select>
          </label>
        )}
        {leagueSports[league] === "football" && tab === "scores" && (
          <>
            <label>
              Week
              <select
                value={week}
                onChange={(event) => update({ week: event.target.value })}
              >
                <option value="">By date</option>
                {Array.from({ length: 22 }, (_, index) => (
                  <option key={index + 1} value={index + 1}>
                    Week {index + 1}
                  </option>
                ))}
              </select>
            </label>
            {week && (
              <label>
                Season type
                <select
                  value={seasonType}
                  onChange={(event) =>
                    update({ seasontype: event.target.value })
                  }
                >
                  <option value="1">Preseason</option>
                  <option value="2">Regular season</option>
                  <option value="3">Postseason</option>
                </select>
              </label>
            )}
          </>
        )}
      </div>
      <section
        id="league-panel"
        role="tabpanel"
        aria-labelledby={`league-tab-${tab}`}
        tabIndex={0}
      >
        {tab === "forum" && !signedIn ? (
          <div className="page-state">
            <h2>Join the conversation</h2>
            <p>Sign in to read league discussions with other Tempo fans.</p>
            <Link to="/login/">Sign in</Link>
          </div>
        ) : (
          <ResourcePanel
            key={path}
            path={path}
            league={league}
            tab={tab}
            page={page}
            onPageChange={(value) => update({ page: value })}
          />
        )}
      </section>
    </section>
  );
}

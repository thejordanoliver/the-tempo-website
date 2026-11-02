import PlayerLink from "../components/PlayerLink.jsx";
import ConferenceBadge from "../components/ConferenceBadge.jsx";
import { useEffect, useState } from "react";
import { Image, State, Table, useResource } from "../components.jsx";
import GameLocation from "../components/GameLocation.jsx";
import "../components/League.css";
import {
  LeagueNews,
  LeagueRecords,
  LeagueScores,
  LeagueStandings,
} from "../components/LeagueContent.jsx";
import "../components/Team.css";
import TeamLogo from "../components/TeamLogo.jsx";
import { favoriteLeagues } from "../favoriteLeagues.js";
import { defaultSeason } from "../leagues.js";
import { Link, navigate } from "../router.jsx";
import { hasTeamLeague, teamResource, teamTabs, teamConferenceStandings } from "../teams.js";
const list = (value) => (Array.isArray(value) ? value : []);
const label = (value) => value[0].toUpperCase() + value.slice(1);
function TeamPanel({ league, id, tab, season, page, onPage, team }) {
  const [version, setVersion] = useState(0),
    [month, setMonth] = useState("all");
  const resource = useResource(
      teamResource(league, id, tab, season, page),
      version,
    ),
    { data, loading, error } = resource;
  let content;
  if (tab === "schedule") {
    const games = Array.isArray(data?.games)
      ? data.games
      : list(data?.months).flatMap((group) => list(group.games));
    const months = [
      ...new Set(
        games
          .map((game) => (game.date || game.startDate || "").slice(0, 7))
          .filter(Boolean),
      ),
    ].sort();
    content = (
      <>
        <div className="team-schedule-controls">
          <label>
            Month
            <select
              value={month}
              onChange={(event) => setMonth(event.target.value)}
            >
              <option value="all">Full season</option>
              {months.map((value) => (
                <option key={value} value={value}>
                  {new Date(value + "-15T12:00:00").toLocaleDateString(
                    undefined,
                    { month: "long", year: "numeric" },
                  )}
                </option>
              ))}
            </select>
          </label>
          <p className="page-note">
            {data?.team?.recordSummary} {data?.team?.standingSummary}
          </p>
        </div>
        <LeagueScores
          league={league}
          data={{
            games: games.filter(
              (game) =>
                month === "all" ||
                (game.date || game.startDate || "").startsWith(month),
            ),
          }}
        />
      </>
    );
  } else if (tab === "news") content = <LeagueNews data={data} />;
  else if (tab === "standings")
    content = <LeagueStandings data={teamConferenceStandings(data, id)} league={league} showRankings={false} />;
  else if (tab === "forum")
    content = <LeagueRecords data={data} tab="forum" league={league} />;
  else if (tab === "roster") {
    const players = Array.isArray(data) ? data : list(data?.players);
    const sections = list(data?.sections).filter((section) => list(section.data).length);
    const groups = sections.length ? sections : [{ title: "Players", data: players }];
    const college = ["cfb", "mcbb", "wcbb"].includes(league);
    content = players.length || sections.length ? (
      groups.map((section) => (
        <section className="league-table-section" key={section.title}>
          <h3>{section.title}</h3>
          <Table
            headers={["#", "Player", "Position", "Height", "Weight", college ? "Year" : "College", "Hometown"]}
            rows={section.data.map((player) => [
              player.jersey_number,
              <PlayerLink league={league} id={player.id || player.player_id} className="team-player">
                <span className="team-headshot">
                  <Image src={player.headshot_url} loading="lazy" />
                </span>
                <span>{player.full_name || player.short_name}</span>
              </PlayerLink>,
              player.position,
              player.height,
              player.weight != null && player.weight !== "" ? `${player.weight} lbs` : null,
              college ? player.experience_display || player.experience_abbr : player.college,
              player.birth_display,
            ])}
          />
        </section>
      ))
    ) : (
      <State empty="No roster available for this team." />
    );
  } else if (tab === "stats") {
    const groups = Object.values(data?.stats || {}).filter(
      (group) => list(group?.stats).length,
    );
    content = groups.length ? (
      groups.map((group, index) => (
        <section className="league-table-section" key={index}>
          <h3>{group.name || "Team statistics"}</h3>
          <Table
            headers={["Statistic", "Total", "Per game"]}
            rows={group.stats.map((stat) => [
              stat.displayName || stat.name,
              stat.displayValue ?? stat.value,
              stat.perGameDisplayValue ?? stat.perGameValue,
            ])}
          />
        </section>
      ))
    ) : (
      <State empty="No team statistics available for this season." />
    );
  } else
    content = (
      <>
        <dl className="team-info">
          {[
            ["Location", team.location],
            ["Established", team.established],
            [
              "Conference",
              team.conference ? (
                <ConferenceBadge conference={team.conference} league={league} />
              ) : null,
            ],
            [
              "Coach",
              team.coach
                ? [team.coach.firstName, team.coach.lastName]
                    .filter(Boolean)
                    .join(" ")
                : null,
            ],
          ]
            .filter(([, value]) => value != null && value !== "")
            .map(([name, value]) => (
              <div key={name}>
                <dt>{name}</dt>
                <dd>{value}</dd>
              </div>
            ))}
        </dl>
        {list(team.championships).length > 0 && (
          <section className="league-table-section">
            <h3>Championships</h3>
            <Table
              headers={[league === "nfl" ? "Super Bowl" : "Season"]}
              rows={team.championships.map((row) => [
                league === "nfl" ? row.notes : row.season,
              ])}
            />
          </section>
        )}
        <GameLocation className="home-venue" title="Home Venue" details={{ venueInfo: team.venue }} />
      </>
    );
  const more =
    tab === "news"
      ? (data?.hasMore ?? list(data?.articles).length === 12)
      : tab === "forum"
        ? page < data?.pagination?.totalPages
        : false;
  return (
    <>
      <div className="league-panel-heading">
        <h2>{label(tab)}</h2>
      </div>
      <State {...resource} onRetry={() => setVersion((v) => v + 1)} />
      {!loading && !error && content}
      {!loading && !error && (more || page > 1) && (
        <div className="league-pagination">
          <button disabled={page === 1} onClick={() => onPage(page - 1)}>
            Previous
          </button>
          <span>Page {page}</span>
          <button disabled={!more} onClick={() => onPage(page + 1)}>
            Next
          </button>
        </div>
      )}
    </>
  );
}
function TeamData({ league, id, search, signedIn }) {
  const [version, setVersion] = useState(0),
    resource = useResource(`/api/teams/${league}/${id}`, version),
    team = resource.data?.team;
  useEffect(() => {
    if (team)
      document.title = `${team.fullName || team.name || team.shortName} | Tempo Sports`;
  }, [team]);
  const params = new URLSearchParams(search),
    tabs = teamTabs(league),
    tab = tabs.includes(params.get("tab")) ? params.get("tab") : "schedule";
  const year = Number(params.get("season")),
    season =
      Number.isInteger(year) &&
      year >= 1900 &&
      year <= new Date().getFullYear() + 2
        ? year
        : defaultSeason(league),
    page = Math.max(1, Math.min(parseInt(params.get("page"), 10) || 1, 10000));
  function update(values) {
    const next = new URLSearchParams(search);
    next.delete("page");
    for (const [key, value] of Object.entries(values))
      next.set(key, String(value));
    navigate(`/team/?${next}`, { replace: true });
  }
  return (
    <section className="leagues-page league-detail team-detail">
      <State
        {...resource}
        empty={
          !resource.loading && !resource.error && !team
            ? "Team not found."
            : null
        }
        onRetry={() => setVersion((v) => v + 1)}
      />
      {team && (
        <>
          <header className="team-heading">
            <TeamLogo team={team} league={league} />
            <div>
              <p className="eyebrow">{favoriteLeagues[league].label}</p>
              <h1>{team.fullName || team.name || team.shortName}</h1>
              <p className="team-header-meta">
                {team.conference && (
                  <ConferenceBadge
                    conference={team.conference}
                    league={league}
                  />
                )}
                {team.conference && team.location && (
                  <span aria-hidden="true">·</span>
                )}
                {team.location && <span>{team.location}</span>}
              </p>
            </div>
          </header>
          <div
            className="league-tabs"
            role="tablist"
            aria-label="Team sections"
          >
            {tabs.map((value, index) => (
              <button
                key={value}
                role="tab"
                id={`team-tab-${value}`}
                aria-selected={tab === value}
                aria-controls="team-panel"
                tabIndex={tab === value ? 0 : -1}
                onClick={() => update({ tab: value })}
                onKeyDown={(event) => {
                  const next =
                    event.key === "ArrowRight"
                      ? (index + 1) % tabs.length
                      : event.key === "ArrowLeft"
                        ? (index + tabs.length - 1) % tabs.length
                        : event.key === "Home"
                          ? 0
                          : event.key === "End"
                            ? tabs.length - 1
                            : null;
                  if (next == null) return;
                  event.preventDefault();
                  update({ tab: tabs[next] });
                  requestAnimationFrame(() =>
                    document.getElementById(`team-tab-${tabs[next]}`)?.focus(),
                  );
                }}
              >
                {label(value)}
              </button>
            ))}
          </div>
          {["schedule", "stats", "standings"].includes(tab) && (
            <label className="team-season">
              Season
              <select
                value={season}
                onChange={(event) => update({ season: event.target.value })}
              >
                {[
                  ...new Set([
                    season,
                    ...Array.from(
                      { length: 25 },
                      (_, index) => new Date().getFullYear() + 1 - index,
                    ),
                  ]),
                ]
                  .sort((a, b) => b - a)
                  .map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
              </select>
            </label>
          )}
          <section
            id="team-panel"
            role="tabpanel"
            aria-labelledby={`team-tab-${tab}`}
            tabIndex={0}
          >
            {tab === "forum" && !signedIn ? (
              <div className="page-state">
                <h2>Join the conversation</h2>
                <Link to="/login/">Sign in to read team discussions</Link>
              </div>
            ) : (
              <TeamPanel
                key={`${league}:${id}:${tab}:${season}:${page}`}
                league={league}
                id={id}
                tab={tab}
                season={season}
                page={page}
                onPage={(value) => update({ page: value })}
                team={team}
              />
            )}
          </section>
        </>
      )}
    </section>
  );
}
export default function Team({ search = "", signedIn = false }) {
  const params = new URLSearchParams(search),
    league = params.get("league"),
    id = params.get("id");
  return hasTeamLeague(league) && /^\d+$/.test(id || "") ? (
    <TeamData
      key={`${league}:${id}`}
      league={league}
      id={id}
      search={search}
      signedIn={signedIn}
    />
  ) : (
    <section className="leagues-page">
      <h1>Team not found</h1>
      <Link to="/leagues/">Browse leagues</Link>
    </section>
  );
}

import { useState } from "react";

import { Link } from "../app/router.jsx";
import PlayerLink from "../components/players/PlayerLink.jsx";
import TeamLogo from "../components/teams/TeamLogo.jsx";
import { Image } from "../components/ui/Image.jsx";
import { State } from "../components/ui/State.jsx";
import { Table } from "../components/ui/Table.jsx";
import { favoriteLeagues } from "../data/leagues/favoriteLeagues.js";
import {
  playerApiLeague,
  playerHref,
  playerResource,
  seasonStatGroups,
  statLabel,
  validPlayerId,
} from "../data/players/players.js";
import { teamIdentity } from "../data/teams/teamIdentity.js";
import { teamHref } from "../data/teams/teams.js";
import usePlayerTeams from "../hooks/usePlayerTeams.js";
import { useResource } from "../hooks/useResource.js";
import "../components/players/Player.css";

export function LogResult({ result, score }) {
  const outcome = String(result || "")
    .trim()
    .toUpperCase();
  const color = /^(W|WIN)(?:\b|$)/.test(outcome)
    ? "win"
    : /^(L|LOSS)(?:\b|$)/.test(outcome)
      ? "loss"
      : "neutral";
  return (
    <span className={`player-result player-result-${color}`}>
      {[result, score].filter(Boolean).join(" ") || "—"}
    </span>
  );
}

const list = (value) => (Array.isArray(value) ? value : []);
const dateLabel = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.valueOf())
    ? null
    : date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
};
function Resource({ path, children }) {
  const [version, setVersion] = useState(0);
  const resource = useResource(path, version);
  return (
    <>
      <State {...resource} onRetry={() => setVersion((value) => value + 1)} />
      {!resource.loading && !resource.error && children(resource.data)}
    </>
  );
}
export function PlayerOverview({ player, fighter }) {
  const draft = player.draft_year
    ? [
        player.draft_year,
        player.draft_round && `Round ${player.draft_round}`,
        player.draft_number && `Pick ${player.draft_number}`,
      ]
        .filter(Boolean)
        .join(" · ")
    : null;
  const rows = [
    ["Height", player.height],
    [
      "Weight",
      player.weight != null && player.weight !== ""
        ? `${player.weight} lbs`
        : null,
    ],
    ["Born", dateLabel(player.birth_date)],
    ["Hometown", player.birth_display],
    ["College", player.college],
    ["Experience", player.experience_display ?? player.experience],
    ["Draft", draft],
    ...(fighter
      ? [
          [
            "Division",
            player.weight_class_text || player.weight_class_short_name,
          ],
          ["Country", player.citizenship],
          ["Reach", player.reach],
          ["Stance", player.stance_text],
          ["Camp", player.association_name],
          ["Fight style", player.style_text],
        ]
      : []),
  ].filter(([, value]) => value != null && value !== "");
  const awards = [
    ...list(player.awards).filter((value) => typeof value === "string"),
    ...list(player.accolades)
      .map((award) => award.accolade_name)
      .filter(Boolean),
  ];
  return (
    <>
      <section className="player-section">
        <h2>{fighter ? "Fighter" : "Player"} details</h2>
        {rows.length ? (
          <dl className="player-bio">
            {rows.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <State empty="Biographical details are not available yet." />
        )}
      </section>
      {awards.length > 0 && (
        <section className="player-section">
          <h2>Awards &amp; honors</h2>
          <ul>
            {[...new Set(awards)].map((award) => (
              <li key={award}>{award}</li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
export function SeasonTeam({ season, league, teams = {} }) {
  const id = season.team?.id || season.team_id;
  const team = { ...teams[String(id)], ...season.team, id };
  const code =
    team.code ||
    team.abbreviation ||
    team.shortName ||
    team.short_name ||
    season.team_slug ||
    "—";
  const content = (
    <>
      <TeamLogo team={team} league={league} loading="lazy" />
      <span>{code}</span>
    </>
  );
  return league && /^\d+$/.test(String(id || "")) ? (
    <Link
      className="player-season-team"
      to={teamHref(league, id)}
      title={team.fullName || team.name || code}
    >
      {content}
    </Link>
  ) : (
    <span className="player-season-team">{content}</span>
  );
}

export function PlayerSeasonStats({ data, league }) {
  const seasons = list(data?.seasons);
  const teamLeague = data?.league || league;
  const teams = usePlayerTeams(
    teamLeague,
    seasons.map((season) => season.team?.id || season.team_id),
  );
  const [selected, setSelected] = useState("");
  const categories = [
    ...new Set(
      seasons.flatMap((season) => Object.keys(seasonStatGroups(season))),
    ),
  ];
  const category = categories.includes(selected) ? selected : categories[0];
  const columns = [
    ...new Set(
      seasons.flatMap((season) =>
        Object.keys(seasonStatGroups(season)[category] || {}),
      ),
    ),
  ];
  if (!seasons.length || !columns.length)
    return (
      <State empty="Season statistics are not available for this player yet." />
    );
  return (
    <section className="player-section">
      <h2>Season stats</h2>
      <label className="player-filter">
        Category
        <select
          value={category}
          onChange={(event) => setSelected(event.target.value)}
        >
          {categories.map((value) => (
            <option key={value} value={value}>
              {statLabel(value)}
            </option>
          ))}
        </select>
      </label>
      <Table
        headers={["Season", "Type", "Team", ...columns.map(statLabel)]}
        rows={seasons
          .filter(
            (season) =>
              Object.keys(seasonStatGroups(season)[category] || {}).length,
          )
          .map((season) => [
            season.display_season || season.season,
            season.season_type_label ||
              statLabel(String(season.season_type || "Regular season")),
            <SeasonTeam season={season} league={teamLeague} teams={teams} />,
            ...columns.map((key) => seasonStatGroups(season)[category]?.[key]),
          ])}
      />
    </section>
  );
}
function GameLog({ league, id }) {
  const [season, setSeason] = useState("");
  const [category, setCategory] = useState("");
  const path = playerResource(league, id, "gamelog", { season, category });
  return (
    <Resource key={path} path={path}>
      {(data) => (
        <section className="player-section">
          <h2>Game log</h2>
          <div className="player-filters">
            {list(data?.seasons).length > 0 && (
              <label className="player-filter">
                Season
                <select
                  value={season || String(data.season)}
                  onChange={(event) => {
                    setSeason(event.target.value);
                    setCategory("");
                  }}
                >
                  {data.seasons.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
            )}
            {list(data?.categories).length > 0 && (
              <label className="player-filter">
                Category
                <select
                  value={category || data.category || ""}
                  onChange={(event) => setCategory(event.target.value)}
                >
                  {data.categories.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </div>
          {list(data?.games).length ? (
            <Table
              headers={[
                "Date",
                "Opponent",
                "Result",
                ...list(data.columns).map((column) => column.label),
              ]}
              rows={data.games.map((game) => [
                dateLabel(game.date),
                [game.location, game.opponent?.abbreviation]
                  .filter(Boolean)
                  .join(" "),
                <LogResult result={game.result} score={game.score} />,
                ...list(data.columns).map((column) => game.stats?.[column.key]),
              ])}
            />
          ) : (
            <State empty="No games available for this selection." />
          )}
        </section>
      )}
    </Resource>
  );
}
export function FighterHistory({ data, career = false }) {
  if (career)
    return (
      <section className="player-section">
        <h2>Career stats</h2>
        {list(data?.careerStats).length ? (
          <dl className="player-bio">
            {data.careerStats.map((stat) => (
              <div key={stat.key}>
                <dt title={stat.description}>{stat.label}</dt>
                <dd>{stat.value}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <State empty="Career stats are not available yet." />
        )}
      </section>
    );
  return (
    <section className="player-section">
      <h2>Fight log</h2>
      {list(data?.fights).length ? (
        <Table
          headers={[
            "Date",
            "Event",
            "Opponent",
            "Result",
            "Method",
            "Round",
            "Time",
          ]}
          rows={data.fights.map((fight) => [
            dateLabel(fight.date),
            fight.eventName || fight.eventShortName,
            <PlayerLink league="ufc" id={fight.opponent?.id}>
              {fight.opponent?.name || fight.opponent?.shortName || "TBD"}
            </PlayerLink>,
            <LogResult result={fight.result} />,
            fight.method,
            fight.round,
            fight.time,
          ])}
        />
      ) : (
        <State empty="No fight history available yet." />
      )}
    </section>
  );
}
export function PlayerProfile({
  player,
  league,
  id,
  tab = "overview",
  onTabChange,
}) {
  const fighter = playerApiLeague(league) === "mma";
  const tabs = fighter
    ? [
        ["overview", "Overview"],
        ["career", "Career Stats"],
        ["fightlog", "Fight Log"],
      ]
    : [
        ["overview", "Overview"],
        ["stats", "Season Stats"],
        ...([
          "nba",
          "wnba",
          "mcbb",
          "wcbb",
          "nfl",
          "cfb",
          "mlb",
          "nhl",
        ].includes(playerApiLeague(league))
          ? [["gamelog", "Game Log"]]
          : []),
      ];
  const active = tabs.some(([value]) => value === tab) ? tab : "overview";
  const name =
    player.full_name ||
    [player.first_name, player.last_name].filter(Boolean).join(" ") ||
    player.short_name ||
    (fighter ? "Unknown Fighter" : "Unknown Player");
  const team =
    player.team_id && !fighter && favoriteLeagues[league]
      ? teamIdentity({ id: player.team_id }, league)
      : null;
  return (
    <>
      <header className="player-heading">
        <div className="player-portrait">
          <span aria-hidden="true">
            {name
              .split(/\s+/)
              .map((part) => part[0])
              .slice(0, 2)
              .join("")}
          </span>
          <Image src={player.headshot_url} alt={`${name} headshot`} />
        </div>
        <div className="player-identity">
          {league !== "cfb" && (
            <p className="eyebrow">
              {fighter
                ? "UFC · Fighter"
                : `${favoriteLeagues[league]?.label || "Soccer"} · Player`}
            </p>
          )}
          <h1>{name}</h1>
          {fighter && player.nickname && <p>&quot;{player.nickname}&quot;</p>}
          <p>
            {[
              player.position || player.weight_class_text,
              player.jersey_number != null ? `#${player.jersey_number}` : null,
            ]
              .filter(Boolean)
              .join(" · ")}
          </p>
          {team && (
            <Link to={teamHref(league, player.team_id)}>
              {team.shortName === "TBD" ? "View team" : team.shortName}
            </Link>
          )}
          {fighter && player.citizenship && <p>{player.citizenship}</p>}
        </div>
        {fighter && player.flag_url && (
          <Image
            className="player-country-flag"
            src={player.flag_url}
            alt={`${player.citizenship || "Country"} flag`}
          />
        )}
      </header>
      <nav
        className="player-tabs"
        aria-label={
          fighter ? "Fighter profile sections" : "Player profile sections"
        }
      >
        {tabs.map(([value, label]) => (
          <Link
            key={value}
            to={`${playerHref(league, id)}&tab=${value}`}
            aria-current={active === value ? "page" : undefined}
            onClick={onTabChange}
          >
            {label}
          </Link>
        ))}
      </nav>
      {active === "overview" ? (
        <PlayerOverview player={player} fighter={fighter} />
      ) : fighter ? (
        <Resource path={playerResource(league, id, "fightlog")}>
          {(data) => (
            <FighterHistory data={data} career={active === "career"} />
          )}
        </Resource>
      ) : active === "stats" ? (
        <Resource path={playerResource(league, id, "stats")}>
          {(data) => (
            <>
              <PlayerSeasonStats data={data} league={league} />
              {list(data?.collegeStats?.seasons).length > 0 && (
                <section className="player-college-stats">
                  <h2>College career</h2>
                  <PlayerSeasonStats
                    data={data.collegeStats}
                    league={data.collegeStats.league}
                  />
                </section>
              )}
            </>
          )}
        </Resource>
      ) : (
        <GameLog league={league} id={id} />
      )}
    </>
  );
}
function PlayerData({ league, id, search }) {
  return (
    <Resource path={playerResource(league, id)}>
      {(data) =>
        data?.player ? (
          <PlayerProfile
            key={`${data.league || league}:${data.playerId || id}`}
            player={data.player}
            league={data.league || league}
            id={data.playerId || id}
            tab={new URLSearchParams(search).get("tab") || "overview"}
          />
        ) : (
          <State empty="Profile not found." />
        )
      }
    </Resource>
  );
}
export default function Player({ search = "", fighter = false }) {
  const params = new URLSearchParams(search),
    league = fighter ? "ufc" : params.get("league"),
    id = params.get("id");
  if (!playerApiLeague(league) || !validPlayerId(id))
    return (
      <section className="leagues-page">
        <h1>{fighter ? "Fighter" : "Player"} not found</h1>
        <Link to="/leagues/">Browse leagues</Link>
      </section>
    );
  return (
    <section className="leagues-page league-detail player-detail">
      <PlayerData
        key={`${league}:${id}`}
        league={league}
        id={id}
        search={search}
      />
    </section>
  );
}

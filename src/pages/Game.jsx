import { useState } from "react";
import { Link } from "../router.jsx";
import { Image, State, Table, useResource } from "../components.jsx";
const sports = {
  nba: "basketball",
  nfl: "football",
  mlb: "baseball",
  nhl: "hockey",
};
function GameData({ id, league }) {
  const [version, setVersion] = useState(0),
    { data, loading, error } = useResource(
      `/api/${sports[league]}/details?league=${league}&gameId=${id}`,
      version,
    );
  const score = data?.score,
    details = data?.details || {},
    periods = score?.periodScores || [],
    groups = Array.isArray(score?.teamStats)
      ? score.teamStats.filter((g) => Array.isArray(g.stats))
      : [],
    stats = [...new Set(groups.flatMap((g) => g.stats.map((s) => s.name)))],
    plays = Array.isArray(score?.plays)
      ? score.plays.filter((p) => p.text).slice(0, 30)
      : [];
  return (
    <>
      <header className="detail-header">
        <Link to="/home/">← Home</Link>
        <button
          className="detail-button"
          disabled={loading}
          onClick={() => setVersion((v) => v + 1)}
        >
          Refresh
        </button>
      </header>
      <h1 className="detail-title">Game details</h1>
      <State
        loading={loading}
        error={
          error ||
          (!loading && !score?.home ? "Game details are not available." : null)
        }
        onRetry={() => setVersion((v) => v + 1)}
      />
      {!loading && !error && score?.home && score?.away && (
        <>
          <section className="scoreboard">
            <p className="eyebrow">
              {league.toUpperCase()} ·{" "}
              {score.status?.shortDetail ||
                score.status?.detail ||
                score.status?.description ||
                "Scheduled"}
            </p>
            <div className="score-teams">
              {[score.away, score.home].map((team, i) => (
                <div className="score-team" key={i}>
                  <Image src={team.logo} />
                  <h2>
                    {team.fullName || team.name || team.shortName || "TBD"}
                  </h2>
                  <strong>
                    {score.status?.state === "pre" ? "—" : (team.score ?? "—")}
                  </strong>
                  {team.record && <span className="small">{team.record}</span>}
                </div>
              ))}
            </div>
            <p className="score-meta">
              {[
                formatDate(score.date),
                details.venue?.name || details.venue?.fullName,
                details.broadcast || details.broadcasts?.join(" · "),
              ]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </section>
          {details.headline && (
            <section className="detail-section">
              <h2>Game overview</h2>
              <p>{details.headline}</p>
            </section>
          )}
          {periods.length > 0 && (
            <section className="detail-section">
              <h2>{league === "mlb" ? "By inning" : "By period"}</h2>
              <Table
                headers={["Team", ...periods.map((p) => p.period), "Total"]}
                rows={[
                  [
                    score.away.shortName || score.away.name,
                    ...periods.map((p) => p.away),
                    score.away.score,
                  ],
                  [
                    score.home.shortName || score.home.name,
                    ...periods.map((p) => p.home),
                    score.home.score,
                  ],
                ]}
              />
            </section>
          )}
          {groups.length > 0 && (
            <section className="detail-section">
              <h2>Team statistics</h2>
              <Table
                headers={[
                  "Statistic",
                  ...groups.map(
                    (g) => g.team?.shortName || g.team?.name || "Team",
                  ),
                ]}
                rows={stats.map((name) => [
                  name,
                  ...groups.map(
                    (g) =>
                      g.stats.find((s) => s.name === name)?.displayValue ?? "—",
                  ),
                ])}
              />
            </section>
          )}
          <section className="detail-section">
            <h2>Play-by-play</h2>
            {plays.length ? (
              plays.map((p, i) => (
                <p className="detail-play" key={p.id || i}>
                  {p.text}
                </p>
              ))
            ) : (
              <p className="small">
                Play-by-play is not available for this game yet.
              </p>
            )}
          </section>
        </>
      )}
    </>
  );
}
export function formatDate(value) {
  const date = new Date(value || "");
  return Number.isNaN(date.valueOf()) ? null : date.toLocaleString();
}
export default function Game({ search }) {
  const params = new URLSearchParams(search),
    id = params.get("id"),
    league = params.get("league") || "nba";
  return (
    <div className="detail-page">
      {!id || !/^\d+$/.test(id) || !sports[league] ? (
        <>
          <h1>Game details</h1>
          <State error="Select a supported game from Home." />
          <Link to="/home/">Back to Home</Link>
        </>
      ) : (
        <GameData key={`${id}-${league}`} id={id} league={league} />
      )}
    </div>
  );
}

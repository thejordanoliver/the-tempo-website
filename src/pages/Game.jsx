import { useState } from "react";
import { State, useResource } from "../components.jsx";
import GameHeader from "../components/GameHeader.jsx";
import HeadingTwo from "../components/HeadingTwo.jsx";
import LineScore from "../components/LineScore.jsx";
import GameLeaders from "../components/GameLeaders.jsx";
import GameStats from "../components/GameStats.jsx";
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
    plays = Array.isArray(score?.plays)
      ? score.plays.filter((p) => p.text).slice(0, 30)
      : [];
  return (
    <>
    
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
          <GameHeader score={score} details={details} league={league} />
          {details.headline && (
            <section className="detail-section">
              <HeadingTwo>Game overview</HeadingTwo>
              <p>{details.headline}</p>
            </section>
          )}
          <LineScore score={score} league={league} />
          <GameLeaders score={score} league={league} />
          <GameStats score={score} league={league} />
          <section className="detail-section">
            <HeadingTwo>Play-by-play</HeadingTwo>
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
        </>
      ) : (
        <GameData key={`${id}-${league}`} id={id} league={league} />
      )}
    </div>
  );
}

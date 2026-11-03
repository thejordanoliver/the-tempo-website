import { useState } from "react";

import GameHeader from "../components/games/GameHeader.jsx";
import GameLeaders from "../components/games/GameLeaders.jsx";
import GameLocation from "../components/games/GameLocation.jsx";
import GameStats from "../components/games/GameStats.jsx";
import GameSummary from "../components/games/GameSummary.jsx";
import LineScore from "../components/games/LineScore.jsx";
import { State } from "../components/ui/State.jsx";
import { leagueSports } from "../data/leagues/leagues.js";
import { useResource } from "../hooks/useResource.js";
const sports = Object.fromEntries(
  Object.entries(leagueSports).filter(([, sport]) =>
    [
      "basketball",
      "football",
      "baseball",
      "hockey",
      "soccer",
      "volleyball",
    ].includes(sport),
  ),
);
function GameData({ id, league }) {
  const [version, setVersion] = useState(0),
    { data, loading, error } = useResource(
      `/api/${sports[league]}/details?league=${league}&gameId=${id}`,
      version,
      { kind: "game", payload: { sport: sports[league], league, gameId: id } },
    );
  const score = data?.score,
    details = data?.details || {};
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
          <LineScore score={score} league={league} />
          <GameLeaders score={score} league={league} />
          <GameStats score={score} league={league} />
          <GameSummary score={score} league={league} />
          <GameLocation details={details} />
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

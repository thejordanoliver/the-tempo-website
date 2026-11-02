import { useEffect, useState } from "react";
import { sessionStore } from "../session.js";
import { hasLeague, leagueSports, scorePath, scoreGroups } from "../leagues.js";
import { gameCardModel } from "../components/gameCardModel.js";

export default function useHomeScores(teams, leagues, date, version, enabled) {
  const teamKeys = teams.map((team) => `${team.league}:${team.id}`);
  const leagueKeys = [
    ...new Set([...teams.map((team) => team.league), ...leagues]),
  ].filter(hasLeague);
  const key = JSON.stringify([teamKeys, leagues, date, version, enabled]);
  const [state, setState] = useState({
    key: null,
    items: [],
    loading: false,
    error: null,
  });
  useEffect(() => {
    const controller = new AbortController();
    if (!enabled) return () => controller.abort();
    setState({ key, items: [], loading: true, error: null });
    async function load() {
      const results = await Promise.allSettled(
        leagueKeys.map(async (league) => {
          const data = await sessionStore.request(
            `${scorePath(league)}?date=${date.replaceAll("-", "")}`,
            {
              signal: AbortSignal.any([
                controller.signal,
                AbortSignal.timeout(20000),
              ]),
            },
          );
          return scoreGroups(data, leagueSports[league])
            .flatMap((group) => group.games)
            .map((game) => ({ game, league }));
        }),
      );
      if (controller.signal.aborted) return;
      const favorite = [],
        live = [],
        seen = new Set();
      for (const result of results) {
        if (result.status !== "fulfilled") continue;
        for (const item of result.value) {
          const id = `${item.league}:${item.game.id}`;
          if (seen.has(id)) continue;
          const isFavorite = [item.game.home, item.game.away].some(
            (team) =>
              team?.id != null &&
              teamKeys.includes(`${item.league}:${team.id}`),
          );
          if (isFavorite) favorite.push(item);
          else if (
            leagues.includes(item.league) &&
            gameCardModel(item.game, item.league).live
          )
            live.push(item);
          else continue;
          seen.add(id);
        }
      }
      const failures = results.filter((result) => result.status === "rejected");
      setState({
        key,
        items: [...favorite, ...live],
        loading: false,
        error: failures.length
          ? "Some favorite scores could not be loaded. Please try again."
          : null,
      });
    }
    void load();
    return () => controller.abort();
    // The serialized key tracks all inputs without refetching on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return state.key === key ? state : { items: [], loading: true, error: null };
}

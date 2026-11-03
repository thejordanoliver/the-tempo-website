import { useEffect, useRef, useState } from "react";

import { hasLeague, leagueSports, scorePath } from "../data/leagues/leagues.js";
import { sessionStore } from "../services/session.js";
import { scoreboardItems } from "../utils/homeScores.js";
import useLiveSportsSubscription from "./useLiveSportsSubscription.js";

export default function useHomeScores(teams, leagues, date, version, enabled) {
  const leagueKeys = [
    ...new Set([
      ...teams.map((team) => team.league),
      ...leagues,
      ...Object.keys(leagueSports),
    ]),
  ].filter(hasLeague);
  const key = JSON.stringify([
    teams.map((team) => `${team.league}:${team.id}`),
    leagues,
    date,
    version,
    enabled,
    sessionStore.getSnapshot()?.user?.id,
  ]);
  const live = useRef({ key, snapshots: new Map() });
  const [state, setState] = useState({
    key: null,
    items: [],
    loading: false,
    error: null,
  });
  useLiveSportsSubscription({
    enabled,
    subscriptions: leagueKeys.map((league) => ({
      kind: "scoreboard",
      payload: {
        sport: leagueSports[league],
        league,
        date: date.replaceAll("-", ""),
      },
    })),
    onUpdate(data, envelope) {
      if (!leagueKeys.includes(envelope.league)) return;
      if (live.current.key !== key)
        live.current = { key, snapshots: new Map() };
      const items = scoreboardItems(data, envelope.league);
      live.current.snapshots.set(envelope.league, items);
      setState((previous) =>
        previous.key === key
          ? {
              ...previous,
              items: [
                ...previous.items.filter(
                  ({ league }) => league !== envelope.league,
                ),
                ...items,
              ],
            }
          : previous,
      );
    },
  });
  useEffect(() => {
    const controller = new AbortController();
    live.current = { key, snapshots: new Map() };
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
          return scoreboardItems(data, league);
        }),
      );
      if (controller.signal.aborted) return;
      const snapshots =
        live.current.key === key ? live.current.snapshots : new Map();
      const items = leagueKeys.flatMap(
        (league, index) =>
          snapshots.get(league) ??
          (results[index].status === "fulfilled" ? results[index].value : []),
      );
      const failed = leagueKeys.some(
        (league, index) =>
          results[index].status === "rejected" && !snapshots.has(league),
      );
      setState({
        key,
        items,
        loading: false,
        error: failed
          ? "Some scores could not be loaded. Please try again."
          : null,
      });
    }
    void load();
    return () => controller.abort();
    // The serialized key captures request identity without refetching on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  const { key: _key, ...result } = state;
  return state.key === key ? result : { items: [], loading: true, error: null };
}

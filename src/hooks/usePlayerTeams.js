import { useEffect, useState } from "react";

import { hasTeamLeague } from "../data/teams/teams.js";
import useSessionScope from "./useSessionScope.js";
import { sessionStore } from "../services/session.js";

// Fetch each distinct team once, even when several seasons share the same team.
export default function usePlayerTeams(league, ids) {
  const scope = useSessionScope();
  const key = JSON.stringify([
    scope,
    league,
    [
      ...new Set(
        ids.filter((id) => /^\d+$/.test(String(id || ""))).map(String),
      ),
    ].sort(),
  ]);
  const [version, setVersion] = useState(0);
  const [result, setResult] = useState({
    key: null,
    teams: {},
    loading: true,
    error: null,
  });
  const [, requestLeague, teamIds] = JSON.parse(key);
  const enabled = hasTeamLeague(requestLeague) && teamIds.length > 0;
  function readCached() {
    if (version) return null;
    const teams = teamIds.map((id) => [
      id,
      sessionStore.peek(`/api/teams/${requestLeague}/${id}`, {
        allowStale: true,
      })?.data?.team,
    ]);
    return teams.every(([, team]) => team)
      ? { key, teams: Object.fromEntries(teams), loading: false, error: null }
      : null;
  }
  useEffect(() => {
    const controller = new AbortController();
    if (!enabled) return () => controller.abort();
    const cached = readCached();
    setResult(cached || { key, teams: {}, loading: true, error: null });
    Promise.all(
      teamIds.map(async (id) => {
        const response = await sessionStore.request(
          `/api/teams/${requestLeague}/${id}`,
          {
            cache: version ? "reload" : undefined,
            signal: AbortSignal.any([
              controller.signal,
              AbortSignal.timeout(20000),
            ]),
          },
        );
        if (!response.team)
          throw new Error("Team details are not available yet.");
        return [id, response.team];
      }),
    )
      .then((teams) => {
        if (!controller.signal.aborted)
          setResult({
            key,
            teams: Object.fromEntries(teams),
            loading: false,
            error: null,
          });
      })
      .catch((error) => {
        if (!controller.signal.aborted)
          setResult({
            key,
            teams: cached?.teams || {},
            loading: false,
            error: cached
              ? null
              : error.message || "Unable to load team details.",
          });
      });
    return () => controller.abort();
    // key captures the league and distinct IDs, avoiding requests on rerenders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, enabled, version]);
  const state = !enabled
    ? { teams: {}, loading: false, error: null }
    : result.key === key
      ? result
      : readCached() || { teams: {}, loading: true, error: null };
  return {
    teams: state.teams,
    loading: state.loading,
    error: state.error,
    retry: () => setVersion((value) => value + 1),
  };
}

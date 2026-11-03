import { useEffect, useState } from "react";

import { hasTeamLeague } from "../data/teams/teams.js";
import { sessionStore } from "../services/session.js";

// Fetch each distinct team once, even when several seasons share the same team.
export default function usePlayerTeams(league, ids) {
  const key = JSON.stringify([
    league,
    [...new Set(ids.filter((id) => /^\d+$/.test(String(id || ""))))]
      .map(String)
      .sort(),
  ]);
  const [result, setResult] = useState({ key: null, teams: {} });
  useEffect(() => {
    const controller = new AbortController();
    const [requestLeague, teamIds] = JSON.parse(key);
    if (!hasTeamLeague(requestLeague) || !teamIds.length)
      return () => controller.abort();
    Promise.allSettled(
      teamIds.map(async (id) => {
        const response = await sessionStore.request(
          `/api/teams/${requestLeague}/${id}`,
          {
            signal: AbortSignal.any([
              controller.signal,
              AbortSignal.timeout(20000),
            ]),
          },
        );
        return [id, response.team];
      }),
    ).then((results) => {
      if (!controller.signal.aborted)
        setResult({
          key,
          teams: Object.fromEntries(
            results
              .filter(
                (result) => result.status === "fulfilled" && result.value[1],
              )
              .map((result) => result.value),
          ),
        });
    });
    return () => controller.abort();
  }, [key]);
  return result.key === key ? result.teams : {};
}

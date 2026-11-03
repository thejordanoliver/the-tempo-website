import {
  hasLeague,
  leagueSports,
  scoreGroups,
} from "../data/leagues/leagues.js";

export const HOME_GAMES_PER_SPORT = 10;

export function scoreboardItems(data, league) {
  return scoreGroups(data, leagueSports[league])
    .flatMap(({ games }) => games)
    .map((game) => ({ game, league }));
}
const statusPriority = (game) =>
  game.status?.state === "in" ? 0 : game.status?.state === "post" ? 2 : 1;

/** Group and rank Home games before applying the shared per-sport display budget. */
export function groupHomeScores(items, teams = [], leagues = []) {
  const favoriteTeams = new Set(
    teams.map(({ league, id }) => `${league}:${id}`),
  );
  const leagueOrder = [
    ...new Set([
      ...teams.map(({ league }) => league),
      ...leagues,
      ...Object.keys(leagueSports),
    ]),
  ];
  const groups = new Map();
  const seen = new Set();
  const favorite = (game, league) =>
    [game.home, game.away].some(
      (team) => team?.id != null && favoriteTeams.has(`${league}:${team.id}`),
    );
  for (const item of items) {
    if (!hasLeague(item.league) || !item.game) continue;
    const id = item.game.id ?? item.game.uid;
    if (id != null) {
      const key = `${item.league}:${id}`;
      if (seen.has(key)) continue;
      seen.add(key);
    }
    if (!groups.has(item.league)) groups.set(item.league, []);
    groups.get(item.league).push(item.game);
  }
  const sections = leagueOrder
    .filter((league) => groups.has(league))
    .map((league) => ({
      league,
      games: [...groups.get(league)].sort((a, b) => {
        const teamPriority =
          Number(favorite(b, league)) - Number(favorite(a, league));
        if (teamPriority) return teamPriority;
        const status = statusPriority(a) - statusPriority(b);
        if (status) return status;
        const ap = Array.isArray(a.matchupPriority) ? a.matchupPriority : [];
        const bp = Array.isArray(b.matchupPriority) ? b.matchupPriority : [];
        for (let index = 0; index < Math.max(ap.length, bp.length); index++) {
          const difference =
            (Number.isFinite(bp[index]) ? bp[index] : 0) -
            (Number.isFinite(ap[index]) ? ap[index] : 0);
          if (difference) return difference;
        }
        return 0;
      }),
    }));

  const sportCounts = new Map();
  return sections.flatMap(({ league, games }) => {
    const sport = leagueSports[league];
    const count = sportCounts.get(sport) ?? 0;
    const visibleGames = games.slice(
      0,
      Math.max(0, HOME_GAMES_PER_SPORT - count),
    );
    sportCounts.set(sport, count + visibleGames.length);
    return visibleGames.length ? [{ league, games: visibleGames }] : [];
  });
}

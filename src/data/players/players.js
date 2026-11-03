import { hasLeague, leagueSports } from "../leagues/leagues.js";
const leagues = new Set([
  "nba",
  "wnba",
  "nfl",
  "cfb",
  "mcbb",
  "wcbb",
  "mlb",
  "nhl",
]);
export const validPlayerId = (id) =>
  /^\d+$/.test(String(id ?? "")) &&
  Number.isSafeInteger(Number(id)) &&
  Number(id) > 0;
export function playerApiLeague(league) {
  if (["mma", "ufc"].includes(league)) return "mma";
  if (
    league === "socc" ||
    (hasLeague(league) && leagueSports[league] === "soccer")
  )
    return "socc";
  return leagues.has(league) ? league : null;
}
export function playerHref(league, id) {
  if (!playerApiLeague(league) || !validPlayerId(id)) return null;
  return `/${["mma", "ufc"].includes(league) ? "fighter" : "player"}/?${new URLSearchParams({ league: league === "mma" ? "ufc" : league, id: String(id) })}`;
}
export function playerResource(
  league,
  id,
  section = "profile",
  { season, category } = {},
) {
  const apiLeague = playerApiLeague(league);
  if (!apiLeague || !validPlayerId(id)) return null;
  if (section === "profile")
    return apiLeague === "nba"
      ? `/api/roster/player/${id}`
      : `/api/roster/${apiLeague}/player/${id}`;
  if (apiLeague === "mma") return `/api/player/fightlog/ufc/${id}`;
  if (section === "stats") return `/api/player/stats/${apiLeague}/${id}`;
  const query = new URLSearchParams();
  if (season) query.set("season", season);
  if (category) query.set("category", category);
  return `/api/player/gamelog/${apiLeague}/${id}${query.size ? `?${query}` : ""}`;
}
export const statLabel = (value) =>
  value
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
export function seasonStatGroups(season) {
  const source =
    season?.stats ||
    Object.fromEntries(
      ["averages", "totals", "miscellaneous"].map((key) => [
        key,
        season?.[key],
      ]),
    );
  return Object.fromEntries(
    Object.entries(source)
      .filter(
        ([, values]) =>
          values && typeof values === "object" && !Array.isArray(values),
      )
      .map(([key, values]) => [
        key,
        Object.fromEntries(
          Object.entries(values).filter(
            ([, value]) =>
              typeof value === "number" || typeof value === "string",
          ),
        ),
      ])
      .filter(([, values]) => Object.keys(values).length),
  );
}

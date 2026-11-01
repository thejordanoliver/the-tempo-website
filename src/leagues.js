// Backend routes and view-specific metadata, shared by league pages and links.
export const sportLeagues = {
  Basketball: ["nba", "wnba", "gleague", "mcbb", "wcbb"],
  Football: ["nfl", "cfb", "ufl"],
  Baseball: ["mlb", "cb", "sb"],
  Hockey: ["nhl"],
  Soccer: [
    "epl",
    "mls",
    "champions",
    "europa",
    "laliga",
    "bundesliga",
    "ligue1",
    "ligue2",
    "leaguescup",
    "fifa",
    "fifaw",
    "msoc",
    "wsoc",
  ],
  MMA: ["ufc"],
  Racing: ["f1", "nascarpremier"],
  Tennis: ["atp", "wta"],
  Volleyball: ["mcvb", "wcvb"],
};
export const leagueSports = Object.fromEntries(
  Object.entries(sportLeagues).flatMap(([sport, leagues]) =>
    leagues.map((league) => [league, sport.toLowerCase()]),
  ),
);
export const hasLeague = (value) => Object.hasOwn(leagueSports, value);
export const leagueHref = (league, options = {}) =>
  `/league/?${new URLSearchParams({ league, ...options })}`;
export function leagueTabs(league) {
  const tabs = [league === "ufc" ? "fights" : "scores", "news"];
  if (
    !["gleague", "msoc", "wsoc", "atp", "wta", "ufc", "nascarpremier"].includes(
      league,
    )
  )
    tabs.push("standings");
  if (["nba", "wnba", "mlb", "nfl", "cfb"].includes(league))
    tabs.push("playoffs");
  if (["mcbb", "wcbb"].includes(league)) tabs.push("bracket");
  if (
    ["nba", "wnba", "mcbb", "wcbb", "nfl", "cfb", "mlb", "nhl"].includes(league)
  )
    tabs.push("stats");
  if (["nba", "nfl", "mlb"].includes(league)) tabs.push("transactions");
  if (["nba", "wnba", "nfl"].includes(league)) tabs.push("draft");
  if (["mcbb", "cfb"].includes(league)) tabs.push("recruits");
  if (["mcvb", "wcvb"].includes(league)) tabs.push("rankings");
  if (
    ["nba", "wnba", "mcbb", "wcbb", "nfl", "cfb", "mlb", "nhl"].includes(league)
  )
    tabs.push("awards");
  if (league === "ufc") tabs.push("champions");
  return [...tabs, "forum"];
}
export function defaultSeason(league, now = new Date()) {
  const year = now.getFullYear(),
    month = now.getMonth();
  if (["nba", "mcbb", "wcbb", "gleague"].includes(league))
    return year + (month >= 8 ? 1 : 0);
  if (league === "nhl") return year + (month >= 8 ? 1 : 0);
  if (league === "wnba") return year - (month < 2 ? 1 : 0);
  if (league === "nfl") return year - (month < 5 ? 1 : 0);
  if (league === "cfb") return year - (month === 0 ? 1 : 0);
  return year;
}
export function scorePath(league) {
  if (!hasLeague(league)) return null;
  if (league === "mlb") return "/api/games/baseball";
  if (league === "nhl") return "/api/games/hockey";
  return `/api/games/${leagueSports[league]}/${league}`;
}
export function leagueResource(
  league,
  tab,
  { date, season, page = 1, week, seasonType = "2" } = {},
) {
  if (!hasLeague(league) || !leagueTabs(league).includes(tab)) return null;
  const query = (values) =>
    "?" +
    new URLSearchParams(
      Object.entries(values).filter(
        ([, value]) => value != null && value !== "",
      ),
    );
  switch (tab) {
    case "scores":
    case "fights":
      return (
        scorePath(league) +
        query(
          week
            ? { season, week, seasontype: seasonType }
            : { date: date?.replaceAll("-", "") },
        )
      );
    case "news":
      return (
        `/api/news/league/${league}` +
        query({ limit: 12, offset: (page - 1) * 12 })
      );
    case "standings":
      return (
        `/api/standings/${leagueSports[league] === "soccer" ? "soccer/" : ""}${league}` +
        query({ season, seasontype: "2" })
      );
    case "stats":
      return `/api/leaders/${league}` + query({ season, limit: 10 });
    case "transactions":
      return `/api/transactions/${league}` + query({ season, page, limit: 25 });
    case "draft":
      return `/api/draft/${league}/${season}`;
    case "recruits":
      return `/api/recruits/${league}/${season}`;
    case "awards":
      return `/api/${league}/award-seasons` + query({ season, type: "all" });
    case "champions":
      return "/api/mma/champions?current=true";
    case "rankings":
      return `/api/standings/${league}/rankings` + query({ season });
    case "playoffs":
      return (
        `/api/games/${leagueSports[league]}/${league}/playoffs` +
        query({ season })
      );
    case "bracket":
      return `/api/games/basketball/${league}/tournament` + query({ season });
    case "forum":
      return `/api/forum/league/${league}` + query({ page, limit: 20 });
    default:
      return null;
  }
}
const list = (value) => (Array.isArray(value) ? value : []);
export function scoreGroups(data, sport) {
  if (sport === "tennis")
    return [{ label: "Matches", games: list(data?.matches) }];
  if (["racing", "mma"].includes(sport))
    return [{ label: "Events", games: list(data?.events ?? data?.games) }];
  if (Array.isArray(data?.groups))
    return data.groups.map((group) => ({
      label: group.label,
      games: list(group.games),
    }));
  return [{ label: "", games: list(data?.games) }];
}
export function playoffGroups(data) {
  const payload = data?.data ?? data;
  if (Array.isArray(payload?.rounds))
    return payload.rounds.map((round) => ({
      label: round.label || round.name || round.round,
      games: Array.isArray(round.games)
        ? round.games
        : list(round.series).flatMap((series) => list(series.games)),
    }));
  if (Array.isArray(payload?.series))
    return payload.series.map((series) => ({
      label: series.label,
      games: list(series.games),
    }));
  return scoreGroups(payload, "football");
}

import { hasLeague, leagueSports, leagueTabs, standingsPath } from "./leagues.js";
export const hasTeamLeague = (league) =>
  hasLeague(league) &&
  [
    "basketball",
    "football",
    "baseball",
    "hockey",
    "soccer",
    "volleyball",
  ].includes(leagueSports[league]);
export const teamHref = (league, id) =>
  `/team/?${new URLSearchParams({ league, id })}`;
export function teamTabs(league) {
  const tabs = ["schedule", "news"];
  if (
    [
      "nba",
      "wnba",
      "gleague",
      "mcbb",
      "wcbb",
      "nfl",
      "cfb",
      "mlb",
      "nhl",
    ].includes(league) ||
    (leagueSports[league] === "soccer" && !["msoc", "wsoc"].includes(league))
  )
    tabs.push("roster");
  if (["nba", "wnba", "mcbb", "wcbb", "nfl", "cfb", "mlb"].includes(league))
    tabs.push("stats");
  if (leagueTabs(league).includes("standings")) tabs.push("standings");
  return [...tabs, "forum", "info"];
}
export function teamResource(league, id, tab, season, page = 1) {
  if (
    !hasTeamLeague(league) ||
    !/^\d+$/.test(String(id)) ||
    !teamTabs(league).includes(tab)
  )
    return null;
  switch (tab) {
    case "schedule":
      return `/api/games/${leagueSports[league]}/team/${league}/${id}/${season}`;
    case "news":
      return `/api/news/team/${league}/${id}?limit=12&offset=${(page - 1) * 12}`;
    case "roster":
      return `/api/roster/${league}/${id}`;
    case "stats":
      return `/api/team/stats/${league}/${id}?season=${season}`;
    case "standings":
      return `${standingsPath(league)}?season=${season}&seasontype=2`;
    case "forum":
      return `/api/forum/team/${league}/${id}?page=${page}&limit=20`;
    default:
      return `/api/teams/${league}/${id}`;
  }
}

// Match by roster membership rather than conference IDs, which differ across APIs.
export function teamConferenceStandings(data, teamId) {
  const list = value => Array.isArray(value) ? value : [];
  const containsTeam = group =>
    [...list(group.standings), ...list(group.teams)].some(row => String(row.team?.id ?? row.id) === String(teamId)) ||
    [...list(group.divisions), ...list(group.children)].some(containsTeam);
  const filterGroups = groups => list(groups).flatMap(group => {
    if (list(group.standings).length || list(group.divisions).length) return containsTeam(group) ? [group] : [];
    return filterGroups(group.children);
  });
  return {...data,
    conferences: list(data?.conferences).filter(containsTeam),
    groups: filterGroups(data?.groups),
    standings: list(data?.standings).some(row => String(row.team?.id ?? row.id) === String(teamId)) ? data.standings : [],
  };
}

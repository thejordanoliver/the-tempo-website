import { playerHref } from "../players/players.js";
import { hasTeamLeague, teamHref } from "../teams/teams.js";

export const WIDGETS = {
  favorite_games: {
    title: "Favorite Games",
    description: "Scores for your teams.",
  },
  favorite_teams: {
    title: "Favorite Teams",
    description: "Team shortcuts.",
  },
  my_picks: {
    title: "My Picks",
    description: "Prediction record.",
  },
  standings: {
    title: "Standings",
    description: "League standings.",
  },
  college_polls: {
    title: "College Polls",
    description: "College rankings.",
  },
  create_post: {
    title: "Create Post",
    description: "Post to a league.",
  },
};
export const GAME_LEAGUES = [
  "nba",
  "wnba",
  "mcbb",
  "wcbb",
  "mlb",
  "cb",
  "mcvb",
  "wcvb",
  "nfl",
  "cfb",
  "ufl",
  "nhl",
];
export const STANDINGS_LEAGUES = ["nba", "wnba", "nfl", "ufl", "mlb", "nhl"];
export function createWidget(type) {
  if (!Object.hasOwn(WIDGETS, type)) throw new Error("Unknown widget");
  return {
    id: `${type}:${crypto.randomUUID()}`,
    type,
    title: WIDGETS[type].title,
    createdAt: Date.now(),
    size: type === "create_post" ? "small" : "medium",
    order: 0,
    ...(type === "standings" ? { standingsLeague: "nba" } : {}),
    ...(type === "college_polls"
      ? {
          collegePollLeague: "cfb",
          collegePollType: "ap",
          collegePollAutoPlay: true,
        }
      : {}),
    ...(type === "favorite_teams" ? { favoriteTeamsAutoPlay: true } : {}),
    ...(type === "favorite_games"
      ? { favoriteGameLeagues: GAME_LEAGUES, favoriteGamesAutoPlay: true }
      : {}),
  };
}
export function orderWidgets(widgets) {
  return widgets.map((widget, order) => ({ ...widget, order }));
}
export function defaultWidgets() {
  return orderWidgets(
    [
      "favorite_games",
      "favorite_teams",
      "standings",
      "college_polls",
      "my_picks",
      "create_post",
    ].map(createWidget),
  );
}
export function readSettings(value) {
  if (value?.settings === null)
    return { widgets: defaultWidgets(), revision: 0 };
  const settings = value?.settings;
  if (
    settings?.schemaVersion !== 2 ||
    !Number.isSafeInteger(settings.revision) ||
    settings.revision < 1 ||
    !Array.isArray(settings.widgets) ||
    settings.widgets.some((w) => !Object.hasOwn(WIDGETS, w.type))
  )
    throw new Error("Couldn’t load your layout. Reload settings to edit.");
  return {
    widgets: orderWidgets(
      [...settings.widgets].sort((a, b) => a.order - b.order),
    ),
    revision: settings.revision,
  };
}
export const resultKey = (item) =>
  `${item.type}:${item.affiliation || ""}:${item.id}`;
export const resultName = (item) =>
  item.full_name ||
  item.fullName ||
  item.name ||
  item.short_name ||
  item.username ||
  "Unknown result";
export function resultHref(item) {
  if (!/^\d+$/.test(String(item.id))) return null;
  if (item.type === "user") return `/user/?id=${encodeURIComponent(item.id)}`;
  const league = item.affiliation === "soccer" ? "socc" : item.affiliation;
  if (item.type === "player") return playerHref(league, item.id);
  const teamLeague =
    league === "socc" ? item.leagueKey || item.league || "socc" : league;
  return item.type === "team" && hasTeamLeague(teamLeague)
    ? teamHref(teamLeague, item.id)
    : null;
}

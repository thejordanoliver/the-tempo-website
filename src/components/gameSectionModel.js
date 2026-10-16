import { teamIdentity } from "../teamIdentity.js";
export const teamLabel = (team, league) =>
  team.code ||
  team.abbreviation ||
  team.shortName ||
  teamIdentity(team, league).shortName ||
  team.name ||
  "Team";
export function sideGroup(groups, team, side) {
  return (
    groups.find(
      (g) => g.team?.id != null && String(g.team.id) === String(team.id),
    ) || groups.find((g) => g.homeAway === side)
  );
}
export const statLabel = (name) =>
  ({
    "fieldGoalsMade-fieldGoalsAttempted": "Field Goals Made/Attempted",
    "threePointFieldGoalsMade-threePointFieldGoalsAttempted":
      "3PT Made/Attempted",
    "freeThrowsMade-freeThrowsAttempted": "Free Throws Made/Attempted",
    freeThrowPct: "Free Throws Percentage",
    totalRebounds: "Total Rebounds",
    offensiveRebounds: "Offensive Rebounds",
    defensiveRebounds: "Defensive Rebounds",
  })[name] ||
  String(name)
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (s) => s.toUpperCase());
export function comparison(away, home, name) {
  const a = parseFloat(away),
    h = parseFloat(home);
  if (!Number.isFinite(a) || !Number.isFinite(h) || a === h) return "tie";
  const lower =
    /turnover|foul|giveaway|penalt|errors|fumblesLost|interceptions/i.test(
      name,
    );
  return (lower ? a < h : a > h) ? "away" : "home";
}
export const leaderConfig = {
  points: [
    "Points",
    [
      ["PTS", "points"],
      ["FG", "fieldGoals"],
      ["FT", "freeThrows"],
    ],
  ],
  assists: [
    "Assists",
    [
      ["AST", "assists"],
      ["TO", "turnovers"],
      ["AST/TO", "assistTurnoverRatio"],
    ],
  ],
  rebounds: [
    "Rebounds",
    [
      ["REB", "rebounds"],
      ["DREB", "defensiveRebounds"],
      ["OREB", "offensiveRebounds"],
    ],
  ],
  pointsPerGame: [
    "Points",
    [
      ["PTS", "avgPoints"],
      ["FT%", "freeThrowPct"],
      ["FG%", "fieldGoalPct"],
    ],
  ],
  assistsPerGame: [
    "Assists",
    [
      ["AST", "avgAssists"],
      ["TO", "avgTurnovers"],
      ["MIN", "avgMinutes"],
    ],
  ],
  reboundsPerGame: [
    "Rebounds",
    [
      ["REB", "avgRebounds"],
      ["DREB", "avgDefensiveRebounds"],
      ["OREB", "avgOffensiveRebounds"],
    ],
  ],
};

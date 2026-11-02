import test from "node:test";
import assert from "node:assert/strict";
import {
  hasTeamLeague,
  teamHref,
  teamTabs,
  teamResource,
} from "../src/teams.js";
test("team pages accept team sports and reject individual sports and invalid IDs", () => {
  for (const league of ["nba", "nfl", "cb", "epl", "mcvb", "nhl"])
    assert(hasTeamLeague(league));
  for (const league of ["ufc", "f1", "atp", "__proto__"])
    assert(!hasTeamLeague(league));
  assert.equal(teamResource("nba", "../../bad", "schedule", 2027), null);
  assert.equal(teamResource("nba", 13, "invalid", 2027), null);
});
test("schedule routes preserve each sport, league, team and selected season", () => {
  for (const [league, sport] of Object.entries({
    nba: "basketball",
    nfl: "football",
    mlb: "baseball",
    nhl: "hockey",
    epl: "soccer",
    wcvb: "volleyball",
  }))
    assert.equal(
      teamResource(league, 13, "schedule", 2027),
      `/api/games/${sport}/team/${league}/13/2027`,
    );
  assert.equal(teamHref("nba", 13), "/team/?league=nba&id=13");
});
test("team resources use team-specific feeds and pagination", () => {
  assert.equal(
    teamResource("nba", 13, "news", 2027, 2),
    "/api/news/team/nba/13?limit=12&offset=12",
  );
  assert.equal(
    teamResource("nba", 13, "forum", 2027, 2),
    "/api/forum/team/nba/13?page=2&limit=20",
  );
  assert.equal(teamResource("nba", 13, "roster", 2027), "/api/roster/nba/13");
  assert.equal(
    teamResource("epl", 13, "standings", 2027),
    "/api/standings/soccer/epl?season=2027&seasontype=2",
  );
});
test("tabs omit unavailable data and retain schedule, discussions and team information", () => {
  assert.deepEqual(teamTabs("nba"), [
    "schedule",
    "news",
    "roster",
    "stats",
    "standings",
    "forum",
    "info",
  ]);
  assert(!teamTabs("msoc").includes("roster"));
  assert(!teamTabs("mcvb").includes("stats"));
});

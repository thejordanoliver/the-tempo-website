import assert from "node:assert/strict";
import test from "node:test";

import {
  hasTeamLeague,
  teamHref,
  teamTabs,
  teamResource,
  teamConferenceStandings,
} from "../src/data/teams/teams.js";
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

test("college team standings use conference endpoints", () => {
  for (const league of ["cfb", "mcbb", "wcbb"]) {
    assert.equal(
      teamResource(league, 57, "standings", 2026),
      `/api/standings/${league}/conference?season=2026&seasontype=2`,
    );
  }
});

test("team standings retain the full matching conference and omit other conferences", () => {
  const data = {
    conferences: [
      {
        name: "SEC",
        divisions: [{ name: "Overall", teams: [{ id: 57 }, { id: 2 }] }],
      },
      { name: "ACC", divisions: [{ name: "Overall", teams: [{ id: 3 }] }] },
    ],
  };
  const result = teamConferenceStandings(data, "57");
  assert.deepEqual(result.conferences, [data.conferences[0]]);
  assert.equal(result.conferences[0].divisions[0].teams.length, 2);
  assert.deepEqual(teamConferenceStandings(data, 999).conferences, []);
  assert.equal(data.conferences.length, 2);
});
test("team standings match professional and volleyball conference team IDs", () => {
  assert.equal(
    teamConferenceStandings(
      { conferences: [{ name: "East", standings: [{ id: 13 }] }] },
      "13",
    ).conferences.length,
    1,
  );
  const groups = [
    {
      name: "NCAA",
      children: [
        { name: "SEC", standings: [{ team: { id: 57 } }] },
        { name: "ACC", standings: [{ team: { id: 3 } }] },
      ],
    },
  ];
  assert.equal(teamConferenceStandings({ groups }, 57).groups[0].name, "SEC");
});

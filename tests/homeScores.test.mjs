import assert from "node:assert/strict";
import test from "node:test";

import { groupHomeScores, scoreboardItems } from "../src/utils/homeScores.js";

const game = (id, state = "pre", home = "1", priority = []) => ({
  id,
  home: { id: home },
  away: { id: "away" },
  status: { state },
  matchupPriority: priority,
});
const item = (league, id, state, home, priority) => ({
  league,
  game: game(id, state, home, priority),
});

test("Home groups every game by league, preserving favorites before other leagues", () => {
  const input = [
    item("nba", "1"),
    item("nfl", "1"),
    item("epl", "1"),
    item("nba", "2"),
  ];
  const sections = groupHomeScores(
    input,
    [{ league: "nfl", id: "1" }],
    ["epl"],
  );
  assert.deepEqual(
    sections.map(({ league }) => league),
    ["nfl", "epl", "nba"],
  );
  assert.deepEqual(
    sections.map(({ games }) => games.length),
    [1, 1, 2],
  );
  assert.equal(input.length, 4);
});
test("favorite teams lead their league, then live, upcoming and final games use backend matchup priority", () => {
  const input = [
    item("nba", "final", "post"),
    item("nba", "upcoming", "pre"),
    item("nba", "live", "in"),
    item("nba", "priority", "in", "1", [5]),
    item("nba", "favorite", "pre", "favorite"),
  ];
  const sections = groupHomeScores(input, [{ league: "nba", id: "favorite" }]);
  assert.deepEqual(
    sections[0].games.map(({ id }) => id),
    ["favorite", "priority", "live", "upcoming", "final"],
  );
  assert.equal(input[0].game.id, "final");
});
test("identical IDs in different leagues remain distinct and repeat games do not duplicate", () => {
  const sections = groupHomeScores([
    item("nba", "1"),
    item("nfl", "1"),
    item("nba", "1"),
    item("invalid", "2"),
  ]);
  assert.deepEqual(
    sections.map(({ league, games }) => [league, games.length]),
    [
      ["nba", 1],
      ["nfl", 1],
    ],
  );
  assert.deepEqual(groupHomeScores([]), []);
});
test("backend tennis matches and MMA/racing events remain in their league categories", () => {
  const match = game("match"),
    event = game("event");
  assert.equal(scoreboardItems({ matches: [match] }, "atp")[0].game, match);
  assert.equal(scoreboardItems({ events: [event] }, "ufc")[0].game, event);
  assert.equal(scoreboardItems({ events: [event] }, "f1")[0].game, event);
  assert.deepEqual(scoreboardItems(null, "nba"), []);
});

test("Home caps a sport at ten games across its league categories without capping other sports", () => {
  const games = (league, count) =>
    Array.from({ length: count }, (_, index) =>
      item(league, `${league}-${index}`),
    );
  const input = [
    ...games("nba", 6),
    ...games("wnba", 8),
    ...games("nfl", 12),
    ...games("cfb", 5),
    ...games("nhl", 4),
  ];
  const sections = groupHomeScores(input);
  assert.deepEqual(
    sections.map(({ league, games }) => [league, games.length]),
    [
      ["nba", 6],
      ["wnba", 4],
      ["nfl", 10],
      ["nhl", 4],
    ],
  );
  assert.equal(
    input.length,
    35,
    "source data remains available to live updates and league pages",
  );
});

test("saved leagues and favorite teams keep priority before the shared sport cap", () => {
  const input = [
    ...Array.from({ length: 12 }, (_, index) => item("nba", `${index}`, "pre")),
    ...Array.from({ length: 8 }, (_, index) => item("wnba", `${index}`, "pre")),
    item("nba", "favorite", "pre", "favorite"),
    item("nba", "live", "in"),
  ];
  const sections = groupHomeScores(
    input,
    [{ league: "nba", id: "favorite" }],
    ["wnba"],
  );
  assert.equal(sections.length, 1);
  assert.equal(sections[0].games.length, 10);
  assert.deepEqual(
    sections[0].games.slice(0, 2).map(({ id }) => id),
    ["favorite", "live"],
  );
  const saved = groupHomeScores(input, [], ["wnba"]);
  assert.deepEqual(
    saved.map(({ league, games }) => [league, games.length]),
    [
      ["wnba", 8],
      ["nba", 2],
    ],
  );
});

test("live state changes reselect visible games before applying the ten-game cap", () => {
  const input = Array.from({ length: 11 }, (_, index) =>
    item("nba", String(index), "pre"),
  );
  assert(!groupHomeScores(input)[0].games.some(({ id }) => id === "10"));
  input[10].game.status.state = "in";
  const selected = groupHomeScores(input)[0].games;
  assert.equal(selected.length, 10);
  assert.equal(selected[0].id, "10");
});

test("duplicate games do not consume the cap and tennis shares one budget across ATP and WTA", () => {
  const matches = Array.from({ length: 7 }, (_, index) =>
    item("atp", String(index)),
  );
  const input = [
    ...matches,
    ...matches,
    ...Array.from({ length: 7 }, (_, index) => item("wta", String(index))),
  ];
  assert.deepEqual(
    groupHomeScores(input).map(({ league, games }) => [league, games.length]),
    [
      ["atp", 7],
      ["wta", 3],
    ],
  );
});

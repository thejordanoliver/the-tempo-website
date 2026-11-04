import assert from "node:assert/strict";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import test from "node:test";

import { build } from "esbuild";

import {
  playerApiLeague,
  playerHref,
  playerResource,
  seasonStatGroups,
  seasonPhase,
} from "../src/data/players/players.js";

test("player profiles use existing backend endpoints and soccer/fighter aliases", () => {
  assert.equal(playerResource("nba", 1), "/api/roster/player/1");
  assert.equal(playerResource("nfl", 2), "/api/roster/nfl/player/2");
  assert.equal(playerResource("epl", 3), "/api/roster/socc/player/3");
  assert.equal(playerResource("ufc", 4), "/api/roster/mma/player/4");
  assert.equal(
    playerResource("mma", 4, "career"),
    "/api/player/fightlog/ufc/4",
  );
  assert.equal(playerResource("mlb", 2, "stats"), "/api/player/stats/mlb/2");
  assert.equal(
    playerResource("nba", 2, "gamelog", {
      season: "2026",
      category: "regular",
    }),
    "/api/player/gamelog/nba/2?season=2026&category=regular",
  );
  assert.equal(playerHref("ufc", 4), "/fighter/?league=ufc&id=4");
  assert.equal(playerHref("nba", 1), "/player/?league=nba&id=1");
  for (const id of [
    null,
    "",
    "../1",
    "1&admin=true",
    "0",
    "-1",
    "9007199254740992",
  ])
    assert.equal(playerHref("nba", id), null);
  assert.equal(playerApiLeague("invalid"), null);
});
test("season stat mapping preserves actual zeros and omits unavailable/internal data", () => {
  assert.deepEqual(
    seasonStatGroups({
      averages: { avgPoints: 0, avgAssists: "2.0", missing: null },
      totals: null,
    }),
    { averages: { avgPoints: 0, avgAssists: "2.0" } },
  );
  assert.deepEqual(
    seasonStatGroups({
      stats: { passing: { yards: 100, touchdowns: 0 }, rushing: { yards: 12 } },
    }),
    { passing: { yards: 100, touchdowns: 0 }, rushing: { yards: 12 } },
  );
});
await mkdir(".preview/tests", { recursive: true });
const bundled = await build({
  stdin: {
    contents: `
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import Player, {
  PlayerProfile,
  PlayerSeasonStats,
  FighterHistory,
  SeasonTeam,
} from "./src/pages/Player.jsx";
export const render = (name, props) =>
  renderToStaticMarkup(
    React.createElement(
      { Player, PlayerProfile, PlayerSeasonStats, FighterHistory, SeasonTeam }[
        name
      ],
      props,
    ),
  );
`,
    resolveDir: process.cwd(),
    loader: "jsx",
  },
  bundle: true,
  write: false,
  platform: "node",
  format: "esm",
  jsx: "automatic",
  packages: "external",
  loader: { ".css": "empty", ".png": "dataurl" },
});
await writeFile(
  ".preview/tests/player-render.mjs",
  bundled.outputFiles[0].contents,
);
const { render } = await import("../.preview/tests/player-render.mjs");
test("profiles show bios, images, honors and sport-specific sections", () => {
  const player = {
    full_name: "Test Player",
    headshot_url: "https://example.test/headshot.png",
    team_id: 1,
    height: "6 ft",
    weight: 200,
    experience: 0,
    awards: ["Most Valuable Player"],
  };
  const html = render("PlayerProfile", { player, league: "nba", id: 1 });
  for (const value of [
    "Test Player",
    "headshot.png",
    "Player details",
    "200 lbs",
    "Most Valuable Player",
    "Season Stats",
    "Game Log",
  ])
    assert(html.includes(value));
  assert(!html.includes("/team/?"));
  assert(html.includes('class="player-team-watermark"'));
  assert(html.includes('class="player-award-card"'));
  const fighter = render("PlayerProfile", {
    player: {
      ...player,
      nickname: "The Champ",
      citizenship: "Brazil",
      flag_url: "https://example.test/flag.png",
      stance_text: "Orthodox",
    },
    league: "ufc",
    id: 2,
  });
  for (const value of [
    "Fighter details",
    "The Champ",
    "Brazil",
    "flag.png",
    "Orthodox",
    "Career Stats",
    "Fight Log",
  ])
    assert(fighter.includes(value));
  assert(!fighter.includes("Season Stats"));
  assert(
    render("Player", { search: "?league=nba&id=bad" }).includes(
      "Player not found",
    ),
  );
});
test("career stats and fight log render backend values with opponent profile links", () => {
  const data = {
    careerStats: [
      { key: "wins", label: "Wins", value: "12", description: "Career wins" },
    ],
    fights: [
      {
        date: "2026-01-01",
        eventName: "UFC Test",
        opponent: { id: 3, name: "Opponent" },
        result: "W",
        method: "KO",
        round: 1,
        time: "1:02",
      },
    ],
  };
  assert(render("FighterHistory", { data, career: true }).includes("12"));
  const html = render("FighterHistory", { data });
  for (const value of [
    "UFC Test",
    "Opponent",
    "KO",
    "1:02",
    "/fighter/?league=ufc&amp;id=3",
  ])
    assert(html.includes(value));
  assert(
    render("FighterHistory", { data: { fights: [] } }).includes(
      "No fight history",
    ),
  );
});
test("season stats keep regular and postseason rows distinguishable", () => {
  const html = render("PlayerSeasonStats", {
    data: {
      seasons: [
        {
          season: 2026,
          season_type_label: "Playoffs",
          averages: { avgPoints: 0 },
        },
      ],
    },
  });
  assert(html.includes('value="postseason"'));
  assert(html.includes('value="regular"'));
  assert(html.includes("No regular season stats."));
  const regular = render("PlayerSeasonStats", {
    data: {
      seasons: [
        { season: 2026, season_type: 2, averages: { avgPoints: 0 } },
        { season: 2026, season_type: 3, averages: { avgPoints: 42 } },
      ],
    },
  });
  assert(regular.includes("Avg Points"));
  assert(regular.includes(">0<"));
  assert(!regular.includes(">42<"));
  assert(!regular.includes(">Type<"));
  assert(
    render("PlayerSeasonStats", { data: { seasons: [] } }).includes(
      "No season stats.",
    ),
  );
});
test("static build includes player and fighter direct-entry routes", async () => {
  const source = await readFile("scripts/build.mjs", "utf8");
  assert(source.includes('"player"'));
  assert(source.includes('"fighter"'));
  for (const route of ["player", "fighter"])
    assert(
      (await readFile(`${route}/index.html`, "utf8")).includes('id="root"'),
    );
});

test("college football removes the profile eyebrow and season teams use codes and logos", () => {
  const profile = render("PlayerProfile", {
    player: { full_name: "Test Quarterback" },
    league: "cfb",
    id: 1,
  });
  assert(!profile.includes('class="eyebrow"'));
  const team = render("SeasonTeam", {
    season: { team: { id: 57, name: "Florida Gators", code: "FLA" } },
    league: "cfb",
    teams: { 57: { logo: "https://example.test/florida.png" } },
  });
  assert(team.includes("florida.png"));
  assert(team.includes(">FLA<"));
  assert(!team.includes("/team/?"));
});

test("season phases recognize normalized labels and numeric season types", () => {
  for (const season of [
    { season_type: 3 },
    { season_type: "3" },
    { season_type_label: "Postseason" },
    { season_type_label: "Playoffs" },
  ])
    assert.equal(seasonPhase(season), "postseason");
  for (const season of [
    { season_type: 2 },
    { season_type_label: "Regular Season" },
    {},
  ])
    assert.equal(seasonPhase(season), "regular");
  assert.equal(seasonPhase({ season_type: 1 }), "preseason");
});

test("season tables wait for team identities instead of flashing slug or missing-logo rows", () => {
  const html = render("PlayerSeasonStats", {
    league: "nba",
    data: {
      seasons: [
        {
          season: 2026,
          team_id: 1,
          team_slug: "atlanta-hawks",
          averages: { avgPoints: 25 },
        },
      ],
    },
  });
  assert(html.includes("Loading…"));
  assert(!html.includes("<table"));
  assert(!html.includes("atlanta-hawks"));
});

test("resolved team code and logos override stale season metadata", () => {
  const html = render("SeasonTeam", {
    league: "nba",
    season: { team: { id: 1, code: "OLD", logo: null } },
    teams: {
      1: { id: 1, code: "ATL", logo: "https://example.test/resolved.png" },
    },
  });
  assert(html.includes(">ATL<"));
  assert(!html.includes(">OLD<"));
  assert(html.includes("resolved.png"));
});

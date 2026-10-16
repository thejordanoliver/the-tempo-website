import { test } from "node:test";
import assert from "node:assert/strict";
import { build } from "esbuild";
import { mkdir, writeFile } from "node:fs/promises";
await mkdir(".preview/tests", { recursive: true });
const result = await build({
  stdin: {
    contents: `import React from 'react';import {renderToStaticMarkup} from 'react-dom/server';import Landing from './src/pages/Landing.jsx';import Support from './src/pages/Support.jsx';import Privacy from './src/pages/Privacy.jsx';import Game from './src/pages/Game.jsx';import Article from './src/pages/Article.jsx';import {safeURL} from './src/components.jsx';import TeamLogo from './src/components/TeamLogo.jsx';import GameHeader from './src/components/GameHeader.jsx';import LineScore from './src/components/LineScore.jsx';import GameStats from './src/components/GameStats.jsx';import GameLeaders from './src/components/GameLeaders.jsx';export {safeURL};export const render=(name,props={})=>renderToStaticMarkup(React.createElement({Landing,Support,Privacy,Game,Article,TeamLogo,GameHeader,LineScore,GameStats,GameLeaders}[name],props));`,
    resolveDir: process.cwd(),
    loader: "jsx",
  },
  loader: { ".png": "dataurl", ".css": "empty" },
  bundle: true,
  write: false,
  platform: "node",
  format: "esm",
  jsx: "automatic",
  packages: "external",
});
await writeFile(".preview/tests/render.mjs", result.outputFiles[0].contents);
const { render, safeURL } = await import("../.preview/tests/render.mjs");
test("homepage preserves copy and links to the React sign-in route", () => {
  const html = render("Landing");
  assert(html.includes("YOUR GAME."));
  assert(html.includes('href="/login/"'));
  assert(!html.includes('href="./login/"'));
});
test("support and privacy remain public with contact and draft notice", () => {
  assert(render("Support").includes("jordanoliver@thetemposports.com"));
  assert(render("Privacy").includes("Draft — pending verification."));
});
test("invalid game/article links render recoverable states", () => {
  assert(
    render("Game", { search: "?id=bad" }).includes("Select a supported game"),
  );
  assert(render("Article", { search: "" }).includes("Select an article"));
});
test("external media/link validation rejects executable URLs", () => {
  assert.equal(safeURL("javascript:alert(1)"), null);
  assert.equal(safeURL("data:text/html,bad"), null);
  assert.equal(
    safeURL("https://example.test/story"),
    "https://example.test/story",
  );
});

test("shared team logo provides a dark-mode source for game screens and cards", () => {
  const html = render("TeamLogo", { team: { id: 26 }, league: "nba" });
  assert(html.includes('media="(prefers-color-scheme: dark)"'));
  assert(html.includes("srcSet="));
});

const headerGame = {
  away: { id: 26, code: "UTA", score: 108, record: "1-2" },
  home: { id: 20, code: "PHI", score: 112, record: "2-1" },
};
test("pregame records occupy the score positions rather than team labels", () => {
  const html = render("GameHeader", {
    score: {
      ...headerGame,
      status: { state: "pre", description: "Scheduled" },
    },
    league: "nba",
  });
  assert.equal((html.match(/gh-pregame-record/g) || []).length, 2);
  assert(!html.includes('class="gh-team-record"'));
  assert(html.includes("Away record 1-2"));
});
test("live scores use central slots and final records sit below team names", () => {
  const live = render("GameHeader", {
    score: {
      ...headerGame,
      status: {
        state: "in",
        description: "In Progress",
        period: 4,
        displayClock: "2:00",
      },
    },
    league: "nba",
  });
  assert(live.includes("Away score 108"));
  assert(!live.includes('class="gh-team-record"'));
  const final = render("GameHeader", {
    score: { ...headerGame, status: { state: "post", description: "Final" } },
    league: "nba",
  });
  assert.equal((final.match(/class="gh-team-record"/g) || []).length, 2);
  assert(final.includes("gh-loser"));
});

const sectionScore={...headerGame,status:{state:"post"},periodScores:[{period:1,away:32,home:35}],teamStats:[{team:{id:20},stats:[{name:"turnovers",displayValue:"15"}]},{team:{id:26},stats:[{name:"turnovers",displayValue:"9"}]}],leaders:[{team:{id:26},leaders:[{name:"points",leaders:[{athlete:{fullName:"Test Player",jersey:"4"},mainStat:{value:"23"},statistics:[{name:"fieldGoals",displayValue:"9/15"}]}]}]}]};
test("line score preserves missing periods instead of inventing zeros",()=>{const html=render("LineScore",{score:sectionScore,league:"nba"});assert(html.includes("Line Score"));assert(html.includes("heading-two"));assert(html.includes("TOTAL"));assert(html.includes("32"));assert(html.includes("–"));});
test("team stats align by team ID and highlight fewer turnovers",()=>{const html=render("GameStats",{score:sectionScore,league:"nba"});assert(html.includes("Game Stats"));assert(html.includes('class="stat-trailing"><span class="sr-only">PHI </span>15'));assert(html.includes('media="(prefers-color-scheme: dark)"'));});
test("leaders render backend player statistics and accessible tabs",()=>{const html=render("GameLeaders",{score:sectionScore,league:"nba"});assert(html.includes("Test Player"));assert(html.includes("9/15"));assert(html.includes('role="tab"'));assert(html.includes('role="tabpanel"'));assert(html.includes("Leader unavailable"));assert.equal(render("GameLeaders",{score:{...sectionScore,leaders:[]},league:"nba"}),"");});

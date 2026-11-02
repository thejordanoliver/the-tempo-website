import test from "node:test";
import assert from "node:assert/strict";
import { build } from "esbuild";
import { mkdir, writeFile } from "node:fs/promises";
import {
  sportLeagues,
  leagueSports,
  leagueTabs,
  leagueResource,
  defaultSeason,
  scoreGroups,
  playoffGroups,
} from "../src/leagues.js";

await mkdir(".preview/tests", { recursive: true });
const result = await build({
  stdin: {
    contents: `import React from 'react'; import {renderToStaticMarkup} from 'react-dom/server'; import {StandingsFilter} from './src/components/CollegeRankings.jsx'; import ForumPosts from './src/components/ForumPosts.jsx'; import {CommentsList} from './src/pages/Post.jsx'; import Leagues from './src/pages/Leagues.jsx'; import League from './src/pages/League.jsx'; import Game from './src/pages/Game.jsx'; import {favoriteLeagues} from './src/favoriteLeagues.js'; import {LeagueScores,LeagueStandings,LeagueStats,LeagueNews,LeagueRecords} from './src/components/LeagueContent.jsx'; export {favoriteLeagues}; export const render=(name,props={})=>renderToStaticMarkup(React.createElement({StandingsFilter,ForumPosts,CommentsList,Leagues,League,Game,LeagueScores,LeagueStandings,LeagueStats,LeagueNews,LeagueRecords}[name],props));`,
    resolveDir: process.cwd(),
    loader: "jsx",
  },
  bundle: true,
  write: false,
  platform: "node",
  format: "esm",
  jsx: "automatic",
  packages: "external",
  loader: { ".png": "dataurl", ".css": "empty" },
});
await writeFile(
  ".preview/tests/league-render.mjs",
  result.outputFiles[0].contents,
);
const { render, favoriteLeagues } = await import(
  "../.preview/tests/league-render.mjs"
);

test("directory exposes every app league across all nine sports with theme logos", () => {
  const leagues = Object.values(sportLeagues).flat();
  assert.equal(Object.keys(sportLeagues).length, 9);
  assert.equal(new Set(leagues).size, 32);
  for (const league of leagues) {
    assert(favoriteLeagues[league]?.logo);
    assert(favoriteLeagues[league]?.logoDark);
    assert(leagueSports[league]);
  }
  const html = render("Leagues");
  for (const league of leagues)
    assert(html.includes(`/league/?league=${league}`), league);
  assert(html.includes("Search leagues"));
  assert.equal((html.match(/<svg/g) || []).length, leagues.length);
  assert(
    html.includes('class="tempo-icon league-tile-arrow" aria-hidden="true"'),
  );
  assert(!html.includes("<ion-icon"));
  assert(html.includes("prefers-color-scheme: dark"));
});
test("scoreboards use normalized backend routes for every sport", () => {
  for (const [league, endpoint] of Object.entries({
    nba: "basketball/nba",
    cfb: "football/cfb",
    mlb: "baseball",
    cb: "baseball/cb",
    nhl: "hockey",
    epl: "soccer/epl",
    ufc: "mma/ufc",
    f1: "racing/f1",
    atp: "tennis/atp",
    mcvb: "volleyball/mcvb",
  })) {
    const tab = league === "ufc" ? "fights" : "scores";
    assert.equal(
      leagueResource(league, tab, { date: "2026-11-01" }),
      `/api/games/${endpoint}?date=20261101`,
    );
  }
  assert.equal(leagueResource("__proto__", "scores"), null);
  assert.equal(leagueResource("nba", "invented"), null);
  assert.equal(
    leagueResource("nfl", "scores", { week: 8, season: 2026, seasonType: 2 }),
    "/api/games/football/nfl?season=2026&week=8&seasontype=2",
  );
});
test("sections have sport-specific tabs, API routes, season and pagination params", () => {
  assert.deepEqual(leagueTabs("ufc"), ["fights", "news", "champions", "forum"]);
  assert(!leagueTabs("atp").includes("standings"));
  assert(!leagueTabs("mcvb").includes("rankings"));
  assert.equal(
    leagueResource("epl", "standings", { season: 2026 }),
    "/api/standings/soccer/epl?season=2026&seasontype=2",
  );
  assert.equal(
    leagueResource("nba", "news", { page: 2 }),
    "/api/news/league/nba?limit=12&offset=12",
  );
  assert.equal(
    leagueResource("nba", "stats", { season: 2027 }),
    "/api/leaders/nba?season=2027&limit=10",
  );
  assert.equal(
    leagueResource("nba", "draft", { season: 2026 }),
    "/api/draft/nba/2026",
  );
  assert.equal(
    leagueResource("nba", "transactions", { season: 2026, page: 2 }),
    "/api/transactions/nba?season=2026&page=2&limit=25",
  );
  assert.equal(defaultSeason("nba", new Date(2026, 10, 1)), 2027);
  assert.equal(defaultSeason("nfl", new Date(2026, 1, 1)), 2025);
  assert.equal(defaultSeason("wnba", new Date(2026, 1, 1)), 2025);
});
test("invalid league URLs recover and public forum requests require sign-in", () => {
  assert(
    render("League", { search: "?league=unknown" }).includes(
      "Browse all leagues",
    ),
  );
  const html = render("League", { search: "?league=nba&tab=forum" });
  assert(html.includes("Join the conversation"));
  assert(html.includes("/login/"));
  const fallback = render("League", {
    search: "?league=nba&tab=unknown&date=bad&season=9999",
  });
  assert(fallback.includes('aria-selected="true"'));
  assert(fallback.includes("league-tab-scores"));
  assert(!fallback.includes('value="9999"'));
});
test("grouping keeps backend football weeks and postseason rounds", () => {
  assert.deepEqual(
    scoreGroups(
      { groups: [{ label: "Week 8", games: [{ id: 1 }] }] },
      "football",
    ),
    [{ label: "Week 8", games: [{ id: 1 }] }],
  );
  assert.deepEqual(
    playoffGroups({
      data: { rounds: [{ label: "Final", games: [{ id: 3 }] }] },
    }),
    [{ label: "Final", games: [{ id: 3 }] }],
  );
  assert.deepEqual(scoreGroups({ matches: [{ id: 2 }] }, "tennis"), [
    { label: "Matches", games: [{ id: 2 }] },
  ]);
});
test("standings and player leaders preserve actual zero values", () => {
  const html = render("LeagueStandings", {
    league: "nba",
    data: {
      conferences: [
        {
          id: "east",
          name: "Eastern",
          standings: [
            { name: "Test team", wins: 0, losses: 2, winPercent: 0, rank: 1 },
          ],
        },
      ],
    },
  });
  assert(html.includes("Eastern"));
  assert(html.includes("Test team"));
  assert(html.includes("<td>0</td>"));
  const stats = render("LeagueStats", {
    data: {
      categories: [
        {
          categoryName: "Points",
          abbreviation: "PTS",
          leaders: [{ rank: 1, full_name: "Test Player", stat_value: 0 }],
        },
      ],
    },
  });
  assert(stats.includes("Test Player"));
  assert(stats.includes("<td>0</td>"));
});
test("tennis and racing cards show native sport data instead of fake team games", () => {
  const html = render("LeagueScores", {
    league: "atp",
    data: {
      matches: [
        {
          id: 1,
          tournamentName: "Tour final",
          competitors: [
            { id: 1, displayName: "Player One", score: 2, winner: true },
            { id: 2, displayName: "Player Two", score: 1 },
          ],
        },
      ],
    },
  });
  assert(html.includes("Player One"));
  assert(html.includes("Tour final"));
  assert(!html.includes("/game/"));
  const racing = render("LeagueScores", {
    league: "f1",
    data: {
      events: [
        {
          id: 1,
          name: "Grand Prix",
          drivers: [{ position: 1, fullName: "Driver One", team: "Team One" }],
        },
      ],
    },
  });
  assert(racing.includes("Grand Prix"));
  assert(racing.includes("Driver One"));
});
test("news links, forum text and draft results render without inserting untrusted HTML", () => {
  assert(
    render("LeagueNews", {
      data: { articles: [{ id: 42, headline: "League news" }] },
    }).includes("/article/?id=42"),
  );
  const forum = render("LeagueRecords", {
    tab: "forum",
    data: {
      posts: [{ id: 1, username: "fan", content: "<script>bad()</script>" }],
    },
  });
  assert(forum.includes("&lt;script&gt;"));
  assert(!forum.includes("<script>"));
  const draft = render("LeagueRecords", {
    tab: "draft",
    data: {
      picks: [
        { overall: 1, round: 1, teamId: 2, athlete: { name: "Draft Player" } },
      ],
      teams: [{ id: 2, name: "Test team" }],
    },
  });
  assert(draft.includes("Draft Player"));
  assert(draft.includes("Test team"));
});
test("game links for additional team leagues now resolve to a detail screen", () => {
  for (const league of ["wnba", "wcbb", "ufl", "epl", "mcvb"])
    assert(
      !render("Game", { search: `?league=${league}&id=123` }).includes(
        "Select a supported game",
      ),
      league,
    );
});

test("volleyball standings display normalized nested groups and statistic columns", () => {
  const html = render("LeagueStandings", {
    league: "wcvb",
    showRankings: false,
    data: {
      groups: [
        {
          name: "NCAA",
          children: [
            {
              name: "Conference",
              standings: [
                {
                  team: { name: "Test Volleyball" },
                  stats: [
                    {
                      name: "wins",
                      label: "Wins",
                      value: 0,
                      displayValue: "0",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  });
  assert(html.includes("Conference"));
  assert(html.includes("Test Volleyball"));
  assert(html.includes("Wins"));
  assert(html.includes("<td>0</td>"));
});

test("forum renders backend text, author identity, media and engagement counts", () => {
  const html = render("LeagueRecords", {
    tab: "forum",
    data: {
      posts: [
        {
          id: 10,
          full_name: "Test Fan",
          username: "fan",
          text: "Real post content",
          likes: 3,
          comments_count: 2,
          shares: 1,
          images: ["https://example.test/photo.png"],
          videos: ["javascript:bad()"],
        },
      ],
    },
  });
  assert(html.includes("Real post content"));
  assert(html.includes("@fan"));
  assert(html.includes("3 likes"));
  assert(html.includes("2 comments"));
  assert(html.includes("1 shares"));
  assert(html.includes("photo.png"));
  assert(!html.includes("javascript:"));
});


test("forum previews shorten long text and link to full posts and comments", () => {
  const text = "Long post ".repeat(80) + "last sentence";
  const posts = [{id: 42, text, bookmarks: 4}];
  const preview = render("ForumPosts", {posts});
  assert(!preview.includes("last sentence"));
  assert(preview.includes("Read more"));
  assert(preview.includes('href="/post/?id=42#comments"'));
  assert(preview.includes("4 bookmarks"));
  assert.equal((preview.match(/<svg/g) || []).length, 4);
  const full = render("ForumPosts", {posts, fullText: true});
  assert(full.includes("last sentence"));
  assert(!full.includes("Read more"));
});
test("post comments show full text and nested replies without post engagement links", () => {
  const html = render("CommentsList", {comments: [{id: 1, text: "Comment body", replies: [{id: 2, text: "Reply body"}]}]});
  assert(html.includes("Comment body"));
  assert(html.includes("Reply body"));
  assert(html.includes("forum-replies"));
  assert(!html.includes("#comments"));
  assert(render("CommentsList").includes("No comments yet"));
});
test("college standings include a rankings section alongside conference tables", () => {
  const html = render("LeagueStandings", {league: "cfb", data: {conferences: []}});
  assert(html.includes('aria-label="College standings and polls"'));
  const pro = render("LeagueStandings", {league: "nfl", data: {conferences: []}});
  assert(!pro.includes('aria-label="College standings and polls"'));
});


test("college polls are accessed through standings instead of a separate tab", () => {
  for (const league of ["cfb", "mcbb", "wcbb", "mcvb", "wcvb"]) {
    assert(!leagueTabs(league).includes("rankings"), league);
    assert.equal(leagueResource(league, "rankings", {season: 2026}), null);
  }
});
test("college rankings render multiple polls with ranked teams and points", () => {
  const html = render("LeagueRecords", {league: "cfb", tab: "rankings", data: {rankings: [
    {name: "AP Top 25", ranks: [{current: 1, team: {id: 57, name: "Florida Gators"}, recordSummary: "8-0", points: 1500}]},
    {name: "Coaches Poll", ranks: [{current: 2, team: {id: 57, name: "Florida Gators"}, recordSummary: "8-0", points: 1400}]},
  ]}});
  assert(html.includes("AP Top 25"));
  assert(html.includes("Coaches Poll"));
  assert(html.includes("Florida Gators"));
  assert(html.includes("1500"));
  assert(html.includes("1400"));
});


test("college standings call conference endpoints without a separate rankings tab", () => {
  for (const league of ["cfb", "mcbb", "wcbb"]) {
    assert.equal(leagueResource(league, "standings", {season: 2026}), `/api/standings/${league}/conference?season=2026&seasontype=2`);
  }
  for (const league of ["cfb", "mcbb", "wcbb", "mcvb", "wcvb"]) {
    const tabs = leagueTabs(league);
    assert(!tabs.includes("rankings"));
  }
});
test("college conference standings render division teams and conference records", () => {
  const html = render("LeagueStandings", {league: "cfb", showRankings: false, data: {conferences: [{name: "SEC", divisions: [{name: "Overall", teams: [{id: 57, name: "Florida Gators", rank: 1, confOverall: "4-0", overall: "7-1", homeOverall: "4-0", awayOverall: "3-1", streak: "W5"}]}]}]}});
  for (const value of ["SEC", "Florida Gators", "4-0", "7-1", "3-1", "W5"]) assert(html.includes(value));
  assert(!html.includes("No standings available"));
});

test("team profiles can render conference standings without rankings", () => {
  const html = render("LeagueStandings", {league: "cfb", showRankings: false, data: {conferences: [{name: "SEC", divisions: [{name: "Overall", teams: [{id: 57, name: "Florida", overall: "7-1"}]}]}]}});
  assert(html.includes("SEC"));
  assert(html.includes("Florida"));
  assert(!html.includes('aria-label="College standings and polls"'));
});

test("standings dropdown defaults to AP and displays only the selected poll", () => {
  const html = render("StandingsFilter", {league: "cfb", data: {conferences: [{name: "SEC", divisions: []}]}, rankings: {rankings: [
    {type: "coaches", name: "Coaches Poll", ranks: [{current: 1, team: {id: 2, name: "Coaches leader"}}]},
    {type: "ap", name: "AP Top 25", ranks: [{current: 1, team: {id: 57, name: "AP leader"}}]},
  ]}});
  assert(html.includes('<option value="poll:1" selected="">AP Top 25</option>'));
  assert(html.includes('<option value="conference:0">SEC</option>'));
  assert(html.includes("AP leader"));
  assert(!html.includes("Coaches leader"));
});


test("forum polls render choices, selected results, and closed status", () => {
 const html = render("ForumPosts", { posts: [{ id: 55, poll: {
   question: "Who wins?", expires_at: "2020-01-01T00:00:00Z", options: [
     { id: 1, text: "Florida", vote_count: 3, voted_by_current_user: true },
     { id: 2, text: "Houston", vote_count: 1, voted_by_current_user: false },
   ],
 } }] });
 assert(html.includes("Who wins?"));
 assert(html.includes("Florida"));
 assert(html.includes("Houston"));
 assert(html.includes("75%"));
 assert(html.includes("25%"));
 assert(html.includes('aria-pressed="true"'));
 assert(html.includes("Closed"));
 assert(html.includes("votes"));
});

test("open polls show choices and a sign-in link without revealing percentages", () => {
 const html = render("ForumPosts", { posts: [{ id: 56, poll: {
   question: "Pick one", options: [{ id: 1, text: "Option A", vote_count: 2 }],
 } }] });
 assert(html.includes("Option A"));
 assert(html.includes("Sign in to vote"));
 assert(!html.includes("100%"));
});

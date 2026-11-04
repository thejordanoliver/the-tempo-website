import assert from "node:assert/strict";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import test from "node:test";
import { build } from "esbuild";
import {
  createWidget,
  defaultWidgets,
  orderWidgets,
  readSettings,
  resultHref,
  resultKey,
  WIDGETS,
} from "../src/data/explore/explore.js";
import { hookHarness, flush } from "./helpers/hookHarness.mjs";

test("Explore creates all six app widget types with compatible settings and order", () => {
  const widgets = defaultWidgets();
  assert.equal(widgets.length, 6);
  assert.deepEqual(
    widgets.map((w) => w.order),
    [0, 1, 2, 3, 4, 5],
  );
  assert.equal(new Set(widgets.map((w) => w.id)).size, 6);
  for (const widget of widgets) {
    assert(Object.hasOwn(WIDGETS, widget.type));
    assert(Number.isSafeInteger(widget.createdAt));
  }
  assert.equal(widgets.find((w) => w.type === "create_post").size, "small");
  assert.equal(
    widgets.find((w) => w.type === "college_polls").collegePollAutoPlay,
    true,
  );
  assert.equal(
    widgets.find((w) => w.type === "favorite_games").favoriteGameLeagues.length,
    12,
  );
  assert.throws(() => createWidget("__proto__"));
});
test("account layouts retain app-only options and revisions, including an intentionally empty board", () => {
  const widget = {
    ...createWidget("favorite_teams"),
    favoriteTeamsAutoPlay: false,
  };
  const saved = readSettings({
    settings: { schemaVersion: 2, widgets: [widget], revision: 4 },
  });
  assert.equal(saved.revision, 4);
  assert.equal(saved.widgets[0].favoriteTeamsAutoPlay, false);
  assert.deepEqual(
    readSettings({ settings: { schemaVersion: 2, widgets: [], revision: 1 } })
      .widgets,
    [],
  );
  assert.equal(readSettings({ settings: null }).revision, 0);
  assert.throws(() =>
    readSettings({ settings: { schemaVersion: 99, widgets: [], revision: 1 } }),
  );
  assert.equal(orderWidgets([{ ...widget, order: 9 }])[0].order, 0);
});
test("search results link to supported website profiles and reject invalid identifiers", () => {
  assert.equal(
    resultHref({ type: "player", affiliation: "nba", id: 3945274 }),
    "/player/?league=nba&id=3945274",
  );
  assert.equal(
    resultHref({ type: "player", affiliation: "mma", id: 3 }),
    "/fighter/?league=ufc&id=3",
  );
  assert.equal(
    resultHref({ type: "team", affiliation: "nfl", id: 1 }),
    "/team/?league=nfl&id=1",
  );
  assert.equal(resultHref({ type: "user", id: 4 }), "/user/?id=4");
  assert.equal(
    resultHref({ type: "team", affiliation: "nba", id: "../x" }),
    null,
  );
  assert.notEqual(
    resultKey({ type: "player", affiliation: "nba", id: 1 }),
    resultKey({ type: "team", affiliation: "nba", id: 1 }),
  );
});
test("board waits for account hydration, saves with revision and prevents overlapping writes", async () => {
  const h = await hookHarness("src/hooks/useExploreBoard.js");
  try {
    h.start("default", [12]);
    assert.equal(h.state.ready, false);
    assert.equal(h.requests[0].options.headers["X-Tempo-User-Id"], "12");
    h.requests[0].resolve({ settings: null });
    await flush();
    assert.equal(h.state.ready, true);
    const widgets = [createWidget("standings")];
    const pending = h.state.save(widgets);
    h.state.save([]);
    await flush();
    assert.equal(h.requests.length, 2);
    const body = JSON.parse(h.requests[1].options.body);
    assert.equal(body.revision, 0);
    assert.equal(body.schemaVersion, 2);
    h.requests[1].resolve({
      settings: {
        schemaVersion: 2,
        widgets: orderWidgets(widgets),
        revision: 1,
      },
    });
    await pending;
    await flush();
    assert.equal(h.state.revision, 1);
  } finally {
    h.stop();
  }
});
test("settings conflicts keep edits and block overwriting another device", async () => {
  const h = await hookHarness("src/hooks/useExploreBoard.js");
  try {
    h.start("default", [1]);
    h.requests[0].resolve({ settings: null });
    await flush();
    const pending = h.state.save([]);
    h.requests[1].reject(Object.assign(new Error("conflict"), { status: 409 }));
    await pending;
    await flush();
    assert.equal(h.state.conflict, true);
    assert.deepEqual(Array.from(h.state.widgets), []);
    await h.state.save(defaultWidgets());
    assert.equal(h.requests.length, 2);
  } finally {
    h.stop();
  }
});

await mkdir(".preview/tests", { recursive: true });
const bundle = await build({
  stdin: {
    contents: `import React from 'react';import {renderToStaticMarkup} from 'react-dom/server';import Explore from './src/pages/Explore.jsx';import User from './src/pages/User.jsx';export const render=(name,props)=>renderToStaticMarkup(React.createElement({Explore,User}[name],props));`,
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
  ".preview/tests/explore-render.mjs",
  bundle.outputFiles[0].contents,
);
const { render } = await import("../.preview/tests/explore-render.mjs");
test("guest Explore renders accessible search without widgets or account details", () => {
  const html = render("Explore", {});
  for (const text of [
    "Explore",
    "Search players, teams and fans",
    "Browse leagues",
  ])
    assert(html.includes(text));
  for (const text of ["Your Explore board", "Add widget", "Edit board"])
    assert(!html.includes(text));
  assert(!html.includes("Your email"));
  assert(render("User", { search: "?id=bad" }).includes("Fan not found"));
});
test("static build declares Explore and fan-profile routes", async () => {
  const source = await readFile("scripts/build.mjs", "utf8");
  assert(source.includes('"explore"'));
  assert(source.includes('"user"'));
});

test("search cancels stale queries, respects the backend length limit and returns the latest response", async () => {
  const h = await hookHarness("src/hooks/useExploreSearch.js");
  try {
    h.start("default", ["Lu", "all", null]);
    await new Promise((resolve) => setTimeout(resolve, 430));
    assert.equal(h.requests.length, 1);
    h.update(["Luka Doncic", "players", null]);
    assert(h.requests[0].options.signal.aborted);
    h.requests[0].resolve({ results: [{ id: 1, type: "player" }] });
    await flush();
    assert.equal(h.state.results.length, 0);
    await new Promise((resolve) => setTimeout(resolve, 430));
    assert.equal(h.requests.length, 2);
    assert(h.requests[1].path.includes("scope=players"));
    h.requests[1].resolve({
      results: [{ id: 3945274, type: "player", affiliation: "nba" }],
    });
    await flush();
    assert.equal(h.state.results[0].id, 3945274);
    h.update(["x".repeat(81), "all", null]);
    assert.match(h.state.error, /80 characters/);
    assert.equal(h.state.loading, false);
  } finally {
    h.stop();
  }
});

import assert from "node:assert/strict";
import test from "node:test";

import { hookHarness, flush } from "./helpers/hookHarness.mjs";

const selection = (id) => ({
  kind: "game",
  payload: { sport: "basketball", league: "nba", gameId: id },
});

test("game snapshots supersede older HTTP responses and route changes discard queued updates", async () => {
  const h = await hookHarness("src/hooks/useResource.js");
  try {
    h.start("useResource", [
      "/api/basketball/details?gameId=1",
      0,
      selection("1"),
    ]);
    const first = h.subscriptions[0];
    first.onUpdate({ score: { id: "1", home: { score: 100 } } });
    await flush();
    h.requests[0].resolve({ score: { id: "1", home: { score: 90 } } });
    await flush();
    assert.equal(h.state.data.score.home.score, 100);
    assert.equal(h.state.loading, false);
    assert.equal(
      "key" in h.state,
      false,
      "internal keys must not leak into React prop spreads",
    );
    h.update(["/api/basketball/details?gameId=2", 0, selection("2")]);
    assert.equal(first.active, false);
    first.onUpdate({ score: { id: "old" } });
    h.requests[1].resolve({ score: { id: "2" } });
    await flush();
    assert.equal(h.state.data.score.id, "2");
    h.subscriptions.at(-1).onUpdate({ score: { id: "2", home: { score: 7 } } });
    await flush();
    assert.equal(h.state.data.score.home.score, 7);
  } finally {
    h.stop();
  }
  assert(h.subscriptions.every(({ active }) => !active));
});

test("returning to a prior game revalidates rather than retaining an old live-response marker", async () => {
  const h = await hookHarness("src/hooks/useResource.js");
  try {
    h.start("useResource", ["/api/game/1", 0, selection("1")]);
    h.subscriptions[0].onUpdate({ value: "old live" });
    await flush();
    h.update(["/api/game/2", 0, selection("2")]);
    h.update(["/api/game/1", 0, selection("1")]);
    h.requests.at(-1).resolve({ value: "fresh REST" });
    await flush();
    assert.equal(h.state.data.value, "fresh REST");
  } finally {
    h.stop();
  }
});

test("Home subscribes once per league, merges live snapshots during loading and replaces date subscriptions", async () => {
  const h = await hookHarness("src/hooks/useHomeScores.js");
  try {
    h.start("default", [[], [], "2026-11-03", 0, true]);
    assert.equal(h.requests.length, 32);
    assert.equal(h.subscriptions.length, 32);
    const nba = h.subscriptions.find(({ payload }) => payload.league === "nba");
    nba.onUpdate(
      { games: [{ id: "live", home: { score: 100 } }] },
      { league: "nba" },
    );
    h.requests.forEach((request) =>
      request.resolve({ games: [{ id: "REST", home: { score: 90 } }] }),
    );
    await flush();
    const current = h.state.items.filter(({ league }) => league === "nba");
    assert.equal(current.length, 1);
    assert.equal(current[0].game.id, "live");
    assert.equal(h.state.loading, false);
    h.update([[], [], "2026-11-04", 0, true]);
    assert(h.subscriptions.slice(0, 32).every(({ active }) => !active));
    assert(
      h.subscriptions
        .slice(32)
        .every(({ payload }) => payload.date === "20261104"),
    );
    nba.onUpdate({ games: [{ id: "stale" }] }, { league: "nba" });
    h.requests.slice(32).forEach((request) => request.resolve({ games: [] }));
    await flush();
    assert.equal(h.state.items.length, 0);
  } finally {
    h.stop();
  }
});

test("disabled scoreboards do not fetch or subscribe, and failed HTTP requests keep retry errors", async () => {
  const h = await hookHarness("src/hooks/useHomeScores.js");
  try {
    h.start("default", [[], [], "2026-11-03", 0, false]);
    assert.equal(h.requests.length, 0);
    assert.equal(h.subscriptions.length, 0);
    h.update([[], [], "2026-11-03", 0, true]);
    h.requests.forEach((request) => request.reject(new Error("offline")));
    await flush();
    assert.equal(h.state.loading, false);
    assert.match(h.state.error, /Some scores/);
  } finally {
    h.stop();
  }
});

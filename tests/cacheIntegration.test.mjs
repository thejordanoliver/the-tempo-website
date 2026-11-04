import assert from "node:assert/strict";
import test from "node:test";
import { createSessionStore } from "../src/services/session.js";
import { hookHarness, flush, deferred } from "./helpers/hookHarness.mjs";

const response = (status, data) => ({
  status,
  ok: status >= 200 && status < 300,
  json: async () => data,
  clone() {
    return this;
  },
});
const user = (id) => ({
  user: { id },
  accessToken: `access-${id}`,
  refreshToken: `refresh-${id}`,
});

test("API caching shares reads across features, refresh and no-store bypass data, and writes invalidate", async () => {
  let reads = 0;
  const store = createSessionStore({
    fetcher: async (url, options) =>
      response(200, { version: options.method ? "write" : ++reads }),
  });
  const path = "/api/teams/nba/1";
  const [one, two] = await Promise.all([
    store.request(path),
    store.request(path),
  ]);
  assert.equal(reads, 1);
  assert.equal(one.version, two.version);
  await store.request(path);
  assert.equal(reads, 1);
  assert.equal(store.peek(path).data.version, 1);
  assert.equal((await store.request(path, { cache: "reload" })).version, 2);
  assert.equal((await store.request(path, { cache: "no-store" })).version, 3);
  assert.equal(store.peek(path).data.version, 2);
  await store.request("/api/forum/posts", { method: "POST", body: "{}" });
  assert.equal(store.peek(path), null);
  assert.equal((await store.request(path)).version, 4);
});

test("failed writes invalidate and widget revisions plus every refresh=1 read bypass the cache", async () => {
  let reads = 0;
  const store = createSessionStore({
    fetcher: async (_url, options) =>
      options.method
        ? response(409, { error: "Conflict" })
        : response(200, { version: ++reads }),
  });
  await store.request("/api/users/me/favorites");
  await assert.rejects(
    store.request("/api/widgets/explore/settings", {
      method: "PUT",
      body: "{}",
    }),
    /Conflict/,
  );
  assert.equal(store.peek("/api/users/me/favorites"), null);
  for (const path of [
    "/api/widgets/explore/settings",
    "/api/widgets/explore?refresh=1",
  ]) {
    const a = await store.request(path),
      b = await store.request(path);
    assert.notEqual(a.version, b.version);
    assert.equal(store.peek(path), null);
  }
});

test("account changes clear private data and cancel late old-account reads", async () => {
  const pending = deferred();
  let delayed = false;
  const store = createSessionStore({
    fetcher: async (_url, options) =>
      delayed
        ? pending.promise
        : response(200, { account: options.headers.Authorization }),
  });
  store.set(user(1));
  await store.request("/api/users/me");
  assert.match(store.peek("/api/users/me").data.account, /access-1/);
  delayed = true;
  const old = store.request("/api/users/me/favorites");
  const rejected = assert.rejects(old, { name: "AbortError" });
  await flush();
  store.set(user(2));
  await rejected;
  assert.equal(store.peek("/api/users/me"), null);
  pending.resolve(response(200, { account: "old" }));
  await flush();
  assert.equal(store.peek("/api/users/me/favorites"), null);
  delayed = false;
  assert.match((await store.request("/api/users/me")).account, /access-2/);
  store.clear();
  assert.equal(store.peek("/api/users/me"), null);
});

test("token refresh and local profile hydration preserve unrelated cached sports data", async () => {
  let refreshed = false,
    teams = 0;
  const store = createSessionStore({
    fetcher: async (url) => {
      if (url.endsWith("/api/refresh")) {
        refreshed = true;
        return response(200, {
          accessToken: "rotated",
          refreshToken: "rotated",
        });
      }
      if (url.endsWith("/api/teams/nba/1"))
        return response(200, { team: { id: ++teams } });
      return refreshed ? response(200, { id: 1 }) : response(401, {});
    },
  });
  store.set(user(1));
  const scope = store.getCacheScope();
  await store.request("/api/teams/nba/1");
  await store.request("/api/users/me");
  store.setUser({ id: 1, username: "updated" });
  assert.equal(store.getCacheScope(), scope);
  assert.equal(store.peek("/api/teams/nba/1").data.team.id, 1);
  await store.request("/api/teams/nba/1");
  assert.equal(teams, 1);
});

test("live snapshots populate shared cache and win over a late REST cache fill", async () => {
  const pending = deferred();
  const store = createSessionStore({ fetcher: () => pending.promise });
  const path = "/api/basketball/details?league=nba&gameId=1";
  const old = store.request(path);
  await flush();
  store.cacheResponse(path, { score: { id: 1, home: { score: 100 } } });
  pending.resolve(response(200, { score: { id: 1, home: { score: 90 } } }));
  await old;
  assert.equal(store.peek(path).data.score.home.score, 100);
  assert.equal((await store.request(path)).score.home.score, 100);
});

test("resource hooks hydrate cached navigation without a loading flash and explicit retries bypass it", async () => {
  const h = await hookHarness("src/hooks/useResource.js");
  try {
    h.session.cacheResponse("/api/news/all", { articles: [{ id: "cached" }] });
    h.start("useResource", ["/api/news/all", 0]);
    assert.equal(h.state.loading, false);
    assert.equal(h.state.data.articles[0].id, "cached");
    h.requests[0].reject(new Error("Offline"));
    await flush();
    assert.equal(h.state.error, null);
    assert.equal(h.state.data.articles[0].id, "cached");
    h.update(["/api/news/all", 1]);
    assert.equal(h.requests[1].options.cache, "reload");
    assert.equal(h.state.loading, true);
    h.requests[1].resolve({ articles: [{ id: "fresh" }] });
    await flush();
    assert.equal(h.state.data.articles[0].id, "fresh");
  } finally {
    h.stop();
  }
});

test("mounted resource data is cleared when its session scope changes", async () => {
  const h = await hookHarness("src/hooks/useResource.js");
  try {
    h.start("useResource", ["/api/users/me", 0]);
    h.requests[0].resolve({ id: 1 });
    await flush();
    assert.equal(h.state.data.id, 1);
    h.session.setScope(2);
    await flush();
    assert.equal(h.state.data, null);
    assert.equal(h.state.loading, true);
    assert.equal(h.requests.length, 2);
    h.requests[1].resolve({ id: 2 });
    await flush();
    assert.equal(h.state.data.id, 2);
  } finally {
    h.stop();
  }
});

test("resolved team identities stay usable during an offline background refresh", async () => {
  const h = await hookHarness("src/hooks/usePlayerTeams.js");
  try {
    h.session.cacheResponse("/api/teams/nba/1", {
      team: { id: 1, code: "ATL", logo: "atl.png" },
    });
    h.start("default", ["nba", [1]]);
    assert.equal(h.state.loading, false);
    assert.equal(h.state.teams[1].code, "ATL");
    h.requests[0].reject(new Error("Offline"));
    await flush();
    assert.equal(h.state.error, null);
    assert.equal(h.state.teams[1].logo, "atl.png");
  } finally {
    h.stop();
  }
});

test("a remembered same-account token rotation preserves cached data in other tabs", async () => {
  const values = new Map();
  const storage = {
    getItem: (key) => values.get(key) || null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
  const initial = user(1);
  storage.setItem("tempo.web.session.v1", JSON.stringify(initial));
  const store = createSessionStore({
    persistentStorage: storage,
    fetcher: async () => response(200, { team: { id: 1 } }),
  });
  await store.request("/api/teams/nba/1");
  const scope = store.getCacheScope();
  storage.setItem(
    "tempo.web.session.v1",
    JSON.stringify({
      ...initial,
      accessToken: "rotated",
      refreshToken: "rotated",
    }),
  );
  store.syncPersistent();
  assert.equal(store.getCacheScope(), scope);
  assert.equal(store.peek("/api/teams/nba/1").data.team.id, 1);
  storage.setItem("tempo.web.session.v1", JSON.stringify(user(2)));
  store.syncPersistent();
  assert.notEqual(store.getCacheScope(), scope);
  assert.equal(store.peek("/api/teams/nba/1"), null);
});

test("fresh cached search results do not disappear when the debounce period passes", async () => {
  const h = await hookHarness("src/hooks/useExploreSearch.js");
  try {
    h.session.cacheResponse(
      "/api/explore/search?query=lebron&scope=all&limit=5",
      { results: [{ type: "player", id: 1966, name: "LeBron James" }] },
    );
    h.start("default", ["lebron", "all", null, 5]);
    await flush();
    assert.equal(h.state.results[0].id, 1966);
    assert.equal(h.state.loading, false);
    await new Promise((resolve) => setTimeout(resolve, 420));
    assert.equal(h.requests.length, 0);
    assert.equal(h.state.results[0].id, 1966);
    assert.equal(h.state.loading, false);
  } finally {
    h.stop();
  }
});

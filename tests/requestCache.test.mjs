import assert from "node:assert/strict";
import test from "node:test";

import {
  createRequestCache,
  requestCacheKey,
  requestCachePolicy,
} from "../src/services/requestCache.js";

const policy = { freshFor: 100, staleFor: 300 };
const flush = () => new Promise((resolve) => setTimeout(resolve, 0));
function deferred() {
  let resolve, reject;
  const promise = new Promise((yes, no) => {
    resolve = yes;
    reject = no;
  });
  return { promise, resolve, reject };
}

// The test loaders deliberately allow late success after cancellation so cache
// generation guards are checked independently of fetch's abort behavior.
test("identical concurrent GETs share one loader and populate the cache", async () => {
  const cache = createRequestCache();
  const pending = deferred();
  let calls = 0;
  const loader = () => {
    calls++;
    return pending.promise;
  };
  const first = cache.request("team", loader, { policy });
  const second = cache.request("team", loader, { policy });
  await flush();
  assert.equal(calls, 1);
  const data = { team: { id: 1, code: "ATL" } };
  pending.resolve(data);
  assert.deepEqual(await first, data);
  assert.deepEqual(await second, data);
  assert.deepEqual(cache.peek("team"), { data, fresh: true });
  assert.deepEqual(
    await cache.request(
      "team",
      () => {
        throw new Error("fresh cache should be reused");
      },
      { policy },
    ),
    data,
  );
});

test("one cancelled consumer does not abort another consumer's request", async () => {
  const cache = createRequestCache();
  const pending = deferred();
  const one = new AbortController(),
    two = new AbortController();
  let transportSignal;
  const loader = (signal) => {
    transportSignal = signal;
    return pending.promise;
  };
  const first = cache.request("shared", loader, { policy, signal: one.signal });
  const second = cache.request("shared", loader, {
    policy,
    signal: two.signal,
  });
  const cancelled = assert.rejects(first, { name: "AbortError" });
  await flush();
  one.abort();
  await cancelled;
  assert.equal(transportSignal.aborted, false);
  pending.resolve({ value: "remaining consumer" });
  assert.equal((await second).value, "remaining consumer");
  assert.equal(cache.peek("shared").data.value, "remaining consumer");
});

test("the last consumer aborts transport and a later request starts a new flight", async () => {
  const cache = createRequestCache();
  const pending = deferred();
  const controller = new AbortController();
  let transportSignal;
  const first = cache.request(
    "last",
    (signal) => {
      transportSignal = signal;
      return pending.promise;
    },
    { policy, signal: controller.signal },
  );
  const cancelled = assert.rejects(first, { name: "AbortError" });
  await flush();
  controller.abort();
  await cancelled;
  assert.equal(transportSignal.aborted, true);
  assert.equal(
    await cache.request("last", async () => "new", { policy }),
    "new",
  );
  pending.resolve("old transport ignored cancellation");
  await flush();
  assert.equal(cache.peek("last").data, "new");
});

test("an already-aborted subscriber never starts a network request", async () => {
  const cache = createRequestCache();
  const controller = new AbortController();
  controller.abort();
  let calls = 0;
  await assert.rejects(
    cache.request(
      "aborted",
      async () => {
        calls++;
        return "unexpected";
      },
      { policy, signal: controller.signal },
    ),
    { name: "AbortError" },
  );
  assert.equal(calls, 0);
  assert.equal(cache.peek("aborted"), null);
});

test("forced refresh bypasses fresh data and cannot be overwritten by an older flight", async () => {
  const cache = createRequestCache();
  const old = deferred(),
    fresh = deferred();
  const first = cache.request("refresh", () => old.promise, { policy });
  await flush();
  const second = cache.request("refresh", () => fresh.promise, {
    policy,
    force: true,
  });
  await flush();
  fresh.resolve("fresh");
  assert.equal(await second, "fresh");
  old.resolve("old");
  await Promise.allSettled([first]);
  assert.equal(cache.peek("refresh").data, "fresh");
  assert.equal(
    await cache.request("refresh", async () => "manual refresh", {
      policy,
      force: true,
    }),
    "manual refresh",
  );
  assert.equal(cache.peek("refresh").data, "manual refresh");
});

test("a websocket cache write wins over an older HTTP response", async () => {
  const cache = createRequestCache();
  const pending = deferred();
  const request = cache.request("game", () => pending.promise, { policy });
  await flush();
  cache.set("game", { score: 105 }, policy);
  pending.resolve({ score: 99 });
  await Promise.allSettled([request]);
  assert.deepEqual(cache.peek("game"), { data: { score: 105 }, fresh: true });
});

test("freshness expires independently of stale retention and stale data is not a fresh hit", async () => {
  let time = 1000;
  const cache = createRequestCache({ now: () => time });
  cache.set("news", "cached", policy);
  time += 99;
  assert.deepEqual(cache.peek("news"), { data: "cached", fresh: true });
  time += 2;
  assert.equal(cache.peek("news"), null);
  assert.deepEqual(cache.peek("news", { allowStale: true }), {
    data: "cached",
    fresh: false,
  });
  assert.equal(
    await cache.request("news", async () => "updated", { policy }),
    "updated",
  );
  time += 301;
  assert.equal(cache.peek("news", { allowStale: true }), null);
});

test("cache entry limits evict the least recently used response", () => {
  const cache = createRequestCache({ maxEntries: 2 });
  cache.set("a", 1, policy);
  cache.set("b", 2, policy);
  assert.equal(cache.peek("a").data, 1);
  cache.set("c", 3, policy);
  assert.equal(cache.size, 2);
  assert.equal(cache.peek("b"), null);
  assert.equal(cache.peek("a").data, 1);
  assert.equal(cache.peek("c").data, 3);
});

test("clear detaches old flights and late success cannot refill invalidated data", async () => {
  const cache = createRequestCache();
  const pending = deferred();
  cache.set("existing", "cached", policy);
  const old = cache.request("account", () => pending.promise, { policy });
  await flush();
  cache.clear();
  assert.equal(cache.size, 0);
  assert.equal(cache.peek("existing"), null);
  assert.equal(
    await cache.request("account", async () => "new account", { policy }),
    "new account",
  );
  pending.resolve("previous account");
  await Promise.allSettled([old]);
  assert.equal(cache.peek("account").data, "new account");
});

test("clear with cancellation aborts active transport and all subscribers", async () => {
  const cache = createRequestCache();
  const pending = deferred();
  let transportSignal;
  const loader = (signal) => {
    transportSignal = signal;
    return pending.promise;
  };
  const first = cache.request("account", loader, { policy });
  const second = cache.request("account", loader, { policy });
  const one = assert.rejects(first, { name: "AbortError" });
  const two = assert.rejects(second, { name: "AbortError" });
  await flush();
  cache.clear({ cancel: true });
  assert.equal(transportSignal.aborted, true);
  await Promise.all([one, two]);
  pending.resolve("late private response");
  await flush();
  assert.equal(cache.peek("account", { allowStale: true }), null);
});

test("errors are not cached and a later call retries the loader", async () => {
  const cache = createRequestCache();
  await assert.rejects(
    cache.request(
      "retry",
      async () => {
        throw new Error("offline");
      },
      { policy },
    ),
    /offline/,
  );
  assert.equal(cache.peek("retry", { allowStale: true }), null);
  assert.equal(
    await cache.request("retry", async () => "recovered", { policy }),
    "recovered",
  );
});

test("cache policies retain identities longer than live scores and bypass revision settings", () => {
  const team = requestCachePolicy("/api/teams/nba/1");
  const scores = requestCachePolicy("/api/games/basketball/nba?date=20261104");
  const stats = requestCachePolicy("/api/player/stats/nba/1966");
  assert(team.freshFor >= 60_000);
  assert(scores.freshFor >= 0 && scores.freshFor <= 15_000);
  assert(team.freshFor > scores.freshFor);
  assert(stats.freshFor > scores.freshFor);
  for (const item of [team, scores, stats])
    assert(item.staleFor >= item.freshFor);
  assert.equal(
    requestCachePolicy("/api/widgets/explore/settings")?.freshFor || 0,
    0,
  );
  assert.equal(
    requestCachePolicy("/api/widgets/explore?refresh=1")?.freshFor || 0,
    0,
  );
});

test("request keys distinguish responses by headers while ignoring consumer cancellation", () => {
  const controller = new AbortController();
  const base = requestCacheKey("/api/teams/nba/1");
  assert.equal(
    base,
    requestCacheKey("/api/teams/nba/1", { signal: controller.signal }),
  );
  assert.notEqual(base, requestCacheKey("/api/teams/nba/2"));
  assert.notEqual(
    requestCacheKey("/api/widgets/explore/settings", {
      headers: { "X-Tempo-User-Id": "1" },
    }),
    requestCacheKey("/api/widgets/explore/settings", {
      headers: { "X-Tempo-User-Id": "2" },
    }),
  );
  assert.equal(
    requestCacheKey("/api/explore/search?query=team&scope=all", {
      headers: { Accept: "application/json" },
    }),
    requestCacheKey("/api/explore/search?scope=all&query=team", {
      headers: { accept: "application/json" },
    }),
  );
});

test("every league and team tab has an intentional cache policy", async () => {
  const { leagueSports, leagueTabs, leagueResource } = await import(
    "../src/data/leagues/leagues.js"
  );
  const { hasTeamLeague, teamTabs, teamResource } = await import(
    "../src/data/teams/teams.js"
  );
  for (const league of Object.keys(leagueSports)) {
    for (const tab of leagueTabs(league)) {
      const path = leagueResource(league, tab, {
        season: 2026,
        date: "2026-11-04",
        week: 1,
      });
      if (path)
        assert(
          requestCachePolicy(path),
          `Missing policy for ${league} ${tab}: ${path}`,
        );
    }
    if (hasTeamLeague(league))
      for (const tab of teamTabs(league)) {
        const path = teamResource(league, 1, tab, 2026);
        if (path)
          assert(
            requestCachePolicy(path),
            `Missing policy for ${league} team ${tab}: ${path}`,
          );
      }
  }
});

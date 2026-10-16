import { test } from "node:test";
import assert from "node:assert/strict";
import { createSessionStore } from "../src/session.js";
function storage() {
  const values = new Map();
  return {
    getItem: (k) => values.get(k) || null,
    setItem: (k, v) => values.set(k, v),
    removeItem: (k) => values.delete(k),
  };
}
const sample = {
  accessToken: "old-access",
  refreshToken: "old-refresh",
  user: { id: 1, username: "fan" },
};
function response(status, data = {}) {
  return {
    status,
    ok: status >= 200 && status < 300,
    json: async () => data,
    clone() {
      return this;
    },
  };
}
test("session restores across Support, reload and sign-out", () => {
  const db = storage(),
    one = createSessionStore({ storage: db });
  one.set(sample);
  const two = createSessionStore({ storage: db });
  assert.equal(two.getSnapshot().user.username, "fan");
  two.clear();
  assert.equal(createSessionStore({ storage: db }).getSnapshot(), null);
});
test("concurrent expired requests share a refresh and persist rotated tokens", async () => {
  let refreshes = 0;
  const db = storage(),
    store = createSessionStore({
      storage: db,
      fetcher: async (url, options) => {
        if (url.endsWith("/api/refresh")) {
          refreshes++;
          await new Promise((r) => setImmediate(r));
          return response(200, {
            accessToken: "new",
            refreshToken: "new-refresh",
          });
        }
        return options.headers.Authorization === "Bearer new"
          ? response(200, { ok: true })
          : response(401);
      },
    });
  store.set(sample);
  await Promise.all([
    store.request("/api/users/me"),
    store.request("/api/feed/for-you"),
  ]);
  assert.equal(refreshes, 1);
  assert.equal(
    createSessionStore({ storage: db }).getSnapshot().refreshToken,
    "new-refresh",
  );
});
test("backend expired-token 403 refreshes instead of signing out", async () => {
  let refreshed = false;
  const store = createSessionStore({
    fetcher: async (url) => {
      if (url.endsWith("/api/refresh")) {
        refreshed = true;
        return response(200, {
          accessToken: "new",
          refreshToken: "new-refresh",
        });
      }
      return refreshed
        ? response(200, { id: 1 })
        : response(403, { code: "ACCESS_TOKEN_INVALID" });
    },
  });
  store.set(sample);
  assert.equal((await store.request("/api/users/me")).id, 1);
  assert.equal(store.getSnapshot().accessToken, "new");
});
test("failed refresh clears the saved session", async () => {
  const db = storage(),
    store = createSessionStore({
      storage: db,
      fetcher: async () => response(401),
    });
  store.set(sample);
  await assert.rejects(store.request("/api/users/me"));
  assert.equal(createSessionStore({ storage: db }).getSnapshot(), null);
});
test("sign-out during refresh cannot resurrect credentials", async () => {
  let release, started;
  const ready = new Promise((r) => (started = r));
  const db = storage(),
    store = createSessionStore({
      storage: db,
      fetcher: async (url) => {
        if (url.endsWith("/api/refresh")) {
          started();
          await new Promise((r) => (release = r));
          return response(200, { accessToken: "new", refreshToken: "new" });
        }
        return response(401);
      },
    });
  store.set(sample);
  const request = store.request("/api/users/me");
  await ready;
  store.clear();
  release();
  await assert.rejects(request);
  assert.equal(createSessionStore({ storage: db }).getSnapshot(), null);
});
test("sign-in stores tokens but never the password; logout clears local state on network failure", async () => {
  const db = storage(),
    store = createSessionStore({
      storage: db,
      fetcher: async (url) => {
        if (url.endsWith("/api/login")) return response(200, sample);
        throw new Error("Offline");
      },
    });
  await store.login("fan", "private-password");
  assert(!db.getItem("tempo.web.session.v1").includes("private-password"));
  assert.equal(await store.logout(), false);
  assert.equal(store.getSnapshot(), null);
});

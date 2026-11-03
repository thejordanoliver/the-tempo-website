import assert from "node:assert/strict";
import test from "node:test";

import { createSportsLiveClient } from "../src/services/liveSportsSocket.js";

function harness(hidden = false) {
  const handlers = new Map(),
    visibilityHandlers = new Set(),
    events = [];
  let options,
    url,
    clients = 0,
    token = "initial-token";
  const socket = {
    connected: false,
    on(name, listener) {
      handlers.set(name, listener);
    },
    emit(name, payload, ack) {
      events.push({ name, payload, ack });
      ack?.({
        ok: true,
        subscriptionKey: `${payload.league}:${payload.gameId ?? payload.date}`,
      });
    },
    connect() {
      if (this.connected) return;
      this.connected = true;
      handlers.get("connect")?.();
    },
    disconnect() {
      this.connected = false;
    },
  };
  const visibility = {
    visibilityState: hidden ? "hidden" : "visible",
    addEventListener(_, callback) {
      visibilityHandlers.add(callback);
    },
    removeEventListener(_, callback) {
      visibilityHandlers.delete(callback);
    },
  };
  const client = createSportsLiveClient({
    apiUrl: "https://backend.example/api",
    getSession: () => ({ accessToken: token }),
    visibility,
    createSocket(address, config) {
      url = address;
      options = config;
      clients++;
      return socket;
    },
  });
  return {
    client,
    socket,
    events,
    handlers,
    visibilityHandlers,
    get config() {
      return { url, options, clients };
    },
    setToken(value) {
      token = value;
    },
    visibility(state) {
      visibility.visibilityState = state;
      visibilityHandlers.forEach((fn) => fn());
    },
    update(subscriptionKey, payload, kind = "scoreboard") {
      handlers.get(`sports:${kind}:update`)({ subscriptionKey, payload });
    },
  };
}
const payload = { sport: "basketball", league: "nba", date: "20261103" };

test("scoreboards and game details share a connection, deduplicate and unsubscribe independently", () => {
  const h = harness(),
    received = [];
  const options = {
    kind: "scoreboard",
    payload,
    onUpdate: (data) => received.push(data),
  };
  const first = h.client.subscribe(options);
  const second = h.client.subscribe({
    ...options,
    payload: { date: payload.date, league: "nba", sport: "basketball" },
    onUpdate: () => received.push("second"),
  });
  const game = h.client.subscribe({
    kind: "game",
    payload: { sport: "basketball", league: "nba", gameId: "123" },
    onUpdate: (data) => received.push(data),
  });
  assert.equal(h.config.url, "https://backend.example/sports-live");
  assert.equal(h.config.clients, 1);
  assert.equal(
    h.events.filter(({ name }) => name.endsWith(":subscribe")).length,
    2,
  );
  h.update("nba:20261103", "score");
  h.update("nba:123", "details", "game");
  assert.deepEqual(received, ["score", "second", "details"]);
  first();
  assert.equal(
    h.events.filter(({ name }) => name.endsWith(":unsubscribe")).length,
    0,
  );
  second();
  assert(h.socket.connected);
  h.update("nba:20261103", "stale");
  assert.equal(received.length, 3);
  game();
  assert(!h.socket.connected);
  assert.equal(h.visibilityHandlers.size, 0);
  game();
  assert.equal(
    h.events.filter(({ name }) => name.endsWith(":unsubscribe")).length,
    2,
  );
});

test("hidden tabs pause and rejoin every active selection on return and reconnection", () => {
  const h = harness(true),
    updates = [];
  const stop = h.client.subscribe({
    kind: "scoreboard",
    payload,
    onUpdate: (data) => updates.push(data),
  });
  assert.equal(h.socket.connected, false);
  assert.equal(h.events.length, 0);
  h.visibility("visible");
  assert.equal(h.events.length, 1);
  h.visibility("hidden");
  h.update("nba:20261103", "hidden");
  assert.deepEqual(updates, []);
  assert(!h.socket.connected);
  h.visibility("visible");
  assert.equal(h.events.length, 2);
  h.socket.disconnect();
  h.socket.connect();
  assert.equal(h.events.length, 3);
  h.update("nba:20261103", "latest");
  assert.deepEqual(updates, ["latest"]);
  stop();
  h.visibility("visible");
  assert(!h.socket.connected);
});

test("reconnection reads rotated session tokens and late acknowledgements cannot revive removed subscriptions", () => {
  const h = harness();
  const stop = h.client.subscribe({
    kind: "scoreboard",
    payload,
    onUpdate() {
      assert.fail("removed listener");
    },
  });
  h.config.options.auth((auth) => assert.equal(auth.token, "initial-token"));
  h.setToken("rotated-token");
  h.config.options.auth((auth) => assert.equal(auth.token, "rotated-token"));
  const ack = h.events[0].ack;
  stop();
  ack({ ok: true, subscriptionKey: "stale" });
  h.update("stale", {});
  assert.equal(h.socket.connected, false);
});

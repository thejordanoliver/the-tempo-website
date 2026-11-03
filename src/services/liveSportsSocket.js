import { io } from "socket.io-client";

import { API_URL, sessionStore } from "./session.js";

const stableKey = (kind, payload) =>
  JSON.stringify([
    kind,
    Object.fromEntries(
      Object.entries(payload)
        .filter(([, value]) => value != null)
        .sort(([a], [b]) => a.localeCompare(b)),
    ),
  ]);

/** One connection shared by scoreboards and game screens. The backend sends normalized snapshots. */
export function createSportsLiveClient({
  apiUrl,
  createSocket = io,
  getSession = () => null,
  visibility = globalThis.document,
} = {}) {
  const records = new Map();
  let socket = null;
  let listening = false;
  const visible = () => !visibility || visibility.visibilityState !== "hidden";

  function join(record) {
    if (!socket?.connected || !visible()) return;
    socket.emit(
      `sports:${record.kind}:subscribe`,
      record.payload,
      (response) => {
        if (records.get(record.key) === record && response?.ok)
          record.serverKey = response.subscriptionKey;
      },
    );
  }
  function receive(envelope) {
    if (!visible()) return;
    for (const record of records.values()) {
      if (record.serverKey !== envelope?.subscriptionKey) continue;
      record.listeners.forEach((listener) =>
        listener(envelope.payload, envelope),
      );
    }
  }
  function visibilityChanged() {
    if (!socket) return;
    if (visible() && records.size) socket.connect();
    else socket.disconnect();
  }
  function ensureSocket() {
    if (!socket) {
      socket = createSocket(`${new URL(apiUrl).origin}/sports-live`, {
        autoConnect: false,
        transports: ["websocket", "polling"],
        reconnection: true,
        tryAllTransports: true,
        auth: (callback) => {
          const token = getSession()?.accessToken;
          callback(token ? { token } : {});
        },
      });
      socket.on("connect", () => records.forEach(join));
      socket.on("sports:scoreboard:update", receive);
      socket.on("sports:game:update", receive);
    }
    if (!listening) {
      visibility?.addEventListener("visibilitychange", visibilityChanged);
      listening = true;
    }
  }
  return {
    subscribe({ kind, payload, onUpdate }) {
      const key = stableKey(kind, payload);
      let record = records.get(key);
      if (!record) {
        record = { key, kind, payload, serverKey: null, listeners: new Set() };
        records.set(key, record);
        ensureSocket();
        if (socket.connected) join(record);
      }
      record.listeners.add(onUpdate);
      if (visible() && !socket.connected) socket.connect();
      let active = true;
      return () => {
        if (!active) return;
        active = false;
        record.listeners.delete(onUpdate);
        if (record.listeners.size) return;
        records.delete(key);
        if (socket.connected)
          socket.emit(`sports:${kind}:unsubscribe`, payload);
        if (!records.size) {
          socket.disconnect();
          visibility?.removeEventListener(
            "visibilitychange",
            visibilityChanged,
          );
          listening = false;
        }
      };
    },
  };
}

export const sportsLiveClient = createSportsLiveClient({
  apiUrl: API_URL,
  getSession: sessionStore.getSnapshot,
});

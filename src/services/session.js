import {
  createRequestCache,
  requestCacheKey,
  requestCachePolicy,
} from "./requestCache.js";

export const API_URL =
  typeof __TEMPO_API_URL__ !== "undefined"
    ? __TEMPO_API_URL__
    : "http://192.168.1.225:4000";
const KEY = "tempo.web.session.v1";
export function createSessionStore({
  storage,
  persistentStorage,
  fetcher = fetch,
  api = API_URL,
} = {}) {
  let value = null,
    revision = 0,
    refreshPromise = null,
    remembered = false;
  const cache = createRequestCache();
  const listeners = new Set();
  function changeSession() {
    revision++;
    cache.clear({ cancel: true });
  }
  for (const [candidate, persistent] of [
    [storage, false],
    [persistentStorage, true],
  ]) {
    try {
      const saved = JSON.parse(candidate?.getItem(KEY) || "null");
      if (
        saved?.user?.id != null &&
        typeof saved.accessToken === "string" &&
        typeof saved.refreshToken === "string"
      ) {
        value = saved;
        remembered = persistent;
        break;
      }
    } catch {}
  }
  function update(next) {
    value = next;
    const active = remembered ? persistentStorage : storage;
    const inactive = remembered ? storage : persistentStorage;
    try {
      inactive?.removeItem(KEY);
    } catch {}
    try {
      next
        ? active?.setItem(KEY, JSON.stringify(next))
        : active?.removeItem(KEY);
    } catch {}
    listeners.forEach((fn) => fn());
  }
  function clear() {
    changeSession();
    update(null);
  }
  async function invalid(response) {
    if (response.status === 401) return true;
    if (response.status !== 403) return false;
    const data = await response
      .clone()
      .json()
      .catch(() => ({}));
    return data.code === "ACCESS_TOKEN_INVALID";
  }
  async function requestNetwork(path, options = {}) {
    if (!path.startsWith("/api/")) throw new Error("Invalid API path");
    if (
      typeof location !== "undefined" &&
      location.protocol === "https:" &&
      api.startsWith("http:")
    )
      throw new Error(
        "This backend requires a local HTTP preview on the same network.",
      );
    const generation = revision;
    const { auth: _auth, cache: _cache, ...fetchOptions } = options;
    const send = () =>
      fetcher(api + path, {
        ...fetchOptions,
        headers: {
          ...(options.body ? { "Content-Type": "application/json" } : {}),
          ...options.headers,
          ...(value && options.auth !== false
            ? { Authorization: `Bearer ${value.accessToken}` }
            : {}),
        },
        credentials: "omit",
        cache: "no-store",
        signal: options.signal || AbortSignal.timeout(20000),
      });
    let response = await send();
    if (options.auth !== false && value && (await invalid(response))) {
      if (!refreshPromise) {
        const previous = value.refreshToken;
        refreshPromise = (async () => {
          const res = await fetcher(api + "/api/refresh", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken: previous }),
            signal: AbortSignal.timeout(15000),
            credentials: "omit",
            cache: "no-store",
          });
          if (generation !== revision) throw new Error("Session changed");
          if (!res.ok) {
            if (res.status === 401 || res.status === 403) clear();
            throw new Error("Session refresh failed. Try again.");
          }
          const data = await res.json();
          if (
            typeof data.accessToken !== "string" ||
            typeof data.refreshToken !== "string"
          )
            throw new Error("Invalid session response");
          if (generation === revision && value?.refreshToken === previous)
            update({
              ...value,
              accessToken: data.accessToken,
              refreshToken: data.refreshToken,
            });
        })();
        refreshPromise
          .finally(() => {
            refreshPromise = null;
          })
          .catch(() => {});
      }
      await refreshPromise;
      if (generation !== revision || !value)
        throw new Error("Session ended. Sign in again.");
      response = await send();
      if (await invalid(response)) clear();
    }
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(
        response.status === 404
          ? "Content not found."
          : response.status === 429
            ? "Too many requests. Try again shortly."
            : data.error || "Request failed. Try again.",
      );
      error.status = response.status;
      throw error;
    }
    if (generation !== revision) throw new Error("Session changed");
    return data;
  }
  const forceRefresh = (path, options) =>
    options.cache === "reload" ||
    new URL(path, "https://tempo.invalid").searchParams.get("refresh") === "1";
  async function request(path, options = {}) {
    if (!path.startsWith("/api/")) throw new Error("Invalid API path");
    const method = (options.method || "GET").toUpperCase();
    if (method !== "GET") {
      // Detach older reads both before and after a write, including uncertain failures.
      cache.clear();
      try {
        return await requestNetwork(path, options);
      } finally {
        cache.clear();
      }
    }
    const policy = requestCachePolicy(path);
    if (!policy || options.body || options.cache === "no-store")
      return requestNetwork(path, options);
    return cache.request(
      requestCacheKey(path, options),
      (signal) =>
        requestNetwork(path, {
          ...options,
          signal: AbortSignal.any([signal, AbortSignal.timeout(20000)]),
        }),
      { policy, signal: options.signal, force: forceRefresh(path, options) },
    );
  }
  return {
    getSnapshot: () => value,
    getCacheScope: () => revision,
    peek(path, options = {}) {
      if (
        !path ||
        options.body ||
        options.cache === "no-store" ||
        forceRefresh(path, options) ||
        !requestCachePolicy(path)
      )
        return null;
      return cache.peek(requestCacheKey(path, options), {
        allowStale: options.allowStale,
      });
    },
    cacheResponse(path, data, options = {}) {
      cache.set(requestCacheKey(path, options), data, requestCachePolicy(path));
    },
    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    clear,
    syncPersistent() {
      if (!remembered) return;
      let saved = null;
      try {
        saved = JSON.parse(persistentStorage?.getItem(KEY) || "null");
      } catch {}
      const next =
        saved?.user?.id != null &&
        typeof saved.accessToken === "string" &&
        typeof saved.refreshToken === "string"
          ? saved
          : null;
      if (!value || !next || String(value.user.id) !== String(next.user.id))
        changeSession();
      value = next;
      listeners.forEach((fn) => fn());
    },
    request,
    set(next) {
      changeSession();
      update(next);
    },
    setUser(user) {
      if (value) update({ ...value, user });
    },
    async login(username, password, rememberMe = false) {
      const data = await request("/api/login", {
        method: "POST",
        auth: false,
        body: JSON.stringify({ username, password }),
      });
      if (
        data.user?.id == null ||
        typeof data.accessToken !== "string" ||
        typeof data.refreshToken !== "string"
      )
        throw new Error("Sign-in failed. Try again.");
      changeSession();
      remembered = Boolean(rememberMe);
      update(data);
      return data;
    },
    async logout() {
      const token = value?.refreshToken;
      clear();
      if (token) {
        try {
          await request("/api/logout", {
            auth: false,
            method: "POST",
            body: JSON.stringify({ refreshToken: token }),
          });
          return true;
        } catch {
          return false;
        }
      }
      return true;
    },
  };
}
let storage, persistentStorage;
try {
  if (typeof window !== "undefined") storage = window.sessionStorage;
} catch {}
try {
  if (typeof window !== "undefined") persistentStorage = window.localStorage;
} catch {}
export const sessionStore = createSessionStore({ storage, persistentStorage });
if (typeof window !== "undefined")
  window.addEventListener("storage", (event) => {
    if (event.key === KEY || event.key === null) sessionStore.syncPersistent();
  });

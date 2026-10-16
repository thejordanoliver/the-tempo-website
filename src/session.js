export const API_URL =
  typeof __TEMPO_API_URL__ !== "undefined"
    ? __TEMPO_API_URL__
    : "http://192.168.1.225:4000";
const KEY = "tempo.web.session.v1";
export function createSessionStore({
  storage,
  fetcher = fetch,
  api = API_URL,
} = {}) {
  let value = null,
    revision = 0,
    refreshPromise = null;
  const listeners = new Set();
  try {
    const saved = JSON.parse(storage?.getItem(KEY) || "null");
    if (
      saved?.user?.id != null &&
      typeof saved.accessToken === "string" &&
      typeof saved.refreshToken === "string"
    )
      value = saved;
  } catch {}
  function update(next) {
    value = next;
    try {
      next
        ? storage?.setItem(KEY, JSON.stringify(next))
        : storage?.removeItem(KEY);
    } catch {}
    listeners.forEach((fn) => fn());
  }
  function clear() {
    revision++;
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
  async function request(path, options = {}) {
    if (!path.startsWith("/api/")) throw new Error("Invalid API path");
    if (
      typeof location !== "undefined" &&
      location.protocol === "https:" &&
      api.startsWith("http:")
    )
      throw new Error(
        "This website currently uses a local HTTP backend. Use a local HTTP preview on the same network to access account and sports data.",
      );
    const generation = revision;
    const send = () =>
      fetcher(api + path, {
        ...options,
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
            throw new Error(
              "Unable to refresh your session. Please try again.",
            );
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
        throw new Error("Your session ended. Please sign in.");
      response = await send();
      if (await invalid(response)) clear();
    }
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(
        response.status === 404
          ? "This content could not be found."
          : response.status === 429
            ? "Too many requests. Please try again shortly."
            : data.error || "The request failed. Please try again.",
      );
      error.status = response.status;
      throw error;
    }
    return data;
  }
  return {
    getSnapshot: () => value,
    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    clear,
    request,
    set(next) {
      revision++;
      update(next);
    },
    setUser(user) {
      if (value) update({ ...value, user });
    },
    async login(username, password) {
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
        throw new Error("Incomplete sign-in response. Please try again.");
      revision++;
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
let storage;
try {
  if (typeof window !== "undefined") storage = window.sessionStorage;
} catch {}
export const sessionStore = createSessionStore({ storage });

const SECOND = 1000;
const MINUTE = 60 * SECOND;

// Time-sensitive and revision-controlled resources deliberately have shorter policies.
export function requestCachePolicy(path) {
  const url = new URL(path, "https://tempo.invalid");
  const route = url.pathname;
  if (
    url.searchParams.get("refresh") === "1" ||
    !route.startsWith("/api/") ||
    /^\/api\/(login|logout|refresh)(\/|$)/.test(route) ||
    route === "/api/widgets/explore/settings"
  )
    return null;
  let freshFor;
  if (/^\/api\/(games\/|[^/]+\/details(?:\/|$)|widgets\/explore$)/.test(route))
    freshFor = 10 * SECOND;
  else if (/^\/api\/(teams\/|roster\/)/.test(route)) freshFor = 10 * MINUTE;
  else if (
    /^\/api\/(player\/(stats|gamelog|fightlog)\/|standings\/|stats\/|team\/stats\/|records\/|awards\/|recruits\/|leaders\/|transactions\/|draft\/|[^/]+\/award-seasons(?:\/|$)|mma\/champions(?:\/|$))/.test(
      route,
    )
  )
    freshFor = 2 * MINUTE;
  else if (/^\/api\/news\/article\//.test(route)) freshFor = 5 * MINUTE;
  else if (/^\/api\/news\//.test(route)) freshFor = MINUTE;
  else if (/^\/api\/explore\/search$/.test(route)) freshFor = 30 * SECOND;
  else if (/^\/api\/(users(?:\/|$)|feed\/|forum\/)/.test(route))
    freshFor = 15 * SECOND;
  else return null;
  // Never show expired account/forum/feed content while another request is pending.
  const personal = /^\/api\/(users(?:\/|$)|feed\/|forum\/|widgets\/)/.test(
    route,
  );
  return {
    freshFor,
    staleFor: personal ? freshFor : Math.min(freshFor * 3, 30 * MINUTE),
  };
}

export function requestCacheKey(path, options = {}) {
  const url = new URL(path, "https://tempo.invalid");
  url.searchParams.sort();
  return JSON.stringify([
    url.pathname + url.search,
    options.auth !== false,
    Object.entries(options.headers || {})
      .map(([key, value]) => [key.toLowerCase(), String(value)])
      .sort(([a], [b]) => a.localeCompare(b)),
  ]);
}

function aborted(signal) {
  return (
    signal?.reason || new DOMException("The request was aborted", "AbortError")
  );
}

/** Bounded, session-owned memory cache. Each consumer owns its cancellation. */
export function createRequestCache({ now = Date.now, maxEntries = 200 } = {}) {
  const entries = new Map();
  const flights = new Map();
  const active = new Set();
  let generation = 0;

  function peek(key, { allowStale = false } = {}) {
    const entry = entries.get(key);
    if (!entry) return null;
    const age = now() - entry.savedAt;
    if (age >= entry.policy.staleFor) {
      entries.delete(key);
      return null;
    }
    const fresh = age < entry.policy.freshFor;
    if (!fresh && !allowStale) return null;
    entries.delete(key);
    entries.set(key, entry);
    return { data: entry.data, fresh };
  }

  function save(key, data, policy) {
    entries.delete(key);
    entries.set(key, { data, policy, savedAt: now() });
    while (entries.size > maxEntries)
      entries.delete(entries.keys().next().value);
  }

  function listen(record, signal) {
    return new Promise((resolve, reject) => {
      const consumer = {};
      record.consumers.add(consumer);
      const cleanup = () => {
        signal?.removeEventListener("abort", cancel);
        record.controller.signal.removeEventListener(
          "abort",
          transportCancelled,
        );
        record.consumers.delete(consumer);
      };
      const transportCancelled = () => {
        cleanup();
        reject(aborted(record.controller.signal));
      };
      const cancel = () => {
        cleanup();
        reject(aborted(signal));
        if (!record.consumers.size && !record.done) {
          if (flights.get(record.key) === record) flights.delete(record.key);
          record.controller.abort();
        }
      };
      signal?.addEventListener("abort", cancel, { once: true });
      record.controller.signal.addEventListener("abort", transportCancelled, {
        once: true,
      });
      record.promise.then(
        (data) => {
          cleanup();
          if (signal?.aborted) reject(aborted(signal));
          else resolve(data);
        },
        (error) => {
          cleanup();
          reject(error);
        },
      );
      if (signal?.aborted) cancel();
    });
  }

  return {
    peek,
    get size() {
      return entries.size;
    },
    set(key, data, policy) {
      if (!policy) return;
      // A live snapshot supersedes an older HTTP result for this key.
      flights.delete(key);
      save(key, data, policy);
    },
    clear({ cancel = false } = {}) {
      generation++;
      entries.clear();
      flights.clear();
      if (cancel) for (const record of active) record.controller.abort();
    },
    request(key, loader, { policy, signal, force = false } = {}) {
      if (signal?.aborted) return Promise.reject(aborted(signal));
      if (!force) {
        const cached = peek(key);
        if (cached) return Promise.resolve(cached.data);
      } else entries.delete(key);
      let record = force ? null : flights.get(key);
      if (!record) {
        const epoch = generation;
        record = {
          key,
          controller: new AbortController(),
          consumers: new Set(),
          done: false,
        };
        flights.set(key, record);
        active.add(record);
        record.promise = Promise.resolve()
          .then(() => {
            record.controller.signal.throwIfAborted();
            return loader(record.controller.signal);
          })
          .then((data) => {
            record.controller.signal.throwIfAborted();
            if (epoch === generation && flights.get(key) === record && policy)
              save(key, data, policy);
            return data;
          })
          .finally(() => {
            record.done = true;
            active.delete(record);
            if (flights.get(key) === record) flights.delete(key);
          });
      }
      return listen(record, signal);
    },
  };
}

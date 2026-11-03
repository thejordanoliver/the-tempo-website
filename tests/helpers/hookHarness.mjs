import vm from "node:vm";

import { build } from "esbuild";

export const flush = () => new Promise((resolve) => setTimeout(resolve, 0));
export function deferred() {
  let resolve, reject;
  const promise = new Promise((yes, no) => {
    resolve = yes;
    reject = no;
  });
  return { promise, resolve, reject };
}

export async function hookHarness(file) {
  const slots = [],
    effects = [],
    requests = [],
    subscriptions = [];
  let index = 0,
    hook,
    args,
    state,
    stopped = false,
    queued = false;
  const same = (a, b) =>
    a?.length === b.length && a.every((value, i) => Object.is(value, b[i]));
  const schedule = () => {
    if (queued || stopped) return;
    queued = true;
    queueMicrotask(() => {
      queued = false;
      if (!stopped) render();
    });
  };
  const react = {
    useRef(value) {
      const i = index++;
      return (slots[i] ??= { current: value });
    },
    useState(initial) {
      const i = index++;
      slots[i] ??= {
        value: typeof initial === "function" ? initial() : initial,
      };
      return [
        slots[i].value,
        (value) => {
          const next =
            typeof value === "function" ? value(slots[i].value) : value;
          if (!Object.is(next, slots[i].value)) {
            slots[i].value = next;
            schedule();
          }
        },
      ];
    },
    useEffect(callback, deps) {
      const i = index++;
      if (same(slots[i]?.deps, deps)) return;
      const previous = slots[i];
      slots[i] = { deps, cleanup: previous?.cleanup };
      effects.push(() => {
        previous?.cleanup?.();
        slots[i].cleanup = callback();
      });
    },
  };
  const session = {
    getSnapshot: () => ({ user: { id: 1 } }),
    request(path, options) {
      const pending = deferred();
      requests.push({ path, options, ...pending });
      return pending.promise;
    },
  };
  const live = {
    subscribe(options) {
      const record = { ...options, active: true };
      subscriptions.push(record);
      return () => {
        record.active = false;
      };
    },
  };
  const bundled = await build({
    entryPoints: [file],
    bundle: true,
    write: false,
    platform: "node",
    format: "cjs",
    plugins: [
      {
        name: "hook-dependencies",
        setup(build) {
          build.onResolve({ filter: /^react$/ }, () => ({
            path: "react",
            namespace: "mock",
          }));
          build.onResolve({ filter: /services\/session\.js$/ }, () => ({
            path: "session",
            namespace: "mock",
          }));
          build.onResolve(
            { filter: /services\/liveSportsSocket\.js$/ },
            () => ({ path: "live", namespace: "mock" }),
          );
          build.onLoad({ filter: /.*/, namespace: "mock" }, ({ path }) => ({
            contents:
              path === "react"
                ? "module.exports = globalThis.react;"
                : path === "session"
                  ? "exports.sessionStore = globalThis.session;"
                  : "exports.sportsLiveClient = globalThis.live;",
          }));
        },
      },
    ],
  });
  const module = { exports: {} };
  vm.runInNewContext(bundled.outputFiles[0].text, {
    module,
    exports: module.exports,
    react,
    session,
    live,
    AbortController,
    AbortSignal,
    crypto,
    setTimeout,
    clearTimeout,
    URL,
    URLSearchParams,
    console,
  });
  function render() {
    index = 0;
    state = hook(...args);
    while (effects.length) effects.shift()();
  }
  return {
    requests,
    subscriptions,
    start(name, values) {
      hook = module.exports[name];
      args = values;
      render();
    },
    update(values = args) {
      args = values;
      render();
    },
    get state() {
      return state;
    },
    stop() {
      stopped = true;
      slots.forEach((slot) => slot?.cleanup?.());
    },
  };
}

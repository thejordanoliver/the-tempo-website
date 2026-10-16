import { useSyncExternalStore } from "react";
const root =
  typeof document !== "undefined"
    ? new URL(
        document.querySelector('meta[name="tempo-base"]')?.content || "./",
        location.href,
      ).pathname
    : "/";
export function href(to) {
  return root + to.replace(/^\//, "");
}
export function navigate(to, { replace = false } = {}) {
  history[replace ? "replaceState" : "pushState"](
    {
      tempoNavigation: replace ? Boolean(history.state?.tempoNavigation) : true,
    },
    "",
    href(to),
  );
  window.dispatchEvent(new Event("tempo:navigate"));
}
export function goBack(fallback = "/home/") {
  if (history.state?.tempoNavigation) history.back();
  else navigate(fallback, { replace: true });
}
const subscribe = (fn) => {
  window.addEventListener("popstate", fn);
  window.addEventListener("tempo:navigate", fn);
  return () => {
    window.removeEventListener("popstate", fn);
    window.removeEventListener("tempo:navigate", fn);
  };
};
export function useRoute() {
  const current = useSyncExternalStore(
    subscribe,
    () => location.pathname + location.search + location.hash,
  );
  const url = new URL(current, location.origin);
  return {
    path: "/" + url.pathname.slice(root.length).replace(/^\/+|\/+$/g, ""),
    search: url.search,
    hash: url.hash,
  };
}
export function Link({ to, children, onClick, ...props }) {
  return (
    <a
      {...props}
      href={href(to)}
      onClick={(event) => {
        onClick?.(event);
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey ||
          props.target === "_blank"
        )
          return;
        event.preventDefault();
        navigate(to);
      }}
    >
      {children}
    </a>
  );
}

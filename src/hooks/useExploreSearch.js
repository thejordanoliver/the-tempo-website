import { useEffect, useState } from "react";
import { sessionStore } from "../services/session.js";
import { resultKey, resultHref } from "../data/explore/explore.js";

export default function useExploreSearch(query, scope, userId, limit = 5) {
  const normalized = query.trim().replace(/\s+/g, " ");
  const key = JSON.stringify([normalized, scope, userId, limit]);
  const storageKey = `tempo.explore.recent:${userId ?? "guest"}`;
  const [recent, setRecent] = useState(() => {
    try {
      const data = JSON.parse(localStorage.getItem(storageKey) || "[]");
      return Array.isArray(data)
        ? data
            .filter((item) => item.type !== "user" && resultHref(item))
            .slice(0, 10)
        : [];
    } catch {
      return [];
    }
  });
  const [state, setState] = useState({
    key: null,
    results: [],
    loading: false,
    error: null,
  });
  useEffect(() => {
    const controller = new AbortController();
    if (normalized.length < 2 || normalized.length > 80)
      return () => controller.abort();
    const timer = setTimeout(() => {
      setState({ key, results: [], loading: true, error: null });
      sessionStore
        .request(
          `/api/explore/search?${new URLSearchParams({ query: normalized, scope, limit: String(limit) })}`,
          {
            signal: AbortSignal.any([
              controller.signal,
              AbortSignal.timeout(20000),
            ]),
          },
        )
        .then((data) => {
          if (!controller.signal.aborted)
            setState({
              key,
              results: Array.isArray(data.results) ? data.results : [],
              loading: false,
              error: null,
            });
        })
        .catch((error) => {
          if (!controller.signal.aborted)
            setState({
              key,
              results: [],
              loading: false,
              error: error.message,
            });
        });
    }, 400);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [key, normalized, scope, limit]);
  function persist(next) {
    setRecent(next);
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {}
  }
  return {
    results: state.key === key ? state.results : [],
    loading:
      normalized.length >= 2 &&
      normalized.length <= 80 &&
      (state.key !== key || state.loading),
    error:
      normalized.length > 80
        ? "Use no more than 80 characters."
        : state.key === key
          ? state.error
          : null,
    recent,
    remember(item) {
      if (item.type !== "user" && resultHref(item))
        persist(
          [
            item,
            ...recent.filter((value) => resultKey(value) !== resultKey(item)),
          ].slice(0, 10),
        );
    },
    remove(item) {
      persist(recent.filter((value) => resultKey(value) !== resultKey(item)));
    },
  };
}

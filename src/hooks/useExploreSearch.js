import { useEffect, useState } from "react";
import useSessionScope from "./useSessionScope.js";
import { sessionStore } from "../services/session.js";
import { resultKey, resultHref } from "../data/explore/explore.js";

export default function useExploreSearch(query, scope, userId, limit = 5) {
  const sessionScope = useSessionScope();
  const normalized = query.trim().replace(/\s+/g, " ");
  const key = JSON.stringify([normalized, scope, userId, limit, sessionScope]);
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
  const path = `/api/explore/search?${new URLSearchParams({ query: normalized, scope, limit: String(limit) })}`;
  const hit =
    normalized.length >= 2 && normalized.length <= 80
      ? sessionStore.peek(path)
      : null;
  useEffect(() => {
    const controller = new AbortController();
    if (normalized.length < 2 || normalized.length > 80)
      return () => controller.abort();
    if (hit) {
      setState({
        key,
        results: hit.data?.results || [],
        loading: false,
        error: null,
      });
      return () => controller.abort();
    }
    const timer = setTimeout(() => {
      setState({ key, results: [], loading: true, error: null });
      sessionStore
        .request(path, {
          signal: AbortSignal.any([
            controller.signal,
            AbortSignal.timeout(20000),
          ]),
        })
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
  }, [key, normalized, scope, limit, path]);
  function persist(next) {
    setRecent(next);
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {}
  }
  return {
    results: state.key === key ? state.results : hit?.data?.results || [],
    loading:
      normalized.length >= 2 &&
      normalized.length <= 80 &&
      (state.key !== key ? !hit : state.loading && !hit),
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

import { useEffect, useRef, useState } from "react";
import { sessionStore } from "../services/session.js";
import {
  defaultWidgets,
  orderWidgets,
  readSettings,
  WIDGETS,
} from "../data/explore/explore.js";

export default function useExploreBoard(userId) {
  const [state, setState] = useState({
    widgets: [],
    revision: 0,
    ready: false,
    pending: false,
    error: null,
    conflict: false,
  });
  const [version, setVersion] = useState(0);
  const mounted = useRef(true),
    busy = useRef(false);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    setState((current) => ({
      ...current,
      ready: false,
      error: null,
      conflict: false,
    }));
    if (!userId) {
      let widgets = defaultWidgets();
      try {
        const saved = JSON.parse(
          localStorage.getItem("tempo.explore.guest.widgets") || "null",
        );
        if (
          Array.isArray(saved) &&
          saved.every((w) => Object.hasOwn(WIDGETS, w.type))
        )
          widgets = orderWidgets(saved);
      } catch {}
      setState({
        widgets,
        revision: 0,
        ready: true,
        pending: false,
        error: null,
        conflict: false,
      });
    } else
      sessionStore
        .request("/api/widgets/explore/settings", {
          signal: controller.signal,
          headers: { "X-Tempo-User-Id": String(userId) },
        })
        .then((data) => {
          if (!controller.signal.aborted)
            setState({
              ...readSettings(data),
              ready: true,
              pending: false,
              error: null,
              conflict: false,
            });
        })
        .catch((error) => {
          if (!controller.signal.aborted)
            setState((current) => ({
              ...current,
              ready: false,
              pending: false,
              error: error.message,
            }));
        });
    return () => controller.abort();
  }, [userId, version]);
  async function save(widgets = state.widgets) {
    if (busy.current || !state.ready || state.conflict) return;
    busy.current = true;
    const next = orderWidgets(widgets);
    setState((current) => ({
      ...current,
      widgets: next,
      pending: true,
      error: null,
    }));
    try {
      if (userId) {
        const response = await sessionStore.request(
          "/api/widgets/explore/settings",
          {
            method: "PUT",
            headers: { "X-Tempo-User-Id": String(userId) },
            body: JSON.stringify({
              schemaVersion: 2,
              revision: state.revision,
              widgets: next,
            }),
          },
        );
        const saved = readSettings(response);
        if (mounted.current)
          setState({
            ...saved,
            ready: true,
            pending: false,
            error: null,
            conflict: false,
          });
      } else {
        localStorage.setItem(
          "tempo.explore.guest.widgets",
          JSON.stringify(next),
        );
        if (mounted.current)
          setState((current) => ({ ...current, pending: false }));
      }
    } catch (error) {
      if (mounted.current)
        setState((current) => ({
          ...current,
          pending: false,
          error:
            error.status === 409
              ? "Layout changed on another device. Reload settings."
              : error.message,
          conflict: error.status === 409,
        }));
    } finally {
      busy.current = false;
    }
  }
  return { ...state, save, reload: () => setVersion((value) => value + 1) };
}

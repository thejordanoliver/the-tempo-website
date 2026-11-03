import { useEffect, useRef, useState } from "react";

import { sessionStore } from "../services/session.js";
import useLiveSportsSubscription from "./useLiveSportsSubscription.js";

export function useResource(path, version = 0, liveSubscription = null) {
  const key = JSON.stringify([path, version]);
  const liveKey = useRef(null);
  const [state, setState] = useState({
    key: null,
    data: null,
    loading: true,
    error: null,
  });
  useLiveSportsSubscription({
    enabled: Boolean(liveSubscription),
    ...liveSubscription,
    onUpdate(data) {
      liveKey.current = key;
      setState({ key, data, loading: false, error: null });
    },
  });
  useEffect(() => {
    const controller = new AbortController();
    liveKey.current = null;
    setState({ key, data: null, loading: true, error: null });
    sessionStore
      .request(path, {
        signal: AbortSignal.any([
          controller.signal,
          AbortSignal.timeout(20000),
        ]),
      })
      .then((data) => {
        if (!controller.signal.aborted && liveKey.current !== key)
          setState({ key, data, loading: false, error: null });
      })
      .catch((error) => {
        if (!controller.signal.aborted && liveKey.current !== key)
          setState({ key, data: null, loading: false, error: error.message });
      });
    return () => controller.abort();
  }, [path, version, key]);
  const { key: _key, ...result } = state;
  return state.key === key
    ? result
    : { data: null, loading: true, error: null };
}

import { useEffect, useRef, useState } from "react";

import { sessionStore } from "../services/session.js";
import useSessionScope from "./useSessionScope.js";
import useLiveSportsSubscription from "./useLiveSportsSubscription.js";

export function useResource(path, version = 0, liveSubscription = null) {
  const scope = useSessionScope();
  const key = JSON.stringify([path, version, scope]);
  const cached = () =>
    version ? null : sessionStore.peek(path, { allowStale: true });
  const initial = () => {
    const hit = cached();
    return { key, data: hit ? hit.data : null, loading: !hit, error: null };
  };
  const liveKey = useRef(null);
  const [state, setState] = useState(initial);
  useLiveSportsSubscription({
    enabled: Boolean(liveSubscription),
    ...liveSubscription,
    onUpdate(data) {
      sessionStore.cacheResponse(path, data);
      liveKey.current = key;
      setState({ key, data, loading: false, error: null });
    },
  });
  useEffect(() => {
    const controller = new AbortController();
    liveKey.current = null;
    const hit = cached();
    setState({ key, data: hit ? hit.data : null, loading: !hit, error: null });
    sessionStore
      .request(path, {
        cache: version ? "reload" : undefined,
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
          setState({
            key,
            data: hit ? hit.data : null,
            loading: false,
            error: hit ? null : error.message,
          });
      });
    return () => controller.abort();
  }, [path, version, key]);
  const { key: _key, ...result } = state;
  return state.key === key
    ? result
    : (() => {
        const { key: _ignored, ...next } = initial();
        return next;
      })();
}

import { useEffect, useRef } from "react";

import { sportsLiveClient } from "../services/liveSportsSocket.js";

/** Replaces subscriptions with the route/date selection and rejects queued old updates. */
export default function useLiveSportsSubscription({
  enabled = true,
  kind,
  payload,
  subscriptions,
  onUpdate,
}) {
  const callback = useRef(onUpdate);
  useEffect(() => {
    callback.current = onUpdate;
  }, [onUpdate]);
  const key = JSON.stringify(subscriptions ?? [{ kind, payload }]);
  useEffect(() => {
    if (!enabled) return;
    let active = true;
    const unsubscribes = JSON.parse(key).map((subscription) =>
      sportsLiveClient.subscribe({
        ...subscription,
        onUpdate: (data, envelope) => {
          if (active) callback.current(data, envelope);
        },
      }),
    );
    return () => {
      active = false;
      unsubscribes.forEach((unsubscribe) => unsubscribe());
    };
  }, [enabled, key]);
}

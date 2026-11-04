import { useSyncExternalStore } from "react";
import { sessionStore } from "../services/session.js";

// Token rotation preserves this scope; signing in/out or changing account replaces it.
export default function useSessionScope() {
  return useSyncExternalStore(
    sessionStore.subscribe,
    sessionStore.getCacheScope,
    sessionStore.getCacheScope,
  );
}

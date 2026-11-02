import { useSyncExternalStore } from "react";
import { subscribeTheme, getResolvedTheme } from "../theme.js";
export default function ThemeSource(props) {
  const theme = useSyncExternalStore(subscribeTheme, getResolvedTheme, () => "system");
  return <source {...props} media={theme === "system" ? "(prefers-color-scheme: dark)" : theme === "dark" ? "all" : "not all"} />;
}

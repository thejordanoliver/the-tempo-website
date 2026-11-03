import { useSyncExternalStore } from "react";

import { subscribeTheme, getThemeMode, setThemeMode } from "../../app/theme.js";

export default function ThemeSelector() {
  const mode = useSyncExternalStore(
    subscribeTheme,
    getThemeMode,
    () => "system",
  );
  return (
    <select
      className="theme-selector"
      aria-label="Color theme"
      value={mode}
      onChange={(event) => setThemeMode(event.target.value)}
    >
      <option value="light">Light</option>
      <option value="dark">Dark</option>
      <option value="system">System</option>
    </select>
  );
}

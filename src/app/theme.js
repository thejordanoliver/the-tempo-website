const key = "tempo-theme";
const valid = (value) => ["system", "light", "dark"].includes(value);
const listeners = new Set();
const browser = typeof window !== "undefined";
const media = browser
  ? window.matchMedia("(prefers-color-scheme: dark)")
  : null;
let mode = "system";
try {
  const saved = browser && window.localStorage.getItem(key);
  if (valid(saved)) mode = saved;
} catch {}
export const getThemeMode = () => mode;
export const getResolvedTheme = () =>
  browser
    ? mode === "system"
      ? media.matches
        ? "dark"
        : "light"
      : mode
    : "system";
function notify() {
  if (browser) document.documentElement.dataset.theme = getResolvedTheme();
  listeners.forEach((listener) => listener());
}
export function setThemeMode(value) {
  if (!valid(value)) return;
  mode = value;
  try {
    window.localStorage.setItem(key, value);
  } catch {}
  notify();
}
export function subscribeTheme(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
if (browser) {
  notify();
  media.addEventListener("change", notify);
  window.addEventListener("storage", (event) => {
    if (event.key === key || event.key === null) {
      mode = valid(event.newValue) ? event.newValue : "system";
      notify();
    }
  });
}

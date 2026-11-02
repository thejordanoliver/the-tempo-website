export function ufcEventOptions(data, now = Date.now()) {
  const events = (Array.isArray(data?.events) ? data.events : []).filter(event => event.id != null);
  const sorted = [...events].sort((a, b) => new Date(a.date || a.startDate) - new Date(b.date || b.startDate));
  const preferred = sorted.find(event => event.status?.type?.state === "in" || event.status?.state === "in")
    || sorted.find(event => new Date(event.date || event.startDate).getTime() >= now)
    || sorted.at(-1);
  return {events: sorted, defaultId: preferred ? String(preferred.id) : ""};
}

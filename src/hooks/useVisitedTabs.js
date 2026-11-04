import { useState } from "react";

// Profile-owned state resets when navigating to a different player.
export default function useVisitedTabs(active) {
  const [visited, setVisited] = useState([active]);
  if (!visited.includes(active)) {
    const next = [...visited, active];
    setVisited(next);
    return next;
  }
  return visited;
}

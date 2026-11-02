import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
export default function LeagueControlSlot({children}) {
  const [target, setTarget] = useState(null);
  useEffect(() => { setTarget(document.getElementById("league-extra-controls")); }, []);
  return target ? createPortal(children, target) : children;
}

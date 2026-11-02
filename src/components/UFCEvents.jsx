import { State } from "../components.jsx";
import { ufcEventOptions } from "../ufcEvents.js";
import LeagueControlSlot from "./LeagueControlSlot.jsx";
import { LeagueScores } from "./LeagueContent.jsx";

export default function UFCEvents({ data, eventId, onChange }) {
  const {events, defaultId} = ufcEventOptions(data);
  const selected = events.find(event => String(event.id) === String(eventId))
    || events.find(event => String(event.id) === defaultId);
  if (!selected) return <State empty="No UFC events available for this year." />;
  return <>
    <LeagueControlSlot>
      <label>Event
        <select value={String(selected.id)} onChange={event => onChange(event.target.value)}>
          {events.map(event => {
            const date = new Date(event.date || event.startDate);
            const dateLabel = Number.isNaN(date.valueOf()) ? "" : date.toLocaleDateString(undefined, {month: "short", day: "numeric"});
            return <option key={event.id} value={String(event.id)}>{event.name || event.shortName || "UFC event"}{dateLabel ? ` · ${dateLabel}` : ""}</option>;
          })}
        </select>
      </label>
    </LeagueControlSlot>
    <LeagueScores data={{events: [selected]}} league="ufc" />
  </>;
}

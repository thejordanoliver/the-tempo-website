import PlayerLink from "./PlayerLink.jsx";
import { Image } from "../components.jsx";
import "./UFCFightCard.css";

function Fighter({ fighter = {}, side }) {
  const name = fighter.shortName || fighter.displayName || fighter.fullName || fighter.name || "TBD";
  const fullName = fighter.displayName || fighter.fullName || fighter.name || name;
  return <PlayerLink league="ufc" id={fighter.id} className={`ufc-fight-fighter ufc-fight-${side}`}>
    <div className="ufc-fight-portrait">
      <span aria-hidden="true">{name.charAt(0)}</span>
      <Image src={fighter.headshot || fighter.headshot_url} alt={`${fullName} headshot`} loading="lazy" />
    </div>
    {fighter.flag && <Image className="ufc-fight-flag" src={fighter.flag} alt={`${fullName} country flag`} loading="lazy" />}
    <span className="ufc-fight-name" title={fullName}>{name}</span>
  </PlayerLink>;
}

function Record({ fighter = {}, final, hasWinner }) {
  return <strong className={`ufc-fight-record${final && hasWinner && fighter.winner !== true ? " ufc-fight-loser" : ""}${final && fighter.winner === true ? " ufc-fight-winner" : ""}`}>
    {fighter.record || "—"}
    {final && fighter.winner === true && <span className="sr-only"> Winner</span>}
  </strong>;
}

export default function UFCFightCard({ fight, event = {} }) {
  const fighters = Array.isArray(fight.competitors) ? fight.competitors : [];
  const status = fight.status || {};
  const description = status.description || status.type?.description || "";
  const final = status.type?.completed === true || status.type?.state === "post" || /^(final|completed)$/i.test(description);
  const live = status.type?.state === "in" || /in progress|end of round|walkouts|intros/i.test(description);
  const date = new Date(fight.date || fight.startDate || event.date || event.startDate);
  const validDate = !Number.isNaN(date.valueOf());
  const dateLabel = validDate ? date.toLocaleDateString(undefined, {month: "short", day: "numeric"}) : "";
  const timeLabel = validDate ? date.toLocaleTimeString(undefined, {hour: "numeric", minute: "2-digit"}) : "TBD";
  const method = {submission: "SUB", decision: "DEC"}[fight.method?.toLowerCase()] || fight.method;
  const round = status.period ? `R${status.period}` : "";
  const primary = final ? method || description || "Final"
    : /in progress/i.test(description) ? round || "Live"
    : description && !/scheduled/i.test(description) ? description : dateLabel || "Scheduled";
  const secondary = final ? dateLabel : live ? status.displayClock || ""
    : description && !/scheduled/i.test(description) ? "" : /TBD/i.test(status.shortDetail || "") ? "TBD" : timeLabel;
  const broadcasts = fight.broadcasts || event.broadcasts || [];
  const broadcast = [...new Set(broadcasts.flatMap(item => typeof item === "string" ? [item] : item.names || item.media?.shortName || []))].join(" / ");
  const headline = fight.headline || fight.weightClass || fight.cardSegment;
  const hasWinner = fighters.some(fighter => fighter.winner === true);
  return <article className={`ufc-fight-card${headline ? " ufc-fight-has-headline" : ""}`} aria-label={`${fighters.map(fighter => fighter.displayName || fighter.fullName || fighter.shortName || fighter.name || "TBD").join(" versus ")}. ${primary}`}>
    {headline && <p className="ufc-fight-headline">{headline}</p>}
    <Fighter fighter={fighters[1]} side="left" />
    <Record fighter={fighters[1]} final={final} hasWinner={hasWinner} />
    <div className={`ufc-fight-info${final ? " ufc-fight-final" : live ? " ufc-fight-live" : ""}`}>
      <p><span>{primary}</span>{secondary && <span>{secondary}</span>}</p>
      {!final && broadcast && <small>{broadcast}</small>}
    </div>
    <Record fighter={fighters[0]} final={final} hasWinner={hasWinner} />
    <Fighter fighter={fighters[0]} side="right" />
  </article>;
}

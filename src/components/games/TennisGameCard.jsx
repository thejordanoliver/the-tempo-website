import "./GameCard.css";
import "./TennisGameCard.css";

const list = (value) => (Array.isArray(value) ? value : []);

function Competitor({ competitor = {}, side }) {
  const name = competitor.shortName || competitor.displayName || "TBD";
  const flags = list(competitor.flags).length
    ? competitor.flags
    : competitor.flag
      ? [competitor.flag]
      : [];
  return (
    <div className={`gc-team gc-${side}`}>
      <div className="tc-flags">
        {flags.slice(0, 2).map((flag, index) => (
          <span className="tc-flag" key={`${flag}-${index}`}>
            <img
              src={flag}
              alt={competitor.country || "Country flag"}
              loading="lazy"
            />
          </span>
        ))}
      </div>
      <span className="gc-name" title={competitor.displayName || name}>
        {competitor.rank > 0 && <small>{competitor.rank} </small>}
        {name}
      </span>
    </div>
  );
}

export default function TennisGameCard({ match }) {
  const [left = {}, right = {}] = list(match.competitors);
  const status = match.status || {};
  const scheduled = status.state === "pre";
  const final = status.state === "post";
  const live = status.state === "in";
  const interrupted = /cancel|delay|postpon|forfeit|suspend/i.test(
    status.description || "",
  );
  const date = new Date(match.date || match.startDate || "");
  const validDate = !Number.isNaN(date.valueOf());
  const dateText = validDate
    ? date.toLocaleDateString(undefined, { month: "short", day: "numeric" })
    : "Date TBD";
  const timeText =
    !validDate || /TBD/i.test(status.detail || status.shortDetail || "")
      ? "TBD"
      : date.toLocaleTimeString(undefined, {
          hour: "numeric",
          minute: "2-digit",
        });
  const detail = status.detail || status.shortDetail || status.description;
  const parts = live
    ? [detail || "Live"]
    : interrupted
      ? [status.description]
      : final
        ? [dateText, detail || "Final"]
        : [dateText, timeText];
  const tied = Boolean(left.winner) === Boolean(right.winner);
  const score = (competitor) => (
    <span className="gc-score-slot">
      {!scheduled && (
        <span
          className={`gc-score${!tied && !competitor.winner ? " gc-loser" : ""}`}
        >
          {competitor.score ?? "—"}
        </span>
      )}
      {live && competitor.serving && (
        <span className="tc-serving" role="img" aria-label="Serving" />
      )}
    </span>
  );
  return (
    <article
      className="tempo-game-card tc-card"
      aria-label={`${match.tournamentName || "Tennis"}: ${left.displayName || left.shortName || "TBD"} vs ${right.displayName || right.shortName || "TBD"}`}
    >
      <Competitor competitor={left} side="away" />
      {score(left)}
      <div className="gc-info">
        <div
          className={`gc-status${live || final || interrupted ? " gc-final" : ""}`}
        >
          {parts.filter(Boolean).map((part, index) => (
            <span className="tc-status-part" key={index}>
              {index > 0 && (
                <span className="gc-status-divider" aria-hidden="true" />
              )}
              <span>{part}</span>
            </span>
          ))}
        </div>
        {!final && match.venue?.court && (
          <span className="gc-broadcast" title={match.venue.court}>
            {match.venue.court}
          </span>
        )}
      </div>
      {score(right)}
      <Competitor competitor={right} side="home" />
    </article>
  );
}

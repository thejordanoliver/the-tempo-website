import { useId, useState } from "react";
import { gameCardModel } from "./gameCardModel.js";
import HeadingTwo from "./HeadingTwo.jsx";
import TeamLogo from "./TeamLogo.jsx";
import { periodLabel, summaryPlays } from "./gameSummaryModel.js";
import "./GameSummary.css";
export default function GameSummary({ score, league }) {
  const [selected, setSelected] = useState("all"),
    [limit, setLimit] = useState(30),
    id = useId();
  const { live, final } = gameCardModel(score, league);
  if (!live && !final) return null;
  const plays = summaryPlays(score.plays),
    periods = [
      ...new Set(
        plays
          .map((p) => Number(p.period?.number))
          .filter((n) => Number.isInteger(n) && n > 0),
      ),
    ].sort((a, b) => a - b);
  const tabs = ["all", ...periods],
    active = tabs.includes(selected) ? selected : "all",
    filtered =
      active === "all"
        ? plays
        : plays.filter((p) => Number(p.period?.number) === active);
  const select = (value) => {
    setSelected(value);
    setLimit(30);
  };
  return (
    <section className="detail-section">
      <HeadingTwo>Game Summary</HeadingTwo>
      <div className="game-panel summary-panel">
        <div
          className="leader-tabs summary-tabs"
          role="tablist"
          aria-label="Game summary period"
        >
          {tabs.map((tab, index) => (
            <button
              key={tab}
              id={`${id}-${tab}`}
              type="button"
              role="tab"
              aria-selected={active === tab}
              aria-controls={`${id}-plays`}
              tabIndex={active === tab ? 0 : -1}
              onClick={() => select(tab)}
              onKeyDown={(e) => {
                let next;
                if (e.key === "ArrowRight") next = (index + 1) % tabs.length;
                if (e.key === "ArrowLeft")
                  next = (index + tabs.length - 1) % tabs.length;
                if (e.key === "Home") next = 0;
                if (e.key === "End") next = tabs.length - 1;
                if (next != null) {
                  e.preventDefault();
                  select(tabs[next]);
                  e.currentTarget.parentElement.children[next].focus();
                }
              }}
            >
              {tab === "all" ? "All" : periodLabel(tab, league)}
            </button>
          ))}
        </div>
        <div
          role="tabpanel"
          id={`${id}-plays`}
          aria-labelledby={`${id}-${active}`}
          tabIndex={0}
          className="summary-list"
        >
          {filtered.length ? (
            <>
              <ol className="summary-plays">
                {filtered.slice(0, limit).map((play, index) => {
                  const teamId = play.team?.id ?? play.teamId,
                    team =
                      teamId == null
                        ? null
                        : [score.away, score.home].find(
                            (t) =>
                              t?.id != null && String(t.id) === String(teamId),
                          ),
                    showLogo = team && !/start of|end of/i.test(play.text),
                    clock =
                      play.clock?.displayValue ??
                      (typeof play.clock === "string" ? play.clock : "–"),
                    event =
                      play.type?.text ||
                      play.eventLabel ||
                      play.shortDescription ||
                      "Play",
                    hasScore = play.awayScore != null && play.homeScore != null;
                  return (
                    <li
                      className="summary-play"
                      key={`${play.id ?? play._index}-${index}`}
                    >
                      <div className="summary-time">
                        <strong>{clock}</strong>
                        <span>{periodLabel(play.period?.number, league)}</span>
                      </div>
                      <div className="summary-timeline">
                        <div className="summary-marker">
                          {showLogo ? (
                            <TeamLogo team={team} league={league} />
                          ) : (
                            <span className="summary-dot" />
                          )}
                        </div>
                      </div>
                      <div className="summary-content">
                        <div className="summary-meta">
                          <span className="summary-event">{event}</span>
                          {hasScore && (
                            <span
                              className="summary-score"
                              aria-label={`Away ${play.awayScore}, home ${play.homeScore}`}
                            >
                              {play.awayScore}
                              <span>–</span>
                              {play.homeScore}
                            </span>
                          )}
                        </div>
                        <p>{play.text}</p>
                      </div>
                    </li>
                  );
                })}
              </ol>
              {limit < filtered.length && (
                <button
                  className="summary-more"
                  type="button"
                  onClick={() => setLimit((v) => v + 30)}
                >
                  Show more plays
                </button>
              )}
            </>
          ) : (
            <p className="summary-empty">
              Play-by-play is not available for this game yet.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

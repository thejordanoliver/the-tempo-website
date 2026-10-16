import { useId, useState } from "react";
import HeadingTwo from "./HeadingTwo.jsx";
import TeamLogo from "./TeamLogo.jsx";
import { Image } from "../components.jsx";
import { sideGroup, leaderConfig } from "./gameSectionModel.js";
export default function GameLeaders({ score, league }) {
  const [selected, setSelected] = useState(null),
    id = useId();
  const groups = Array.isArray(score.leaders) ? score.leaders : [];
  const categories = [
    ...new Set(
      groups.flatMap((g) =>
        (g.leaders || []).filter((c) => c.leaders?.length).map((c) => c.name),
      ),
    ),
  ];
  const preferred =
    score.status?.state === "pre"
      ? ["pointsPerGame", "assistsPerGame", "reboundsPerGame"]
      : ["points", "assists", "rebounds"];
  const tabs = [
    ...preferred.filter((k) => categories.includes(k)),
    ...categories.filter((k) => !preferred.includes(k)),
  ];
  if (!tabs.length) return null;
  const active = tabs.includes(selected) ? selected : tabs[0];
  const config = leaderConfig[active];
  const label = (key) =>
    leaderConfig[key]?.[0] ||
    groups.flatMap((g) => g.leaders || []).find((c) => c.name === key)
      ?.displayName ||
    key;
  return (
    <section className="detail-section">
      <HeadingTwo>
        {score.status?.state === "pre" ? "Season Leaders" : "Game Leaders"}
      </HeadingTwo>
      <div className="game-panel">
        <div
          className="leader-tabs"
          role="tablist"
          aria-label="Leader statistic"
        >
          {tabs.map((key, index) => (
            <button
              type="button"
              role="tab"
              id={`${id}-${key}`}
              aria-controls={`${id}-panel`}
              aria-selected={active === key}
              tabIndex={active === key ? 0 : -1}
              key={key}
              onClick={() => setSelected(key)}
              onKeyDown={(e) => {
                let next;
                if (e.key === "ArrowRight") next = (index + 1) % tabs.length;
                if (e.key === "ArrowLeft")
                  next = (index + tabs.length - 1) % tabs.length;
                if (e.key === "Home") next = 0;
                if (e.key === "End") next = tabs.length - 1;
                if (next != null) {
                  e.preventDefault();
                  setSelected(tabs[next]);
                  e.currentTarget.parentElement.children[next].focus();
                }
              }}
            >
              {label(key)}
            </button>
          ))}
        </div>
        <div
          role="tabpanel"
          id={`${id}-panel`}
          aria-labelledby={`${id}-${active}`}
          tabIndex={0}
        >
          {["away", "home"].map((side) => {
            const group = sideGroup(groups, score[side], side),
              entry = group?.leaders?.find((c) => c.name === active)
                ?.leaders?.[0],
              athlete = entry?.athlete;
            return (
              <div className="leader-player" key={side}>
                <div className="leader-avatar">
                  {athlete?.headshot ? (
                    <Image src={athlete.headshot} alt="" />
                  ) : (
                    <span aria-hidden="true">
                      {athlete?.fullName
                        ?.split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("") || "–"}
                    </span>
                  )}
                </div>
                <div className="leader-info">
                  <div className="leader-name">
                    <strong>
                      {athlete?.fullName ||
                        athlete?.shortName ||
                        "Leader unavailable"}
                    </strong>
                    {athlete?.jersey && <span>#{athlete.jersey}</span>}
                  </div>
                  <dl className="leader-values">
                    {(config?.[1] || [[label(active), active]]).map(
                      ([title, key], i) => (
                        <div key={key}>
                          <dt>{title}</dt>
                          <dd>
                            {entry?.statistics?.find((s) => s.name === key)
                              ?.displayValue ??
                              (i === 0
                                ? (entry?.mainStat?.value ??
                                  entry?.displayValue ??
                                  entry?.value)
                                : null) ??
                              "–"}
                          </dd>
                        </div>
                      ),
                    )}
                  </dl>
                </div>
                <TeamLogo team={score[side]} league={league} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

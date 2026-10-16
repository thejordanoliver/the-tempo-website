import HeadingTwo from "./HeadingTwo.jsx";
import TeamLogo from "./TeamLogo.jsx";
import {
  sideGroup,
  teamLabel,
  statLabel,
  comparison,
} from "./gameSectionModel.js";
export default function GameStats({ score, league }) {
  const groups = (Array.isArray(score.teamStats) ? score.teamStats : []).filter(
    (g) => Array.isArray(g.stats),
  );
  const away = sideGroup(groups, score.away, "away"),
    home = sideGroup(groups, score.home, "home");
  if (!away || !home) return null;
  const names = [
    ...new Set(
      [...away.stats, ...home.stats].map((s) => s.name).filter(Boolean),
    ),
  ];
  if (!names.length) return null;
  return (
    <section className="detail-section">
      <HeadingTwo>
        {score.status?.state === "pre" ? "Team Stats" : "Game Stats"}
      </HeadingTwo>
      <div className="game-panel">
        <div className="game-stats-teams">
          {["away", "home"].map((side) => (
            <div key={side}>
              <TeamLogo team={score[side]} league={league} />
              <strong>{teamLabel(score[side], league)}</strong>
            </div>
          ))}
        </div>
        <dl className="game-stat-list">
          {names.map((name) => {
            const a = away.stats.find((s) => s.name === name),
              h = home.stats.find((s) => s.name === name),
              av = a?.displayValue ?? "–",
              hv = h?.displayValue ?? "–",
              winner = comparison(av, hv, name);
            return (
              <div className="game-stat-row" key={name}>
                <dt>{a?.displayName || h?.displayName || statLabel(name)}</dt>
                <dd className={winner === "home" ? "stat-trailing" : ""}>
                  <span className="sr-only">
                    {teamLabel(score.away, league)}{" "}
                  </span>
                  {av}
                </dd>
                <dd className={winner === "away" ? "stat-trailing" : ""}>
                  <span className="sr-only">
                    {teamLabel(score.home, league)}{" "}
                  </span>
                  {hv}
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}

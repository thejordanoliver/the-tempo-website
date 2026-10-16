import HeadingTwo from "./HeadingTwo.jsx";
import { teamLabel } from "./gameSectionModel.js";
export default function LineScore({ score, league }) {
  const periods = Array.isArray(score.periodScores) ? score.periodScores : [];
  if (!periods.length) return null;
  const regulation = league === "nhl" ? 3 : league === "mlb" ? 9 : 4;
  const count = Math.max(regulation, periods.length);
  const columns = Array.from({ length: count }, (_, i) => ({
    label:
      league === "mlb" || i < regulation
        ? i + 1
        : i === regulation
          ? "OT"
          : `${i - regulation + 1}OT`,
    period: periods.find((p) => Number(p.period) === i + 1),
  }));
  return (
    <section className="detail-section">
      <HeadingTwo>Line Score</HeadingTwo>
      <div
        className="game-panel line-score-scroll"
        tabIndex={0}
        role="region"
        aria-label="Line score by period"
      >
        <table className="line-score-table">
          <thead>
            <tr>
              <th scope="col">
                <span className="sr-only">Team</span>
              </th>
              {columns.map((p, i) => (
                <th scope="col" key={i}>
                  {p.label}
                </th>
              ))}
              <th scope="col">TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {["away", "home"].map((side) => (
              <tr key={side}>
                <th scope="row">{teamLabel(score[side], league)}</th>
                {columns.map((p, i) => (
                  <td key={i}>{p.period?.[side] ?? "–"}</td>
                ))}
                <td>
                  <strong>{score[side].score ?? "–"}</strong>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

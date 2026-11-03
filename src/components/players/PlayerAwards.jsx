import Icon from "../ui/Icon.jsx";

export default function PlayerAwards({ awards }) {
  const uniqueAwards = [...new Set(awards)];
  if (!uniqueAwards.length) return null;
  return (
    <section
      className="player-section player-awards"
      aria-labelledby="player-awards-title"
    >
      <div className="player-section-heading">
        <div>
          <p className="eyebrow">Career recognition</p>
          <h2 id="player-awards-title">Awards &amp; honors</h2>
        </div>
        <span className="player-section-count">
          {uniqueAwards.length}{" "}
          {uniqueAwards.length === 1 ? "distinction" : "distinctions"}
        </span>
      </div>
      <ul className="player-awards-grid">
        {uniqueAwards.map((award) => {
          const count = award.match(/^(\d+)\s*[×x]\s*/)?.[1];
          return (
            <li key={award} className="player-award-card">
              <span className="player-award-icon">
                <Icon name="star" size={24} />
              </span>
              <div>
                <span className="player-award-label">
                  {count ? `${count}× honored` : "Career honor"}
                </span>
                <h3>{award.replace(/^\d+\s*[×x]\s*/, "")}</h3>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

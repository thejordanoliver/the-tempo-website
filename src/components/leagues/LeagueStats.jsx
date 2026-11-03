import PlayerLink from "../players/PlayerLink.jsx";
import { Image } from "../ui/Image.jsx";
import { Table } from "../ui/Table.jsx";
import Empty from "./EmptyLeagueState.jsx";
const list = (value) => (Array.isArray(value) ? value : []);
export function LeagueStats({ data, league }) {
  const categories = list(data?.categories).filter(
    (category) => list(category.leaders).length,
  );
  if (!categories.length)
    return <Empty>No season leaders available yet.</Empty>;
  return (
    <>
      {data.displaySeason && <p className="page-note">{data.displaySeason}</p>}
      <div className="league-stats-grid">
        {categories.map((category, index) => (
          <section
            className="league-table-section"
            key={category.categoryName || index}
          >
            <h3>{category.categoryName || category.shortName}</h3>
            <Table
              headers={["Rank", "Player", category.abbreviation || "Value"]}
              rows={category.leaders.map((player, i) => [
                player.rank ?? i + 1,
                <PlayerLink
                  league={league}
                  id={player.id}
                  className="league-stats-player"
                >
                  <span className="league-stats-headshot">
                    <span aria-hidden="true">
                      {(player.full_name || player.short_name || "")
                        .split(/\s+/)
                        .map((part) => part[0])
                        .slice(0, 2)
                        .join("") || "—"}
                    </span>
                    <Image src={player.headshot} alt="" loading="lazy" />
                  </span>
                  <span>
                    {player.full_name || player.short_name || "Unknown player"}
                  </span>
                </PlayerLink>,
                player.stat_value,
              ])}
            />
          </section>
        ))}
      </div>
    </>
  );
}

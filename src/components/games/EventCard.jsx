import { readableDate } from "../../utils/dates.js";
import UFCFightCard from "../mma/UFCFightCard.jsx";
import { Table } from "../ui/Table.jsx";
const list = (value) => (Array.isArray(value) ? value : []);
const text = (value) =>
  typeof value === "string" || typeof value === "number" ? value : "—";
export default function EventCard({ game, sport }) {
  if (sport === "mma")
    return (
      <section className="ufc-event-fights">
        <h3>{game.name || game.headline || "UFC event"}</h3>
        <div className="ufc-fight-list">
          {(list(game.fights).length
            ? game.fights
            : [game.mainEvent || game]
          ).map((fight, index) => (
            <UFCFightCard key={fight.id || index} fight={fight} event={game} />
          ))}
        </div>
      </section>
    );
  return (
    <article className="league-event">
      <p className="eyebrow">
        {text(
          game.status?.shortDetail ||
            game.status?.description ||
            readableDate(game.date),
        )}
      </p>
      <h3>{game.tournamentName || game.name || game.headline || "Event"}</h3>
      {game.round?.name && <p>{game.round.name}</p>}
      {sport === "racing" && (
        <>
          <p>{game.venue?.name || game.circuit?.name}</p>
          {list(game.competitions).map((competition, index) => (
            <div key={competition.id || index}>
              <h4>
                {competition.type?.text || competition.type?.name || "Race"}
              </h4>
              <p className="small">
                {readableDate(competition.date)} ·{" "}
                {competition.status?.description}
              </p>
            </div>
          ))}
          {list(game.drivers).length > 0 && (
            <Table
              headers={["Position", "Driver", "Team"]}
              rows={game.drivers.map((driver) => [
                driver.position ?? "—",
                driver.fullName || driver.displayName || driver.name,
                driver.team,
              ])}
            />
          )}
        </>
      )}
    </article>
  );
}

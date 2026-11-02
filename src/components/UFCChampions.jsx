import PlayerLink from "./PlayerLink.jsx";
import { Image, State } from "../components.jsx";
import "./UFCChampions.css";

const divisionOrder = ["Heavyweight", "Light Heavyweight", "Middleweight", "Welterweight", "Lightweight", "Featherweight", "Bantamweight", "Flyweight", "Women's Bantamweight", "Women's Flyweight", "Women's Strawweight"];
const isInterim = champion => /interim/i.test(champion.accolade_name || "");

export default function UFCChampions({ data }) {
  const groups = data?.data || {};
  const divisions = [...divisionOrder, ...Object.keys(groups).filter(division => !divisionOrder.includes(division))];
  const entries = divisions.flatMap(division => {
    const rows = Array.isArray(groups[division]) ? groups[division] : [];
    const champion = rows.find(row => row.is_current === true) || rows.find(row => !isInterim(row)) || rows[0];
    return champion ? [{division, champion}] : [];
  });
  if (!entries.length) return <State empty="No champions available right now." />;
  return <div className="ufc-champions">
    {entries.map(({division, champion}) => {
      const fighter = champion.fighter || {};
      const name = fighter.full_name || fighter.display_name || fighter.name || "Unknown Fighter";
      const country = fighter.citizenship || fighter.citizenship_country_code || "—";
      return <article className="ufc-champion" key={division}>
        <header className="ufc-champion-division">
          <div><p>UFC</p><h3>{division.replace("Women's ", "W ")}</h3></div>
          <span>{isInterim(champion) ? "INTERIM TITLE" : "TITLE HOLDER"}</span>
        </header>
        <div className="ufc-champion-fighter">
          <div className="ufc-champion-headshot">
            <span aria-hidden="true">{name.charAt(0)}</span>
            <Image src={fighter.headshot_url} alt={`${name} headshot`} loading="lazy" />
          </div>
          <div className="ufc-champion-info">
            <div className="ufc-champion-identity">
              <div><h4><PlayerLink league="ufc" id={fighter.id}>{name}</PlayerLink></h4>{fighter.nickname && <p className="ufc-champion-nickname">&quot;{fighter.nickname}&quot;</p>}</div>
              {fighter.flag_url && <Image className="ufc-champion-flag" src={fighter.flag_url} alt={`${country} flag`} loading="lazy" />}
            </div>
            <p className="ufc-champion-country">{country}</p>
          </div>
        </div>
        <dl className="ufc-champion-stats">
          {[["Weight", fighter.weight != null ? `${fighter.weight} lbs` : "—"], ["Stance", fighter.stance_text || "—"], ["Camp", fighter.association_name || "—"]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
        </dl>
      </article>;
    })}
  </div>;
}

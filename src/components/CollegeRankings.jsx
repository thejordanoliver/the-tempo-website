import { State, useResource } from "../components.jsx";
import { LeagueRecords } from "./LeagueContent.jsx";
const supported = ["cfb", "mcbb", "wcbb", "mcvb", "wcvb"];
export default function CollegeRankings({ league }) {
  if (!supported.includes(league)) return null;
  return <Rankings league={league} key={league} />;
}
function Rankings({ league }) {
  const resource = useResource(`/api/standings/${league}/rankings`);
  return <section aria-label="College rankings">
    <h2>Rankings</h2>
    <p className="page-note">Latest available polls</p>
    <State {...resource} />
    {!resource.loading && !resource.error && <LeagueRecords data={resource.data} tab="rankings" league={league} />}
  </section>;
}

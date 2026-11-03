import { hasCollegePolls } from "../../data/leagues/collegeStandings.js";
import CollegeRankings from "./CollegeRankings.jsx";
import StandingsTables from "./StandingsTables.jsx";
export function LeagueStandings({ data, league, showRankings = true }) {
  if (showRankings && hasCollegePolls(league))
    return <CollegeRankings league={league} data={data} />;
  return <StandingsTables data={data} league={league} />;
}

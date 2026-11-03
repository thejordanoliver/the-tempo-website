import { leagueSports } from "../../data/leagues/leagues.js";
import { Table } from "../ui/Table.jsx";
import Empty from "./EmptyLeagueState.jsx";
import StandingsName from "./StandingsName.jsx";
const list = (value) => (Array.isArray(value) ? value : []);
function VolleyballStandings({ data, league }) {
  const flatten = (groups) =>
    list(groups).flatMap((group) => [group, ...flatten(group.children)]);
  const groups = [
    ...flatten(data?.groups),
    { name: "Standings", standings: list(data?.standings) },
  ].filter((group) => list(group.standings).length);
  if (!groups.length)
    return <Empty>No standings available for this season.</Empty>;
  return (
    <>
      {groups.map((group, index) => {
        const columns = [
          ...new Map(
            group.standings
              .flatMap((row) => list(row.stats))
              .map((stat) => [stat.name, stat]),
          ).values(),
        ];
        return (
          <section className="league-table-section" key={group.id || index}>
            <h3>{group.name}</h3>
            <Table
              headers={[
                "Team",
                ...columns.map((stat) => stat.label || stat.name),
              ]}
              rows={group.standings.map((row) => [
                <StandingsName team={row.team || {}} league={league} />,
                ...columns.map((column) => {
                  const stat = list(row.stats).find(
                    (item) => item.name === column.name,
                  );
                  return stat?.displayValue ?? stat?.value;
                }),
              ])}
            />
          </section>
        );
      })}
    </>
  );
}
const percentage = (value) =>
  value != null && Number.isFinite(Number(value))
    ? Number(value).toFixed(3)
    : "—";
function CollegeStandings({ data, league }) {
  const groups = list(data?.conferences).flatMap((conference) =>
    list(conference.divisions)
      .filter((division) => list(division.teams).length)
      .map((division) => ({
        name:
          division.name === "Overall"
            ? conference.name
            : `${conference.name} · ${division.name}`,
        teams: division.teams,
      })),
  );
  if (!groups.length)
    return <Empty>No standings available for this season.</Empty>;
  return groups.map((group, index) => (
    <section className="league-table-section" key={index}>
      <h3>{group.name}</h3>
      <Table
        headers={[
          "Rank",
          "Team",
          "Conference",
          "Overall",
          "Home",
          "Away",
          "Streak",
        ]}
        rows={group.teams.map((team, index) => [
          team.rank ?? index + 1,
          <StandingsName team={team} league={league} />,
          team.confOverall,
          team.overall,
          team.homeOverall,
          team.awayOverall,
          team.streak,
        ])}
      />
    </section>
  ));
}
export default function StandingsTables({ data, league }) {
  if (["cfb", "mcbb", "wcbb"].includes(league))
    return <CollegeStandings data={data} league={league} />;
  if (leagueSports[league] === "volleyball")
    return <VolleyballStandings data={data} league={league} />;
  const groups = list(data?.conferences).filter(
    (group) => list(group.standings).length,
  );
  if (!groups.length)
    return <Empty>No standings available for this season.</Empty>;
  const soccer = leagueSports[league] === "soccer",
    racing = league === "f1";
  return (
    <>
      {data.seasonDisplayName && (
        <p className="page-note">{data.seasonDisplayName}</p>
      )}
      {groups.map((group, index) => (
        <section className="league-table-section" key={group.id || index}>
          <h3>{group.name || "Standings"}</h3>
          <Table
            headers={
              racing
                ? ["Rank", "Driver / constructor", "Points"]
                : [
                    "Rank",
                    "Team",
                    "W",
                    "L",
                    ...(soccer
                      ? ["D", "Pts"]
                      : league === "nhl"
                        ? ["OTL", "Pts"]
                        : ["PCT"]),
                    "Streak",
                  ]
            }
            rows={group.standings.map((team, i) =>
              racing
                ? [team.rank ?? i + 1, team.name, team.points]
                : [
                    team.rank ?? i + 1,
                    <StandingsName team={team} league={league} />,
                    team.wins,
                    team.losses,
                    ...(soccer
                      ? [team.ties, team.points]
                      : league === "nhl"
                        ? [team.otLosses, team.points]
                        : [percentage(team.winPercent)]),
                    team.streak,
                  ],
            )}
          />
        </section>
      ))}
    </>
  );
}

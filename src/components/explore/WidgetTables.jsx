import { useState } from "react";
import { Link } from "../../app/router.jsx";
import { teamHref } from "../../data/teams/teams.js";
import TeamLogo from "../teams/TeamLogo.jsx";
import { State } from "../ui/State.jsx";

const teamName = (team) =>
  team.shortName || team.name || team.fullName || team.code || "Team";
function TeamName({ team, league }) {
  const content = (
    <>
      <TeamLogo team={team} league={league} />
      <span>{teamName(team)}</span>
    </>
  );
  return team.id != null ? (
    <Link to={teamHref(league, team.id)}>{content}</Link>
  ) : (
    <span className="dashboard-team-name">{content}</span>
  );
}

export function TeamSlide({ team, league }) {
  return (
    <Link className="dashboard-team-link" to={teamHref(league, team.id)}>
      <TeamLogo team={team} league={league} />
      <span>
        <strong>{teamName(team)}</strong>
        <small>{league.toUpperCase()}</small>
      </span>
    </Link>
  );
}

export function StandingsPreview({ data, league, disabled }) {
  const [expanded, setExpanded] = useState(false);
  const groups = (data?.conferences || []).filter(
    (group) => group.standings?.length,
  );
  if (!groups.length) return <State empty="No standings available." />;
  const record = (team) =>
    `${team.wins ?? "—"}-${team.losses ?? "—"}${league === "nhl" ? `-${team.otLosses ?? "—"}` : ""}`;
  const metric = (team) =>
    league === "nhl"
      ? (team.points ?? "—")
      : team.winPercent == null
        ? "—"
        : Number(team.winPercent).toFixed(3);
  const hasMore = groups.some((group) => group.standings.length > 5);
  return (
    <>
      <div className="widget-conferences">
        {groups.map((group, index) => (
          <section key={group.id || index}>
            <h4>{group.name || "Standings"}</h4>
            <div className="dashboard-table-scroll">
              <table
                aria-label={`${group.name || league.toUpperCase()} standings`}
              >
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Team</th>
                    <th scope="col">Record</th>
                    <th scope="col">{league === "nhl" ? "PTS" : "PCT"}</th>
                  </tr>
                </thead>
                <tbody>
                  {group.standings
                    .slice(0, expanded ? undefined : 5)
                    .map((team, index) => (
                      <tr key={team.id || index}>
                        <td>{team.rank ?? index + 1}</td>
                        <td>
                          <TeamName team={team} league={league} />
                        </td>
                        <td>{record(team)}</td>
                        <td>{metric(team)}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </div>
      {hasMore && (
        <button
          type="button"
          className="dashboard-show-more"
          disabled={disabled}
          aria-expanded={expanded}
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? "Show fewer teams" : "Show all teams"}
        </button>
      )}
    </>
  );
}

export function PollPreview({ poll, league, disabled }) {
  const [expanded, setExpanded] = useState(false);
  const rows = poll?.ranks || [];
  if (!rows.length) return <State empty="No rankings available." />;
  return (
    <>
      <div className="widget-poll-table dashboard-table-scroll">
        <table
          aria-label={`${poll.shortName || poll.name || "College"} rankings`}
        >
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Team</th>
              <th scope="col">Record</th>
              <th scope="col">Points</th>
            </tr>
          </thead>
          <tbody>
            {rows.slice(0, expanded ? undefined : 5).map((row, index) => (
              <tr key={row.team?.id || row.current || index}>
                <td>{row.current ?? index + 1}</td>
                <td>
                  <TeamName team={row.team || {}} league={league} />
                </td>
                <td>{row.recordSummary || "—"}</td>
                <td>{row.points ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.length > 5 && (
        <button
          type="button"
          className="dashboard-show-more"
          disabled={disabled}
          aria-expanded={expanded}
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? "Show fewer teams" : `Show all ${rows.length} teams`}
        </button>
      )}
    </>
  );
}

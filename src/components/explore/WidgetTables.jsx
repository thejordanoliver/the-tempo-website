import { Link } from "../../app/router.jsx";
import { teamHref } from "../../data/teams/teams.js";
import TeamLogo from "../teams/TeamLogo.jsx";
import WidgetCarousel from "./WidgetCarousel.jsx";
import { State } from "../ui/State.jsx";

export function TeamSlide({ team, league, rank, record, metric }) {
  const color = /^#?[0-9a-f]{6}$/i.test(team.primaryColor || team.color || "")
    ? `#${(team.primaryColor || team.color).replace(/^#/, "")}`
    : "#888888";
  return (
    <Link
      className="widget-team-slide"
      style={{ "--team-color": color }}
      to={teamHref(league, team.id)}
    >
      {rank != null && <span className="widget-rank">#{rank}</span>}
      <TeamLogo team={team} league={league} />
      <strong>
        {team.shortName || team.name || team.fullName || team.code}
      </strong>
      <small>
        {[record, metric]
          .filter((value) => value != null && value !== "")
          .join(" · ") || league.toUpperCase()}
      </small>
    </Link>
  );
}
export function StandingsPreview({ data, league, widget, disabled }) {
  const groups = (data?.conferences || []).filter(
    (group) => group.standings?.length,
  );
  if (!groups.length)
    return (
      <State empty="No standings available. Check back when the league publishes its table." />
    );
  const record = (team) =>
    `${team.wins ?? 0}-${team.losses ?? 0}${league === "nhl" ? `-${team.otLosses ?? 0}` : ""}`;
  const metric = (team) =>
    league === "nhl"
      ? `${team.points ?? 0} PTS`
      : `${Number(team.winPercent ?? 0).toFixed(3)} PCT`;
  if (widget.size === "small") {
    const slides = groups.flatMap((group) => [
      { name: group.name },
      ...group.standings.map((team, index) => ({
        team,
        rank: team.rank ?? index + 1,
      })),
    ]);
    return (
      <WidgetCarousel
        items={slides}
        disabled={disabled}
        label="Standings"
        renderItem={(slide) =>
          slide.team ? (
            <TeamSlide
              {...slide}
              league={league}
              record={record(slide.team)}
              metric={metric(slide.team)}
            />
          ) : (
            <div className="widget-conference-slide">{slide.name}</div>
          )
        }
      />
    );
  }
  const limit = widget.size === "large" ? 10 : 3;
  return (
    <div className="widget-conferences">
      {groups.map((group, index) => (
        <section key={group.id || index}>
          <h4>{group.name}</h4>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Team</th>
                <th>Record</th>
                <th>{league === "nhl" ? "PTS" : "PCT"}</th>
              </tr>
            </thead>
            <tbody>
              {group.standings.slice(0, limit).map((team, index) => (
                <tr key={team.id}>
                  <td>{team.rank ?? index + 1}</td>
                  <td>
                    <Link to={teamHref(league, team.id)}>
                      <TeamLogo team={team} league={league} />
                      {team.code || team.shortName || team.name}
                    </Link>
                  </td>
                  <td>{record(team)}</td>
                  <td>{metric(team).split(" ")[0]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}
    </div>
  );
}
export function PollPreview({ poll, league, widget, disabled }) {
  const rows = poll?.ranks || [];
  if (!rows.length)
    return <State empty="College rankings are not available right now." />;
  if (widget.size === "small")
    return (
      <WidgetCarousel
        items={rows}
        label="College Polls"
        autoPlay={widget.collegePollAutoPlay !== false}
        disabled={disabled}
        renderItem={(row) => (
          <TeamSlide
            team={row.team || {}}
            league={league}
            rank={row.current}
            record={row.recordSummary}
            metric={row.points == null ? null : `${row.points} PTS`}
          />
        )}
      />
    );
  return (
    <div className="widget-poll-table">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Team</th>
            <th>Record</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {rows.slice(0, widget.size === "large" ? 25 : 5).map((row) => (
            <tr key={row.team?.id || row.current}>
              <td>{row.current}</td>
              <td>
                <Link to={teamHref(league, row.team?.id)}>
                  <TeamLogo team={row.team || {}} league={league} />
                  {row.team?.shortName || row.team?.name}
                </Link>
              </td>
              <td>{row.recordSummary}</td>
              <td>{row.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

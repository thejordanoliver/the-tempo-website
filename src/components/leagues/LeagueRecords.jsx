import { awardName } from "../../data/leagues/awardNames.js";
import { readableDate } from "../../utils/dates.js";
import ForumPosts from "../forums/ForumPosts.jsx";
import UFCChampions from "../mma/UFCChampions.jsx";
import { Table } from "../ui/Table.jsx";
import DraftList from "./DraftList.jsx";
import Empty from "./EmptyLeagueState.jsx";
import StandingsName from "./StandingsName.jsx";
const list = (value) => (Array.isArray(value) ? value : []);
export function LeagueRecords({ data, tab, league }) {
  if (tab === "transactions") {
    const rows = list(data?.transactions);
    return rows.length ? (
      <div className="league-feed">
        {rows.map((item, index) => (
          <article key={index}>
            <p className="small">
              {readableDate(item.date)} · {item.team?.name}
            </p>
            <p>{item.description}</p>
          </article>
        ))}
      </div>
    ) : (
      <Empty>No transactions for this selection.</Empty>
    );
  }
  if (tab === "draft") {
    const rows = list(data?.picks);
    return rows.length ? (
      <>
        <p>
          {data.displayName} · {data.status?.label}
        </p>
        <DraftList data={data} league={league} />
      </>
    ) : (
      <Empty>Draft selections are not available for this year.</Empty>
    );
  }
  if (tab === "recruits") {
    const rows = list(data);
    return rows.length ? (
      <Table
        headers={[
          "Rank",
          "Player",
          "Position",
          "Stars",
          "School",
          "Commitment",
        ]}
        rows={rows.map((player) => [
          player.national_rank,
          player.name,
          player.position,
          player.stars,
          player.high_school,
          player.committed_team_name || "Uncommitted",
        ])}
      />
    ) : (
      <Empty>No recruits available for this class.</Empty>
    );
  }
  if (tab === "awards") {
    const groups = Object.entries(data || {}).filter(
      ([, rows]) => Array.isArray(rows) && rows.length,
    );
    return groups.length ? (
      <>
        {groups.map(([category, rows]) => (
          <section
            className="league-table-section league-awards-section"
            key={category}
          >
            <h3>{awardName(league, category)}</h3>
            <Table
              headers={["Season", "Winner"]}
              rows={rows.map((row) => [
                row.season,
                row.player_name || row.coach,
              ])}
            />
          </section>
        ))}
      </>
    ) : (
      <Empty>No awards recorded for this season.</Empty>
    );
  }
  if (tab === "champions") return <UFCChampions data={data} />;
  if (tab === "rankings") {
    const raw = data?.rankings;
    const groups = Array.isArray(raw) ? raw : list(raw?.all);
    return groups.some((group) => list(group.ranks).length) ? (
      <>
        {groups.map((group, index) => (
          <section className="league-table-section" key={index}>
            <h3>{group.shortName || group.name || "Rankings"}</h3>
            <Table
              headers={["Rank", "Team", "Record", "Points"]}
              rows={list(group.ranks).map((row) => [
                row.current,
                <StandingsName team={row.team || {}} league={league} />,
                row.recordSummary,
                row.points,
              ])}
            />
          </section>
        ))}
      </>
    ) : (
      <Empty>No rankings available right now.</Empty>
    );
  }
  if (tab === "forum") {
    const posts = list(data?.posts);
    return posts.length ? (
      <ForumPosts posts={posts} />
    ) : (
      <Empty>No league conversations yet.</Empty>
    );
  }
  return <Empty />;
}

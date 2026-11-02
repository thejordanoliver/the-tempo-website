import CollegeRankings from "./CollegeRankings.jsx";
import ForumPosts from "./ForumPosts.jsx";
import { teamHref, hasTeamLeague } from "../teams.js";
import { Image, State, Table } from "../components.jsx";
import { Link } from "../router.jsx";
import GameCard from "./GameCard.jsx";
import TeamLogo from "./TeamLogo.jsx";
import { leagueSports, scoreGroups, playoffGroups } from "../leagues.js";

const list = (value) => (Array.isArray(value) ? value : []);
const text = (value) =>
  typeof value === "string" || typeof value === "number" ? value : "—";
export function readableDate(value) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.valueOf())
    ? ""
    : date.toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
}
const Empty = ({ children = "No results available for this selection." }) => (
  <State empty={children} />
);
export function LeagueNews({ data }) {
  const articles = list(data?.articles);
  if (!articles.length)
    return <Empty>No league stories available right now.</Empty>;
  return (
    <div className="home-articles">
      {articles.map((article, index) => (
        <article
          className="news-card"
          key={article.keyId || article.id || index}
        >
          <Image src={article.image} loading="lazy" />
          <div className="news-card-body">
            <p className="small">{readableDate(article.published)}</p>
            <h3>
              <Link to={`/article/?id=${encodeURIComponent(article.id)}`}>
                {article.headline || "Read story"}
              </Link>
            </h3>
            <p>{article.description}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
function Participant({ name, score, winner }) {
  return (
    <div className={`league-participant${winner ? " league-winner" : ""}`}>
      <span>{text(name)}</span>
      <strong>{text(score)}</strong>
    </div>
  );
}
function EventCard({ game, sport }) {
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
      {sport === "tennis" &&
        list(game.competitors).map((player, index) => (
          <Participant
            key={player.id || index}
            name={player.displayName}
            score={
              list(player.linescores).length
                ? player.linescores
                    .map((set) => set.displayValue ?? set.value ?? "—")
                    .join("  ")
                : player.score
            }
            winner={player.winner}
          />
        ))}
      {sport === "mma" &&
        (list(game.fights).length ? game.fights : [game.mainEvent || game]).map(
          (fight, index) => (
            <div className="league-fight" key={fight.id || index}>
              <p className="small">{fight.weightClass || fight.cardSegment}</p>
              {list(fight.competitors).map((fighter, i) => (
                <Participant
                  key={fighter.id || i}
                  name={fighter.displayName || fighter.fullName || fighter.name}
                  score={fighter.record}
                  winner={fighter.winner}
                />
              ))}
              <p className="small">
                {fight.method ||
                  fight.status?.shortDetail ||
                  fight.status?.description}
              </p>
            </div>
          ),
        )}
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
export function LeagueScores({ data, league, playoffs = false }) {
  const sport = leagueSports[league];
  const groups = (
    playoffs ? playoffGroups(data) : scoreGroups(data, sport)
  ).filter((group) => group.games.length);
  if (!groups.length)
    return (
      <Empty>
        {playoffs
          ? "No postseason games available for this season."
          : "No games or events scheduled for this selection."}
      </Empty>
    );
  return (
    <div className="league-score-groups">
      {groups.map((group, index) => (
        <section key={index}>
          {group.label && <h3 className="league-group-title">{group.label}</h3>}
          <div
            className={
              ["mma", "racing", "tennis"].includes(sport)
                ? "league-events"
                : "home-games"
            }
          >
            {group.games.map((game, i) => {
              if (["mma", "racing", "tennis"].includes(sport))
                return (
                  <EventCard key={game.id || i} game={game} sport={sport} />
                );
              // Tournament responses use a normalized teams array rather than home/away.
              const teams = list(game.teams);
              const view = teams.length
                ? {
                    ...game,
                    home: teams.find((team) => team.homeAway === "home"),
                    away: teams.find((team) => team.homeAway === "away"),
                  }
                : game;
              return (
                <GameCard key={game.id || i} game={view} league={league} />
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
function StandingsName({ team, league }) {
  return (
    <span className="league-team-name">
      <TeamLogo team={team} league={league} />
      <span>
        {team.id != null && hasTeamLeague(league) ? (
          <Link to={teamHref(league, team.id)}>
            {team.name || team.shortName || team.code || "Team"}
          </Link>
        ) : (
          team.name || team.shortName || team.code || "Team"
        )}
      </span>
    </span>
  );
}
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
export function LeagueStandings({ data, league }) {
  return <><StandingsTables data={data} league={league} /><CollegeRankings league={league} /></>;
}
function StandingsTables({ data, league }) {
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
export function LeagueStats({ data }) {
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
                player.full_name || player.short_name,
                player.stat_value,
              ])}
            />
          </section>
        ))}
      </div>
    </>
  );
}
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
        <Table
          headers={["Pick", "Round", "Player", "Team", "College"]}
          rows={rows.map((pick) => [
            pick.overall ?? pick.pick,
            pick.round,
            pick.athlete?.name || "Selection pending",
            list(data.teams).find(
              (team) => String(team.id) === String(pick.teamId),
            )?.name,
            pick.athlete?.college,
          ])}
        />
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
          <section className="league-table-section" key={category}>
            <h3>{category.toUpperCase()}</h3>
            <Table
              headers={["Season", "Winner", "Team / school", "Summary"]}
              rows={rows.map((row) => [
                row.season,
                row.player_name || row.coach,
                row.award_team?.name || row.school,
                row.summary,
              ])}
            />
          </section>
        ))}
      </>
    ) : (
      <Empty>No awards recorded for this season.</Empty>
    );
  }
  if (tab === "champions") {
    const groups = Object.entries(data?.data || {}).filter(
      ([, rows]) => list(rows).length,
    );
    return groups.length ? (
      <div className="league-stats-grid">
        {groups.map(([division, rows]) => (
          <section className="league-event" key={division}>
            <h3>{division.replaceAll("-", " ")}</h3>
            {rows.map((row, index) => (
              <div key={row.accolade_id || index}>
                <p>
                  <strong>
                    {row.fighter?.full_name ||
                      row.fighter?.display_name ||
                      row.fighter?.name}
                  </strong>
                </p>
                <p className="small">{row.accolade_name}</p>
              </div>
            ))}
          </section>
        ))}
      </div>
    ) : (
      <Empty>No champions available right now.</Empty>
    );
  }
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

import { footballConferences } from "../../data/leagues/footballConferences.js";
import { standingsPath } from "../../data/leagues/leagues.js";
import { useResource } from "../../hooks/useResource.js";
import { State } from "../ui/State.jsx";
import LeagueControlSlot from "./LeagueControlSlot.jsx";
import { LeagueScores } from "./LeagueScores.jsx";
const list = (value) => (Array.isArray(value) ? value : []);
const rows = (group) => [
  ...list(group.teams),
  ...list(group.standings),
  ...list(group.divisions).flatMap(rows),
  ...list(group.children).flatMap(rows),
];
export default function FootballScores({
  data,
  league,
  season,
  conference,
  onChange,
}) {
  const resource = useResource(
    `${standingsPath(league)}?season=${season}&seasontype=2`,
  );
  const groups =
    league === "cfb"
      ? footballConferences
      : list(resource.data?.conferences).length
        ? resource.data.conferences
        : list(resource.data?.groups);
  const selected = groups.find(
    (group, index) => String(group.id ?? index) === conference,
  );
  const ids = new Set(
    selected ? rows(selected).map((row) => String(row.team?.id ?? row.id)) : [],
  );
  const matches = (game) =>
    [game.home, game.away].some(
      (team) => team?.id != null && ids.has(String(team.id)),
    );
  const filtered =
    selected && league !== "cfb"
      ? {
          ...data,
          games: list(data?.games).filter(matches),
          groups: list(data?.groups).map((group) => ({
            ...group,
            games: list(group.games).filter(matches),
          })),
        }
      : data;
  return (
    <>
      <LeagueControlSlot>
        <label>
          Conference
          <select
            value={conference}
            disabled={
              league !== "cfb" && (resource.loading || Boolean(resource.error))
            }
            onChange={(event) => onChange(event.target.value)}
          >
            <option value="">All conferences</option>
            {groups.map((group, index) => (
              <option key={group.id ?? index} value={group.id ?? index}>
                {group.shortName || group.name || "Conference"}
              </option>
            ))}
          </select>
        </label>
      </LeagueControlSlot>
      {league !== "cfb" && resource.error && (
        <State error="Conference filters are unavailable. Showing all games." />
      )}
      <LeagueScores data={filtered} league={league} />
    </>
  );
}

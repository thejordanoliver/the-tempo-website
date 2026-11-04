import { useEffect, useRef, useState } from "react";
import { Link } from "../../app/router.jsx";
import { favoriteLeagues } from "../../data/leagues/favoriteLeagues.js";
import { STANDINGS_LEAGUES, GAME_LEAGUES } from "../../data/explore/explore.js";
import { standingsPath, defaultSeason } from "../../data/leagues/leagues.js";
import { useResource } from "../../hooks/useResource.js";
import useLiveSportsSubscription from "../../hooks/useLiveSportsSubscription.js";
import { TeamSlide, StandingsPreview, PollPreview } from "./WidgetTables.jsx";
import { favoriteTeamAssets } from "../../data/teams/favoriteTeamAssets.js";
import { hasTeamLeague } from "../../data/teams/teams.js";
import GameCard from "../games/GameCard.jsx";
import Icon from "../ui/Icon.jsx";
import { State } from "../ui/State.jsx";
import PostComposer from "./PostComposer.jsx";

function Resource({ path, children, refreshVersion = 0 }) {
  const [version, setVersion] = useState(0);
  const resource = useResource(path, version + refreshVersion);
  return (
    <>
      <State {...resource} onRetry={() => setVersion((value) => value + 1)} />
      {!resource.loading && !resource.error && children(resource.data)}
    </>
  );
}
function FavoriteGames({ widget, disabled }) {
  const [version, setVersion] = useState(0);
  return (
    <>
      <div className="dashboard-content-toolbar">
        <button
          type="button"
          className="explore-text-button"
          disabled={disabled}
          onClick={() => setVersion((value) => value + 1)}
        >
          <Icon name="refresh" size={16} />
          Refresh scores
        </button>
      </div>
      <Resource
        key={version}
        path={`/api/widgets/explore?${new URLSearchParams({ leagues: (widget.favoriteGameLeagues || GAME_LEAGUES).join(","), refresh: String(version ? 1 : 0) })}`}
      >
        {(data) => <LiveFavoriteGames data={data} disabled={disabled} />}
      </Resource>
    </>
  );
}
function LiveFavoriteGames({ data, disabled }) {
  const games = Array.isArray(data?.games) ? data.games : [];
  const [expanded, setExpanded] = useState(false);
  const [snapshots, setSnapshots] = useState({});
  const visibleGames = expanded ? games : games.slice(0, 6);
  useLiveSportsSubscription({
    enabled: visibleGames.length > 0,
    subscriptions: visibleGames.map((item) => ({
      kind: "game",
      payload: { sport: item.sport, league: item.league, gameId: item.gameId },
    })),
    onUpdate(payload, envelope) {
      if (payload?.score)
        setSnapshots((current) => ({
          ...current,
          [`${envelope.league}:${envelope.gameId}`]: payload.score,
        }));
    },
  });
  return (
    <>
      {data?.failures?.length > 0 && (
        <p role="status" className="small">
          Some schedules are unavailable. Try refreshing.
        </p>
      )}
      {!games.length ? (
        <State empty="Add favorite teams in the Tempo app to see their games." />
      ) : (
        <>
          <div className="explore-game-list">
            {visibleGames.map((item) => (
              <GameCard
                key={item.key || `${item.league}:${item.gameId}`}
                league={item.league}
                game={snapshots[`${item.league}:${item.gameId}`] || item.game}
              />
            ))}
          </div>
          {games.length > 6 && (
            <button
              type="button"
              className="dashboard-show-more"
              disabled={disabled}
              aria-expanded={expanded}
              onClick={() => setExpanded((value) => !value)}
            >
              {expanded ? "Show fewer games" : `Show all ${games.length} games`}
            </button>
          )}
        </>
      )}
    </>
  );
}
function FavoriteTeams() {
  return (
    <Resource path="/api/users/me/favorites">
      {(data) => {
        const teams = (data?.favoriteTeams || [])
          .filter((team) => hasTeamLeague(team.league))
          .map((team) => ({
            ...team,
            ...favoriteTeamAssets[`${team.league}:${team.id}`],
          }));
        return teams.length ? (
          <div className="dashboard-teams-list">
            {teams.map((team) => (
              <TeamSlide
                key={`${team.league}:${team.id}`}
                team={team}
                league={team.league}
              />
            ))}
          </div>
        ) : (
          <State empty="Add favorite teams in the Tempo app." />
        );
      }}
    </Resource>
  );
}
function MyPicks({ disabled }) {
  const [version, setVersion] = useState(0);
  return (
    <>
      <div className="dashboard-content-toolbar">
        <button
          type="button"
          className="explore-text-button"
          aria-label="Refresh your picks"
          disabled={disabled}
          onClick={() => setVersion((value) => value + 1)}
        >
          <Icon name="refresh" size={16} />
          Refresh
        </button>
      </div>
      <Resource
        key={version}
        refreshVersion={version}
        path="/api/predictions/me/picks"
      >
        {(data) => <PicksSummary data={data} disabled={disabled} />}
      </Resource>
    </>
  );
}
function PicksSummary({ data, disabled }) {
  const [expanded, setExpanded] = useState(false);
  const record = data?.record || {};
  const picks = data?.picks || [];
  if (!picks.length)
    return <State empty="Pick a winner before a game to track your record." />;
  return (
    <>
      <div className="explore-pick-record">
        <div>
          <strong>
            {record.correct ?? 0}/{record.graded ?? 0}
          </strong>
          <span>Record</span>
        </div>
        <div>
          <strong>
            {record.accuracy == null ? "—" : `${record.accuracy}%`}
          </strong>
          <span>Accuracy</span>
        </div>
        <div>
          <strong>{record.pending ?? 0}</strong>
          <span>Pending</span>
        </div>
      </div>
      <ul className="explore-picks">
        {picks.slice(0, expanded ? undefined : 5).map((pick) => (
          <li key={`${pick.sport}:${pick.league}:${pick.gameId}`}>
            <Link
              to={
                pick.sport === "mma"
                  ? "/league/?league=ufc"
                  : `/game/?${new URLSearchParams({ league: pick.league, id: pick.gameId })}`
              }
            >
              <strong>Picked {pick.pickedShortName || pick.pickedName}</strong>
              <span>
                {pick.league.toUpperCase()} · {pick.matchup}
              </span>
              <small data-outcome={pick.outcome}>
                {pick.outcome === "void" ? "Not scored" : pick.outcome}
              </small>
            </Link>
          </li>
        ))}
      </ul>
      {picks.length > 5 && (
        <button
          type="button"
          className="dashboard-show-more"
          disabled={disabled}
          aria-expanded={expanded}
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? "Show fewer picks" : `Show all ${picks.length} picks`}
        </button>
      )}
    </>
  );
}
function CreatePost({ disabled, userId }) {
  const [open, setOpen] = useState(false);
  const dialog = useRef(null);
  useEffect(() => {
    if (open) dialog.current?.showModal();
  }, [open]);
  const content = (
    <>
      <Icon name="create" size={24} />
      <b>
        Write a post <Icon name="arrow-forward" size={16} />
      </b>
    </>
  );
  if (!userId)
    return (
      <Link className="widget-create-post" to="/login/">
        {content}
      </Link>
    );
  return (
    <>
      <button
        className="widget-create-post"
        type="button"
        disabled={disabled}
        onClick={() => setOpen(true)}
      >
        {content}
      </button>
      {open && (
        <dialog
          ref={dialog}
          onClose={() => setOpen(false)}
          className="widget-composer-dialog"
          aria-label="Create a post"
        >
          <button
            type="button"
            className="explore-text-button"
            onClick={() => setOpen(false)}
            autoFocus
          >
            Close
          </button>
          <PostComposer />
        </dialog>
      )}
    </>
  );
}
function CollegePoll({ widget, change, disabled }) {
  const league = widget.collegePollLeague || "cfb",
    pollType = widget.collegePollType || "ap";
  return (
    <>
      <div className="explore-widget-filters">
        <label>
          League
          <select
            disabled={disabled}
            value={league}
            onChange={(event) =>
              change({
                collegePollLeague: event.target.value,
                collegePollType: "ap",
              })
            }
          >
            {["cfb", "mcbb"].map((id) => (
              <option key={id} value={id}>
                {favoriteLeagues[id].label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Poll
          <select
            disabled={disabled}
            value={pollType}
            onChange={(event) =>
              change({ collegePollType: event.target.value })
            }
          >
            {Object.entries(
              league === "cfb"
                ? {
                    ap: "AP Top 25",
                    coaches: "Coaches",
                    cfp: "CFP",
                    fcs: "FCS",
                  }
                : { ap: "AP Top 25", coaches: "Coaches" },
            ).map(([id, title]) => (
              <option key={id} value={id}>
                {title}
              </option>
            ))}
          </select>
        </label>
        <Link
          className="dashboard-section-link"
          to={`/league/?league=${league}`}
        >
          View league <Icon name="arrow-forward" size={16} />
        </Link>
      </div>
      <Resource key={league} path={`/api/standings/${league}/rankings`}>
        {(data) => {
          const raw = data?.rankings;
          const polls = Array.isArray(raw)
            ? raw
            : Array.isArray(raw?.all)
              ? raw.all
              : [];
          const poll = polls.find((poll) => {
            const name =
              `${poll.type || ""} ${poll.name || ""} ${poll.shortName || ""}`.toLowerCase();
            return pollType === "ap"
              ? /\bap\b|associated press/.test(name)
              : pollType === "coaches"
                ? /coaches|afca|usa/.test(name)
                : pollType === "cfp"
                  ? /cfp|playoff/.test(name)
                  : /fcs/.test(name);
          });
          return (
            <PollPreview
              key={`${league}:${pollType}`}
              poll={poll}
              league={league}
              disabled={disabled}
            />
          );
        }}
      </Resource>
    </>
  );
}
export default function ExploreWidgetContent({
  widget,
  userId,
  change,
  disabled,
}) {
  if (
    ["favorite_games", "favorite_teams", "my_picks"].includes(widget.type) &&
    !userId
  ) {
    const copy = {
      favorite_games: "Sign in to see your teams’ games.",
      favorite_teams: "Sign in to see your favorite teams.",
      my_picks: "Sign in to track your picks.",
    };
    return (
      <div className="dashboard-personal-empty">
        <Icon
          name={
            widget.type === "favorite_teams"
              ? "heart"
              : widget.type === "my_picks"
                ? "trending-up"
                : "star"
          }
          size={28}
        />
        <p>{copy[widget.type]}</p>
      </div>
    );
  }
  switch (widget.type) {
    case "favorite_games":
      return (
        <FavoriteGames
          key={widget.favoriteGameLeagues?.join(",")}
          widget={widget}
          disabled={disabled}
        />
      );
    case "favorite_teams":
      return <FavoriteTeams />;
    case "my_picks":
      return <MyPicks disabled={disabled} />;
    case "create_post":
      return <CreatePost disabled={disabled} userId={userId} />;
    case "standings": {
      const league = widget.standingsLeague || "nba";
      return (
        <>
          <div className="explore-widget-filters">
            <label className="explore-widget-filter">
              League
              <select
                disabled={disabled}
                value={league}
                onChange={(event) =>
                  change({ standingsLeague: event.target.value })
                }
              >
                {STANDINGS_LEAGUES.map((id) => (
                  <option key={id} value={id}>
                    {favoriteLeagues[id].label}
                  </option>
                ))}
              </select>
            </label>
            <Link
              className="dashboard-section-link"
              to={`/league/?league=${league}`}
            >
              View league <Icon name="arrow-forward" size={16} />
            </Link>
          </div>
          <Resource
            key={league}
            path={`${standingsPath(league)}?season=${defaultSeason(league)}&seasontype=2`}
          >
            {(data) => (
              <StandingsPreview
                data={data}
                league={league}
                disabled={disabled}
              />
            )}
          </Resource>
        </>
      );
    }
    case "college_polls":
      return (
        <CollegePoll widget={widget} change={change} disabled={disabled} />
      );
    default:
      return null;
  }
}

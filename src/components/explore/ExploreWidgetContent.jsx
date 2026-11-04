import Icon from "../ui/Icon.jsx";
import { useEffect, useRef, useState } from "react";
import { Link } from "../../app/router.jsx";
import { favoriteLeagues } from "../../data/leagues/favoriteLeagues.js";
import { STANDINGS_LEAGUES, GAME_LEAGUES } from "../../data/explore/explore.js";
import { standingsPath, defaultSeason } from "../../data/leagues/leagues.js";
import { useResource } from "../../hooks/useResource.js";
import useLiveSportsSubscription from "../../hooks/useLiveSportsSubscription.js";
import WidgetCarousel from "./WidgetCarousel.jsx";
import { TeamSlide, StandingsPreview, PollPreview } from "./WidgetTables.jsx";
import { favoriteTeamAssets } from "../../data/teams/favoriteTeamAssets.js";
import { hasTeamLeague } from "../../data/teams/teams.js";
import GameCard from "../games/GameCard.jsx";
import { State } from "../ui/State.jsx";
import PostComposer from "./PostComposer.jsx";

function Resource({ path, children }) {
  const [version, setVersion] = useState(0);
  const resource = useResource(path, version);
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
    <Resource
      key={version}
      path={`/api/widgets/explore?${new URLSearchParams({ leagues: (widget.favoriteGameLeagues || GAME_LEAGUES).join(","), refresh: String(version ? 1 : 0) })}`}
    >
      {(data) => (
        <>
          <LiveFavoriteGames data={data} widget={widget} disabled={disabled} />
          <button
            type="button"
            className="explore-text-button"
            onClick={() => setVersion((value) => value + 1)}
          >
            Refresh scores
          </button>
        </>
      )}
    </Resource>
  );
}
function LiveFavoriteGames({ data, widget, disabled }) {
  const games = Array.isArray(data?.games) ? data.games : [];
  const [snapshots, setSnapshots] = useState({});
  useLiveSportsSubscription({
    enabled: games.length > 0,
    subscriptions: games.slice(0, 10).map((item) => ({
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
          Some team schedules are unavailable. Refresh to try again.
        </p>
      )}
      {!games.length ? (
        <State empty="Add favorite teams in the Tempo app to see their games here." />
      ) : (
        <WidgetCarousel
          items={games}
          label="Favorite Games"
          autoPlay={widget.favoriteGamesAutoPlay !== false}
          disabled={disabled}
          renderItem={(item) => (
            <GameCard
              league={item.league}
              game={snapshots[`${item.league}:${item.gameId}`] || item.game}
            />
          )}
        />
      )}
    </>
  );
}
function FavoriteTeams({ widget, disabled }) {
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
          <WidgetCarousel
            items={teams}
            label="Favorite Teams"
            autoPlay={widget.favoriteTeamsAutoPlay !== false}
            disabled={disabled}
            renderItem={(team) => (
              <TeamSlide team={team} league={team.league} />
            )}
          />
        ) : (
          <State empty="Add favorite teams to show shortcuts here." />
        );
      }}
    </Resource>
  );
}
function MyPicks({ widget }) {
  const [version, setVersion] = useState(0);
  return (
    <>
      <button
        type="button"
        className="explore-picks-refresh"
        aria-label="Refresh your picks"
        onClick={() => setVersion((value) => value + 1)}
      >
        <Icon name="refresh" size={18} />
      </button>
      <Resource key={version} path="/api/predictions/me/picks">
        {(data) => {
          const record = data?.record || {};
          if (!data?.picks?.length)
            return (
              <State empty="Pick a winner before a game starts to track your predictions here." />
            );
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
                {widget.size !== "small" && (
                  <div>
                    <strong>{record.pending ?? 0}</strong>
                    <span>Pending</span>
                  </div>
                )}
              </div>
              <ul className="explore-picks">
                {data.picks
                  .slice(
                    0,
                    widget.size === "small"
                      ? 1
                      : widget.size === "large"
                        ? 5
                        : 2,
                  )
                  .map((pick) => (
                    <li key={`${pick.sport}:${pick.league}:${pick.gameId}`}>
                      <Link
                        to={
                          pick.sport === "mma"
                            ? "/league/?league=ufc"
                            : `/game/?${new URLSearchParams({ league: pick.league, id: pick.gameId })}`
                        }
                      >
                        <strong>
                          You picked {pick.pickedShortName || pick.pickedName}
                        </strong>
                        {widget.size === "large" && (
                          <span>
                            {pick.league.toUpperCase()} · {pick.matchup}
                          </span>
                        )}
                        <small data-outcome={pick.outcome}>
                          {pick.outcome === "void"
                            ? "Not scored"
                            : pick.outcome}
                        </small>
                      </Link>
                    </li>
                  ))}
              </ul>
            </>
          );
        }}
      </Resource>
    </>
  );
}
function CreatePost({ disabled, userId }) {
  const [open, setOpen] = useState(false);
  const dialog = useRef(null);
  useEffect(() => {
    if (open) dialog.current?.showModal();
  }, [open]);
  if (!userId)
    return (
      <Link className="widget-create-post" to="/login/">
        <Icon name="create" size={24} />
        <strong>Create Post</strong>
        <span>Share a take, start a discussion, or post an update.</span>
        <b>Create →</b>
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
        <Icon name="create" size={24} />
        <strong>Create Post</strong>
        <span>Share a take, start a discussion, or post an update.</span>
        <b>Create →</b>
      </button>
      {open && (
        <dialog
          ref={dialog}
          onClose={() => setOpen(false)}
          className="widget-composer-dialog"
          aria-label="Create a post"
        >
          <button type="button" onClick={() => setOpen(false)} autoFocus>
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
              poll={poll}
              league={league}
              widget={widget}
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
  )
    return (
      <div className="explore-sign-in">
        <p>
          Sign in to use {widget.title.toLowerCase()} and sync your board with
          the Tempo app.
        </p>
        <Link to="/login/">Sign in</Link>
      </div>
    );
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
      return <FavoriteTeams widget={widget} disabled={disabled} />;
    case "my_picks":
      return <MyPicks widget={widget} />;
    case "create_post":
      return <CreatePost disabled={disabled} userId={userId} />;
    case "standings": {
      const league = widget.standingsLeague || "nba";
      return (
        <>
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
          <Resource
            key={league}
            path={`${standingsPath(league)}?season=${defaultSeason(league)}&seasontype=2`}
          >
            {(data) => (
              <StandingsPreview
                data={data}
                league={league}
                widget={widget}
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

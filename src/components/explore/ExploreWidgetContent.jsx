import { useState } from "react";
import { Link } from "../../app/router.jsx";
import { favoriteLeagues } from "../../data/leagues/favoriteLeagues.js";
import { STANDINGS_LEAGUES } from "../../data/explore/explore.js";
import { standingsPath, defaultSeason } from "../../data/leagues/leagues.js";
import { useResource } from "../../hooks/useResource.js";
import useLiveSportsSubscription from "../../hooks/useLiveSportsSubscription.js";
import FavoritesScroll from "../home/FavoritesScroll.jsx";
import GameCard from "../games/GameCard.jsx";
import { LeagueStandings } from "../leagues/LeagueStandings.jsx";
import { LeagueRecords } from "../leagues/LeagueRecords.jsx";
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
function FavoriteGames({ widget }) {
  const [version, setVersion] = useState(0);
  return (
    <Resource
      key={version}
      path={`/api/widgets/explore?${new URLSearchParams({ leagues: (widget.favoriteGameLeagues || []).join(","), refresh: String(version ? 1 : 0) })}`}
    >
      {(data) => (
        <>
          <LiveFavoriteGames data={data} />
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
function LiveFavoriteGames({ data }) {
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
        <div className="explore-game-list">
          {games.slice(0, 10).map((item) => (
            <GameCard
              key={item.key}
              league={item.league}
              game={snapshots[`${item.league}:${item.gameId}`] || item.game}
            />
          ))}
        </div>
      )}
    </>
  );
}
function FavoriteTeams() {
  return (
    <Resource path="/api/users/me/favorites">
      {(teams) => (
        <Resource path="/api/users/me/favorite-sports">
          {(sports) => (
            <FavoritesScroll
              teams={teams?.favoriteTeams || []}
              leagues={sports?.favoriteSports || []}
            />
          )}
        </Resource>
      )}
    </Resource>
  );
}
function MyPicks() {
  return (
    <Resource path="/api/predictions/me/picks">
      {(data) => (
        <>
          <div className="explore-pick-record">
            <strong>
              {data?.record?.correct ?? 0}/{data?.record?.graded ?? 0}
            </strong>
            <span>Correct picks</span>
          </div>
          {!data?.picks?.length ? (
            <State empty="Make picks before games in Tempo to track your record here." />
          ) : (
            <ul className="explore-picks">
              {data.picks.slice(0, 10).map((pick) => (
                <li key={`${pick.league}:${pick.gameId}`}>
                  <Link
                    to={
                      pick.sport === "mma"
                        ? `/league/?league=ufc`
                        : `/game/?${new URLSearchParams({ league: pick.league, id: pick.gameId })}`
                    }
                  >
                    <strong>{pick.pickedShortName || pick.pickedName}</strong>
                    <span>{pick.matchup}</span>
                    <small>{pick.outcome}</small>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </Resource>
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
            <LeagueRecords
              league={league}
              tab="rankings"
              data={{ rankings: poll ? [poll] : [] }}
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
    ["favorite_games", "favorite_teams", "my_picks", "create_post"].includes(
      widget.type,
    ) &&
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
        />
      );
    case "favorite_teams":
      return <FavoriteTeams />;
    case "my_picks":
      return <MyPicks />;
    case "create_post":
      return <PostComposer />;
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
            {(data) => <LeagueStandings data={data} league={league} />}
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

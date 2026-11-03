import { useEffect, useState } from "react";

import { Link } from "../app/router.jsx";
import FavoritesScroll from "../components/home/FavoritesScroll.jsx";
import HomeScoreSections from "../components/home/HomeScoreSections.jsx";
import GameDatePicker from "../components/ui/GameDatePicker.jsx";
import { Image } from "../components/ui/Image.jsx";
import { State } from "../components/ui/State.jsx";
import { leagueSports } from "../data/leagues/leagues.js";
import useHomeScores from "../hooks/useHomeScores.js";
import { useResource } from "../hooks/useResource.js";
import { localDate } from "../utils/dates.js";
import { groupHomeScores } from "../utils/homeScores.js";
const endpoints = {
  nba: "basketball/nba",
  nfl: "football/nfl",
  cfb: "football/cfb",
  mlb: "baseball",
  nhl: "hockey",
};
export default function Home({ user, onLogout }) {
  const [league, setLeague] = useState(() => {
      const saved = globalThis.history?.state?.tempoHome?.league;
      return Object.hasOwn(endpoints, saved) ? saved : "nba";
    }),
    [date, setDate] = useState(() => {
      const saved = globalThis.history?.state?.tempoHome?.date;
      return /^\d{4}-\d{2}-\d{2}$/.test(saved || "") ? saved : localDate();
    }),
    [selectedTeam, setSelectedTeam] = useState(
      () => globalThis.history?.state?.tempoHome?.team || null,
    ),
    [favoritesVersion, setFavoritesVersion] = useState(0),
    [gamesVersion, setGamesVersion] = useState(0),
    [newsVersion, setNewsVersion] = useState(0);
  useEffect(() => {
    history.replaceState(
      { ...history.state, tempoHome: { date, league, team: selectedTeam } },
      "",
    );
  }, [date, league, selectedTeam]);
  const favoriteSports = useResource(
    "/api/users/me/favorite-sports",
    favoritesVersion,
  );
  const savedLeagues = Array.isArray(favoriteSports.data?.favoriteSports)
    ? [
        ...new Set(
          favoriteSports.data.favoriteSports.filter(
            (key) => typeof key === "string",
          ),
        ),
      ]
    : [];
  const favorites = useResource("/api/users/me/favorites", favoritesVersion);
  const favoriteTeams = Array.isArray(favorites.data?.favoriteTeams)
    ? favorites.data.favoriteTeams.filter(
        (t) => t && t.id != null && typeof t.league === "string",
      )
    : [];
  const games = useHomeScores(
    favoriteTeams,
    savedLeagues,
    date,
    gamesVersion,
    !favorites.loading && !favoriteSports.loading,
  );
  const feed = useResource(
    "/api/feed/for-you?newsLimit=12&postsLimit=1",
    newsVersion,
  );
  const gameList = selectedTeam
    ? games.items.filter(({ game, league }) =>
        [game.home, game.away].some(
          (team) => team?.id != null && `${league}:${team.id}` === selectedTeam,
        ),
      )
    : games.items;
  const articles = Array.isArray(feed.data?.articles) ? feed.data.articles : [];
  return (
    <section className="home-screen">
      <header className="home-heading">
        <div>
          <h1>Home</h1>
          <p>Welcome back, {user.fullName || user.username || "Tempo fan"}.</p>
        </div>
        <button className="tempo-button outline" onClick={onLogout}>
          Sign out
        </button>
      </header>
      <FavoritesScroll
        teams={favoriteTeams}
        leagues={savedLeagues}
        loading={favorites.loading || favoriteSports.loading}
        error={favorites.error || favoriteSports.error}
        onRetry={() => setFavoritesVersion((v) => v + 1)}
        selected={selectedTeam}
        supportedLeagues={Object.keys(leagueSports)}
        onSelect={(team) => {
          setSelectedTeam(
            team && selectedTeam !== `${team.league}:${team.id}`
              ? `${team.league}:${team.id}`
              : null,
          );
          if (team) setLeague(team.league);
        }}
      />
      <section aria-labelledby="games-title">
        <div className="home-section-heading">
          <h2 id="games-title">Scores</h2>
        </div>
        <div className="games-controls">
          <GameDatePicker date={date} onChange={setDate} hideLabel />
        </div>
        <State
          {...games}
          empty={
            !gameList.length
              ? selectedTeam
                ? "No games scheduled for this favorite team on the selected date."
                : "No games scheduled for the selected date."
              : null
          }
          onRetry={() => setGamesVersion((v) => v + 1)}
        />
        {!games.loading && (
          <HomeScoreSections
            sections={groupHomeScores(gameList, favoriteTeams, savedLeagues)}
            date={date}
          />
        )}
      </section>
      <section className="home-news" aria-labelledby="news-title">
        <div className="home-section-heading">
          <div>
            <p className="eyebrow">For you</p>
            <h2 id="news-title">Around the game</h2>
          </div>
        </div>
        <State
          {...feed}
          empty={!articles.length ? "No stories available right now." : null}
          onRetry={() => setNewsVersion((v) => v + 1)}
        />
        {!feed.loading && !feed.error && (
          <div className="home-articles">
            {articles.map((article) => (
              <article className="news-card" key={article.keyId || article.id}>
                <Image src={article.image} loading="lazy" />
                <div className="news-card-body">
                  <p className="small">
                    {article.sport?.toUpperCase() || "NEWS"}
                  </p>
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
        )}
      </section>
    </section>
  );
}

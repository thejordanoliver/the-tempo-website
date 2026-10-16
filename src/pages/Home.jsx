import { useEffect, useState } from "react";
import FavoritesScroll from "../components/FavoritesScroll.jsx";
import GameDatePicker from "../components/GameDatePicker.jsx";
import GameCard from "../components/GameCard.jsx";
import { Link } from "../router.jsx";
import { Image, State, useResource } from "../components.jsx";
const endpoints = {
  nba: "basketball/nba",
  nfl: "football/nfl",
  cfb: "football/cfb",
  mlb: "baseball",
  nhl: "hockey",
};
export function localDate() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}
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
  const favorites = useResource("/api/users/me/favorites", favoritesVersion);
  const favoriteTeams = Array.isArray(favorites.data?.favoriteTeams)
    ? favorites.data.favoriteTeams.filter(
        (t) => t && t.id != null && typeof t.league === "string",
      )
    : [];
  const games = useResource(
    `/api/games/${endpoints[league]}?date=${date.replaceAll("-", "")}`,
    gamesVersion,
  );
  const feed = useResource(
    "/api/feed/for-you?newsLimit=12&postsLimit=1",
    newsVersion,
  );
  const allGames = Array.isArray(games.data?.games) ? games.data.games : [],
    gameList = selectedTeam
      ? allGames.filter((g) =>
          [g.home, g.away].some(
            (t) => t?.id != null && String(t.id) === selectedTeam.split(":")[1],
          ),
        )
      : allGames,
    articles = Array.isArray(feed.data?.articles) ? feed.data.articles : [];
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
        loading={favorites.loading}
        error={favorites.error}
        onRetry={() => setFavoritesVersion((v) => v + 1)}
        selected={selectedTeam}
        supportedLeagues={Object.keys(endpoints)}
        onSelect={(team) => {
          setSelectedTeam(team ? `${team.league}:${team.id}` : null);
          if (team) setLeague(team.league);
        }}
      />
      <section aria-labelledby="games-title">
        <div className="games-controls">
          <div className="league-filters" role="group" aria-label="League">
            {Object.keys(endpoints).map((key) => (
              <button
                key={key}
                aria-pressed={league === key}
                onClick={() => {
                  setLeague(key);
                  setSelectedTeam(null);
                }}
              >
                {key.toUpperCase()}
              </button>
            ))}
          </div>
          <GameDatePicker date={date} onChange={setDate} />
        </div>
        <State
          {...games}
          empty={
            !gameList.length
              ? selectedTeam
                ? "No games scheduled for this favorite team on the selected date."
                : "No games scheduled for this league and date."
              : null
          }
          onRetry={() => setGamesVersion((v) => v + 1)}
        />
        {!games.loading && !games.error && (
          <div className="home-games">
            {gameList.map((game) => (
              <GameCard key={game.id} game={game} league={league} />
            ))}
          </div>
        )}
      </section>
      <section className="home-news" aria-labelledby="news-title">
        <div className="home-section-heading">
          <div>
            <p className="eyebrow">For you</p>
            <h2 id="news-title">Around the game</h2>
          </div>
          <button
            className="home-text-button"
            disabled={feed.loading}
            onClick={() => setNewsVersion((v) => v + 1)}
          >
            Refresh news
          </button>
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

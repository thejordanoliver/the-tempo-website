import { useState } from "react";
import GameCard from "../components/GameCard.jsx";
import { Link } from "../router.jsx";
import { Image, State, useResource } from "../components.jsx";
const endpoints = {
  nba: "basketball/nba",
  nfl: "football/nfl",
  mlb: "baseball",
  nhl: "hockey",
};
export function localDate() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}
export default function Home({ user, onLogout }) {
  const [league, setLeague] = useState("nba"),
    [date, setDate] = useState(localDate),
    [gamesVersion, setGamesVersion] = useState(0),
    [newsVersion, setNewsVersion] = useState(0);
  const games = useResource(
    `/api/games/${endpoints[league]}?date=${date.replaceAll("-", "")}`,
    gamesVersion,
  );
  const feed = useResource(
    "/api/feed/for-you?newsLimit=12&postsLimit=1",
    newsVersion,
  );
  const gameList = Array.isArray(games.data?.games) ? games.data.games : [],
    articles = Array.isArray(feed.data?.articles) ? feed.data.articles : [];
  return (
    <section className="home-screen">
      <header className="home-heading">
        <div>
          <p className="eyebrow">Your sports, together</p>
          <h1>Home</h1>
          <p>Welcome back, {user.fullName || user.username || "Tempo fan"}.</p>
        </div>
        <button className="tempo-button outline" onClick={onLogout}>
          Sign out
        </button>
      </header>
      <section aria-labelledby="games-title">
        <div className="home-section-heading">
          <h2 id="games-title">Games</h2>
          <button
            className="home-text-button"
            disabled={games.loading}
            onClick={() => setGamesVersion((v) => v + 1)}
          >
            Refresh games
          </button>
        </div>
        <div className="games-controls">
          <div className="league-filters" role="group" aria-label="League">
            {Object.keys(endpoints).map((key) => (
              <button
                key={key}
                aria-pressed={league === key}
                onClick={() => setLeague(key)}
              >
                {key.toUpperCase()}
              </button>
            ))}
          </div>
          <label className="game-date-label">
            Game date
            <input
              type="date"
              id="game-date"
              required
              value={date}
              onChange={(e) => {
                if (e.target.value) setDate(e.target.value);
              }}
            />
          </label>
        </div>
        <State
          {...games}
          empty={
            !gameList.length
              ? "No games scheduled for this league and date."
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

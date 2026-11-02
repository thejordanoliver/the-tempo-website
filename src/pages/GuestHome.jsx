import { useState } from "react";
import { Link } from "../router.jsx";
import { State, useResource } from "../components.jsx";
import { favoriteLeagues } from "../favoriteLeagues.js";
import { scorePath, leagueSports } from "../leagues.js";
import { LeagueScores, LeagueNews } from "../components/LeagueContent.jsx";
import GameDatePicker from "../components/GameDatePicker.jsx";
import { localDate } from "./Home.jsx";
function GuestScores({ league, date }) {
  const [version, setVersion] = useState(0),
    scores = useResource(
      `${scorePath(league)}?date=${date.replaceAll("-", "")}`,
      version,
    );
  return (
    <>
      <State {...scores} onRetry={() => setVersion((v) => v + 1)} />
      {!scores.loading && !scores.error && (
        <LeagueScores data={scores.data} league={league} />
      )}
    </>
  );
}
export default function GuestHome() {
  const [league, setLeague] = useState("nba"),
    [date, setDate] = useState(localDate),
    [newsVersion, setNewsVersion] = useState(0);
  const news = useResource("/api/news/all?limit=12", newsVersion);
  return (
    <section className="home-screen">
      <header className="home-heading">
        <div>
          <h1>Home</h1>
          <p>Scores, stories, and the sports you follow.</p>
        </div>
        <Link className="tempo-button outline" to="/login/">
          Sign in
        </Link>
      </header>
      <section className="page-state" aria-label="Personalize your Home">
        <h2>Your teams. Your Tempo.</h2>
        <p>
          Sign in to see your favorite teams and leagues, personalized news, and
          fan conversations.
        </p>
        <Link to="/login/">Sign in to personalize Home</Link>
      </section>
      <section aria-labelledby="guest-scores">
        <div className="home-section-heading">
          <h2 id="guest-scores">Scores</h2>
          <Link to="/leagues/">Browse leagues</Link>
        </div>
        <div className="games-controls">
          <label>
            League
            <select
              aria-label="League"
              value={league}
              onChange={(event) => setLeague(event.target.value)}
              style={{
                font: "inherit",
                color: "var(--text)",
                background: "var(--bg)",
                border: "1px solid var(--line)",
                borderRadius: 8,
                padding: 10,
                minHeight: 44,
                marginLeft: 10,
              }}
            >
              {Object.keys(leagueSports).map((key) => (
                <option key={key} value={key}>
                  {favoriteLeagues[key].label}
                </option>
              ))}
            </select>
          </label>
          <GameDatePicker date={date} onChange={setDate} hideLabel />
        </div>
        <GuestScores key={`${league}:${date}`} league={league} date={date} />
      </section>
      <section className="home-news" aria-labelledby="guest-news">
        <div className="home-section-heading">
          <h2 id="guest-news">Around the game</h2>
        </div>
        <State {...news} onRetry={() => setNewsVersion((v) => v + 1)} />
        {!news.loading && !news.error && (
          <LeagueNews
            data={{
              ...news.data,
              articles: (news.data?.articles || []).slice(0, 12),
            }}
          />
        )}
      </section>
    </section>
  );
}

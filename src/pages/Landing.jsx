import { Link } from "../router.jsx";
export default function Landing() {
  return (
    <>
      <section className="hero">
        <div>
          <p className="eyebrow">The sports. The scores. The conversation.</p>
          <h1>
            YOUR GAME.
            <br />
            YOUR TEMPO.
          </h1>
          <p className="intro">
            Follow the scores, explore the stories, and find your people. A home
            for the sports you love.
          </p>
          <div className="actions">
            <Link className="tempo-button" to="/login/">
              Sign in to Tempo
            </Link>
            <a className="tempo-button outline" href="#explore">
              Explore Tempo ↓
            </a>
          </div>
        </div>
        <div>
          <div
            className="app-preview"
            role="img"
            aria-label="Illustration of Tempo’s sports, favorites, and community features"
          >
            <div className="preview-top">
              <span className="wordmark">TEMPO</span>
              <span className="small">Your sports, together</span>
            </div>
            <div className="preview-tabs">
              <span className="selected">For You</span>
              <span>Games</span>
              <span>News</span>
            </div>
            <div className="preview-row">
              <span className="sport-icon" aria-hidden="true">
                ↗
              </span>
              <div>
                <b>Every game, at a glance</b>
                <p>Scores · Schedules · Game details</p>
              </div>
            </div>
            <div className="preview-row">
              <span className="sport-icon" aria-hidden="true">
                ☆
              </span>
              <div>
                <b>Your teams come first</b>
                <p>Favorite teams · Players · Leagues</p>
              </div>
            </div>
            <div className="preview-row">
              <span className="sport-icon" aria-hidden="true">
                ☰
              </span>
              <div>
                <b>More than a final score</b>
                <p>News · Fan forums · Messages</p>
              </div>
            </div>
            <div className="preview-bottom">
              <span>Home</span>
              <span>Leagues</span>
              <span>Explore</span>
              <span>Profile</span>
            </div>
          </div>
          <p className="preview-note">
            Feature illustration · not live scores or an app screenshot
          </p>
        </div>
      </section>
      <section className="section" id="explore">
        <div className="section-heading">
          <h2>All sides of the game.</h2>
          <p>Built for the way fans follow sports.</p>
        </div>
        <div className="feature-grid">
          <article className="feature">
            <p className="number">01 / FOLLOW</p>
            <h3>Keep up with the action</h3>
            <p>
              Scores, schedules, and game details. Get closer to the teams and
              athletes behind every matchup.
            </p>
          </article>
          <article className="feature">
            <p className="number">02 / EXPLORE</p>
            <h3>Make it your own</h3>
            <p>
              Find leagues, follow your favorite teams, and explore the news
              that matters to you.
            </p>
          </article>
          <article className="feature">
            <p className="number">03 / CONNECT</p>
            <h3>Join the conversation</h3>
            <p>
              Talk sports in fan forums and game chats, or keep the conversation
              going in messages.
            </p>
          </article>
        </div>
      </section>
      <section className="section help-row">
        <div>
          <p className="eyebrow">Tempo Support</p>
          <h2>A little help getting back to the game.</h2>
          <p>
            Questions about your account, an app issue, or a safety concern?
            We’re here to help.
          </p>
        </div>
        <Link className="tempo-button" to="/support/">
          Contact support →
        </Link>
      </section>
    </>
  );
}

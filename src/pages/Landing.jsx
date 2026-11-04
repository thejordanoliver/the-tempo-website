import { Link } from "../app/router.jsx";
import Icon from "../components/ui/Icon.jsx";
export default function Landing() {
  return (
    <>
      <section className="hero">
        <div>
          <h1>
            YOUR GAME.
            <br />
            YOUR TEMPO.
          </h1>
          <p className="intro">Scores, news, and fan conversations.</p>
          <div className="actions">
            <Link className="tempo-button" to="/home/">
              Scores & news
            </Link>
            <Link className="tempo-button outline" to="/login/">
              Sign in
            </Link>
            <a className="tempo-button outline" href="#explore">
              Features{" "}
              <Icon name="arrow-down" className="icon-after" size={18} />
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
            </div>
            <div className="preview-tabs">
              <span className="selected">For You</span>
              <span>Games</span>
              <span>News</span>
            </div>
            <div className="preview-row">
              <span className="sport-icon" aria-hidden="true">
                <Icon name="trending-up" size={24} />
              </span>
              <div>
                <b>Scores & schedules</b>
              </div>
            </div>
            <div className="preview-row">
              <span className="sport-icon" aria-hidden="true">
                <Icon name="star" size={24} />
              </span>
              <div>
                <b>Your teams</b>
              </div>
            </div>
            <div className="preview-row">
              <span className="sport-icon" aria-hidden="true">
                <Icon name="chatbubbles" size={24} />
              </span>
              <div>
                <b>Fan conversations</b>
              </div>
            </div>
            <div className="preview-bottom">
              <span>Home</span>
              <span>Leagues</span>
              <span>Explore</span>
              <span>Profile</span>
            </div>
          </div>
          <p className="preview-note">Feature illustration</p>
        </div>
      </section>
      <section className="section" id="explore">
        <div className="section-heading">
          <h2>Follow your game.</h2>
        </div>
        <div className="feature-grid">
          <article className="feature">
            <p className="number">01 / FOLLOW</p>
            <h3>Scores & schedules</h3>
            <p>Scores, matchups, and game details.</p>
          </article>
          <article className="feature">
            <p className="number">02 / EXPLORE</p>
            <h3>Your favorites</h3>
            <p>Follow teams, leagues, and news.</p>
          </article>
          <article className="feature">
            <p className="number">03 / CONNECT</p>
            <h3>Join the conversation</h3>
            <p>Talk sports in forums, game chats, and messages.</p>
          </article>
        </div>
      </section>
      <section className="section help-row">
        <div>
          <h2>Need help?</h2>
        </div>
        <Link className="tempo-button" to="/support/">
          Contact support{" "}
          <Icon name="arrow-forward" className="icon-after" size={18} />
        </Link>
      </section>
    </>
  );
}

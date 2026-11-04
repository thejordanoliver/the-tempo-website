import ExploreSearch from "../components/explore/ExploreSearch.jsx";
import { Link } from "../app/router.jsx";
import "../components/explore/Explore.css";
export default function Explore({ userId = null }) {
  return (
    <section className="explore-page">
      <header className="explore-heading">
        <div>
          <p className="eyebrow">Your sports. Your space.</p>
          <h1>Explore</h1>
          <p>
            Find players, teams and fans.
          </p>
        </div>
        <Link className="tempo-button outline" to="/leagues/">
          Browse leagues
        </Link>
      </header>
      <ExploreSearch key={`search:${userId ?? "guest"}`} userId={userId} />
    </section>
  );
}

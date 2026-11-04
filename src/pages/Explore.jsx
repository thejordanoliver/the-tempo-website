import "../components/explore/Explore.css";
import ExploreBoard from "../components/explore/ExploreBoard.jsx";
import ExploreSearch from "../components/explore/ExploreSearch.jsx";

export default function Explore({ userId = null }) {
  return (
    <section className="explore-page">
      <h1 className="sr-only">Explore</h1>
      <ExploreSearch key={`search:${userId ?? "guest"}`} userId={userId} />
      <ExploreBoard key={`board:${userId ?? "guest"}`} userId={userId} />
    </section>
  );
}

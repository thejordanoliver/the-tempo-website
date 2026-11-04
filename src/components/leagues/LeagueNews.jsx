import { Link } from "../../app/router.jsx";
import { readableDate } from "../../utils/dates.js";
import { Image } from "../ui/Image.jsx";
import Empty from "./EmptyLeagueState.jsx";
const list = (value) => (Array.isArray(value) ? value : []);
export function LeagueNews({ data }) {
  const articles = list(data?.articles);
  if (!articles.length) return <Empty>No stories yet.</Empty>;
  return (
    <div className="home-articles">
      {articles.map((article, index) => (
        <article
          className="news-card"
          key={article.keyId || article.id || index}
        >
          <Image src={article.image} loading="lazy" />
          <div className="news-card-body">
            <p className="small">{readableDate(article.published)}</p>
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
  );
}

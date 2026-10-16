import { useMemo, useState } from "react";
import { Link } from "../router.jsx";
import { Image, State, safeURL, useResource } from "../components.jsx";
function storyParagraphs(article) {
  if (article.storyParagraphs?.some((p) => p.segments?.length))
    return article.storyParagraphs;
  const parsed = new DOMParser().parseFromString(
    article.story || "",
    "text/html",
  );
  parsed
    .querySelectorAll("script,style,iframe,object,embed")
    .forEach((n) => n.remove());
  let texts = [...parsed.querySelectorAll("p")]
    .map((p) => p.textContent.trim())
    .filter(Boolean);
  if (!texts.length)
    texts = (parsed.body.textContent || "")
      .split(/\n\s*\n/)
      .map((t) => t.trim())
      .filter(Boolean);
  return texts.map((text) => ({ segments: [{ text }] }));
}
function Story({ article }) {
  const paragraphs = useMemo(() => storyParagraphs(article), [article]),
    date = new Date(article.published || ""),
    hero = article.images?.[0],
    source = safeURL(article.link);
  return (
    <>
      <header className="article-header">
        <p className="eyebrow">{article.source || "Sports news"}</p>
        <h1>{article.headline || "Sports news"}</h1>
        {article.description && (
          <p className="article-description">{article.description}</p>
        )}
        <p className="article-meta">
          {[
            article.byline,
            Number.isNaN(date.valueOf())
              ? null
              : date.toLocaleDateString(undefined, {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                }),
          ]
            .filter(Boolean)
            .join(" · ")}
        </p>
      </header>
      {hero && (
        <Image src={hero.url} alt={hero.alt || ""} className="article-image" />
      )}
      {article.caption && <p className="article-meta">{article.caption}</p>}
      <div className="article-copy">
        {paragraphs.length ? (
          paragraphs.map((p, i) => (
            <p key={i}>
              {p.segments?.map((segment, j) => {
                const url = safeURL(segment.link);
                if (segment.target?.kind === "article")
                  return (
                    <Link
                      key={j}
                      to={`/article/?id=${encodeURIComponent(segment.target.id)}`}
                    >
                      {segment.text}
                    </Link>
                  );
                if (
                  segment.target?.kind === "game" &&
                  ["nba", "nfl", "mlb", "nhl"].includes(segment.target.league)
                )
                  return (
                    <Link
                      key={j}
                      to={`/game/?league=${segment.target.league}&id=${encodeURIComponent(segment.target.gameId)}`}
                    >
                      {segment.text}
                    </Link>
                  );
                return url ? (
                  <a key={j} href={url} rel="noopener noreferrer">
                    {segment.text}
                  </a>
                ) : (
                  segment.text
                );
              })}
            </p>
          ))
        ) : (
          <p>
            The full story is not available here. Read the original article
            below.
          </p>
        )}
        {source && (
          <a href={source} target="_blank" rel="noopener noreferrer">
            Read the original article ↗
          </a>
        )}
      </div>
    </>
  );
}
function ArticleData({ id }) {
  const [version, setVersion] = useState(0),
    state = useResource(`/api/news/article/${id}`, version);
  return (
    <>
      <header className="detail-header">
        <Link to="/home/">← Home</Link>
        <button
          className="detail-button"
          disabled={state.loading}
          onClick={() => setVersion((v) => v + 1)}
        >
          Refresh
        </button>
      </header>
      <State
        {...state}
        error={
          state.error ||
          (!state.loading && !state.data?.article ? "Article not found." : null)
        }
        onRetry={() => setVersion((v) => v + 1)}
      />
      {!state.loading && !state.error && state.data?.article && (
        <Story article={state.data.article} />
      )}
    </>
  );
}
export default function Article({ search }) {
  const id = new URLSearchParams(search).get("id");
  return (
    <div className="detail-page">
      {!id || !/^\d+$/.test(id) ? (
        <>
          <h1>Article</h1>
          <State error="Select an article from Home." />
          <Link to="/home/">Back to Home</Link>
        </>
      ) : (
        <ArticleData id={id} key={id} />
      )}
    </div>
  );
}

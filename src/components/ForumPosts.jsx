import Icon from "./Icon.jsx";
import ForumPoll from "./ForumPoll.jsx";
import { Link } from "../router.jsx";
import { Image, safeURL } from "../components.jsx";
import "./ForumPosts.css";
const list = (value) => (Array.isArray(value) ? value : []);
export default function ForumPosts({ posts, fullText = false, engagement = true }) {
  return (
    <div className="league-feed">
      {posts.map((post) => {
        const name = post.full_name || post.username || "Tempo fan",
          body = post.text ?? post.content;
        const long = !fullText && typeof body === "string" && body.length > 320;
        const destination = `/post/?id=${encodeURIComponent(post.id)}`;
        const date = new Date(post.created_at || ""),
          validDate = !Number.isNaN(date.valueOf());
        const images = [
          ...new Set([
            ...list(post.images),
            ...(post.image_url ? [post.image_url] : []),
          ]),
        ].filter((value) => typeof value === "string");
        return (
          <article key={post.id}>
            <header className="forum-post-header">
              <div className="forum-author">
                <span className="forum-avatar-frame">
                  <span aria-hidden="true">
                    {name.slice(0, 1).toUpperCase()}
                  </span>
                  <Image
                    className="forum-avatar"
                    src={post.profile_image}
                    alt=""
                  />
                </span>
                <div>
                  <strong>{name}</strong>
                  {post.username && (
                    <span className="forum-username">@{post.username}</span>
                  )}
                </div>
              </div>
              {validDate && (
                <time dateTime={date.toISOString()}>
                  {date.toLocaleString(undefined, {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </time>
              )}
            </header>
            {post.title && <h3>{post.title}</h3>}
            {typeof body === "string" && body.trim() && (
              <div>
                <p className="league-post-text">{long ? body.slice(0, 320).trimEnd() + "…" : body}</p>
                {long && <Link className="forum-link" to={destination}>Read more</Link>}
              </div>
            )}
            {images.length > 0 && (
              <div className="forum-media">
                {images.map((src, index) => (
                  <Image
                    key={src}
                    src={src}
                    alt={`Post attachment ${index + 1}`}
                    loading="lazy"
                  />
                ))}
              </div>
            )}
            {list(post.videos).map((src, index) => {
              const url = safeURL(src);
              return url ? (
                <video
                  key={`${src}:${index}`}
                  controls
                  playsInline
                  preload="metadata"
                  src={url}
                  poster={safeURL(post.video_thumbnails?.[index]) || undefined}
                  aria-label={`Post video ${index + 1}`}
                />
              ) : null;
            })}
            {engagement && <ForumPoll key={post.id} postId={post.id} initialPoll={post.poll} />}
            {engagement && <div className="small forum-counts">
              <span><Icon name="heart" size={18} />{post.likes ?? post.like_count ?? 0} likes</span>
              <Link className="forum-link" to={destination + "#comments"}>
                <Icon name="chatbubbles" size={18} />{post.comments_count ?? post.comment_count ?? 0} comments
              </Link>
              <span><Icon name="share" size={18} />{post.shares ?? 0} shares</span>
              <span><Icon name="bookmark" size={18} />{post.bookmarks ?? 0} bookmarks</span>
            </div>}
          </article>
        );
      })}
    </div>
  );
}

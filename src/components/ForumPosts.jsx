import { Image, safeURL } from "../components.jsx";
import "./ForumPosts.css";
const list = (value) => (Array.isArray(value) ? value : []);
export default function ForumPosts({ posts }) {
  return (
    <div className="league-feed">
      {posts.map((post) => {
        const name = post.full_name || post.username || "Tempo fan",
          body = post.text ?? post.content;
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
              <p className="league-post-text">{body}</p>
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
            {post.poll && (
              <section className="forum-poll" aria-label="Post poll">
                <h3>{post.poll.question}</h3>
                <ul>
                  {list(post.poll.options).map((option) => (
                    <li key={option.id}>
                      {option.text}
                      {option.vote_count != null &&
                        ` · ${option.vote_count} votes`}
                    </li>
                  ))}
                </ul>
              </section>
            )}
            <p className="small forum-counts">
              <span>{post.likes ?? post.like_count ?? 0} likes</span>
              <span>
                {post.comments_count ?? post.comment_count ?? 0} comments
              </span>
              <span>{post.shares ?? 0} shares</span>
              {post.bookmarks != null && (
                <span>{post.bookmarks} bookmarks</span>
              )}
            </p>
          </article>
        );
      })}
    </div>
  );
}

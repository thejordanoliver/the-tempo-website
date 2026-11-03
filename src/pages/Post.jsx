import { useEffect, useState } from "react";

import ForumPosts from "../components/forums/ForumPosts.jsx";
import { State } from "../components/ui/State.jsx";
import { useResource } from "../hooks/useResource.js";
import "../components/leagues/League.css";

export function CommentsList({ comments = [] }) {
  return comments.length ? (
    comments.map((comment) => (
      <div key={comment.id}>
        <ForumPosts posts={[comment]} fullText engagement={false} />
        {comment.replies?.length > 0 && (
          <div className="forum-replies">
            <ForumPosts posts={comment.replies} fullText engagement={false} />
          </div>
        )}
      </div>
    ))
  ) : (
    <p>No comments yet.</p>
  );
}
function PostData({ id }) {
  const [page, setPage] = useState(1),
    [version, setVersion] = useState(0);
  const post = useResource(`/api/forum/post/${id}`, version);
  const comments = useResource(
    `/api/forum/post/${id}/comments?page=${page}&limit=20`,
    version,
  );
  useEffect(() => {
    if (
      !post.loading &&
      !comments.loading &&
      window.location.hash === "#comments"
    ) {
      document.getElementById("comments")?.scrollIntoView();
    }
  }, [post.loading, comments.loading]);
  return (
    <section className="detail-page">
      <h1>Post</h1>
      <State
        {...post}
        error={
          post.error ||
          (!post.loading && !post.data?.post ? "Post not found." : null)
        }
        onRetry={() => setVersion((v) => v + 1)}
      />
      {!post.loading && !post.error && post.data?.post && (
        <ForumPosts posts={[post.data.post]} fullText />
      )}
      <section id="comments" aria-label="Comments">
        <h2>Comments</h2>
        <State {...comments} onRetry={() => setVersion((v) => v + 1)} />
        {!comments.loading && !comments.error && (
          <>
            <CommentsList comments={comments.data?.comments} />
            {(page > 1 || page < comments.data?.pagination?.totalPages) && (
              <div className="league-pagination">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous comments
                </button>
                <span>Page {page}</span>
                <button
                  disabled={page >= comments.data?.pagination?.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next comments
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </section>
  );
}
export default function Post({ search = "" }) {
  const id = new URLSearchParams(search).get("id");
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    id || "",
  ) ? (
    <PostData key={id} id={id} />
  ) : (
    <State error="Select a forum post." />
  );
}

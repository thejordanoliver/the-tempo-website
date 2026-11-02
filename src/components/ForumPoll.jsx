import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Link } from "../router.jsx";
import { sessionStore } from "../session.js";

export default function ForumPoll({ postId, initialPoll }) {
  const [poll, setPoll] = useState(initialPoll || null);
  const [loading, setLoading] = useState(initialPoll === undefined);
  const [error, setError] = useState(null);
  const [voting, setVoting] = useState(false);
  const [version, setVersion] = useState(0);
  const pending = useRef(false);
  const session = useSyncExternalStore(sessionStore.subscribe, sessionStore.getSnapshot, () => null);
  const endpoint = `/api/forum/post/${encodeURIComponent(postId)}/poll`;

  useEffect(() => {
    const controller = new AbortController();
    if (initialPoll === null) return;
    if (initialPoll?.options?.length && version === 0) return;
    setLoading(true);
    setError(null);
    sessionStore.request(endpoint, { signal: controller.signal })
      .then(data => { if (!controller.signal.aborted) setPoll(data.poll || null); })
      .catch(err => {
        if (controller.signal.aborted) return;
        if (err.status === 404) setPoll(null);
        else setError("Couldn’t load this poll.");
      })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [endpoint, initialPoll, version, session?.user?.id]);

  const options = Array.isArray(poll?.options) ? poll.options : [];
  const total = options.reduce((sum, option) => sum + Number(option.vote_count || 0), 0);
  const voted = options.some(option => option.voted_by_current_user);
  const expired = Boolean(poll?.expires_at && new Date(poll.expires_at) <= new Date());
  const results = voted || expired;
  async function vote(optionId) {
    if (!session || pending.current || voted || expired) return;
    pending.current = true;
    setVoting(true);
    setError(null);
    try {
      await sessionStore.request(endpoint + "/vote", {
        method: "POST", body: JSON.stringify({ optionId }),
      });
      // Keep the accepted vote even if refreshing the totals fails.
      setPoll(current => ({ ...current, options: current.options.map(option =>
        option.id === optionId ? { ...option, vote_count: Number(option.vote_count || 0) + 1, voted_by_current_user: true } : option
      ) }));
      try {
        const data = await sessionStore.request(endpoint);
        setPoll(data.poll);
      } catch { /* The vote was already accepted. */ }
    } catch (err) {
      setError(err.message || "Couldn’t record your vote. Please try again.");
    } finally {
      pending.current = false;
      setVoting(false);
    }
  }
  if (loading && !poll) return <p className="small" role="status">Loading poll…</p>;
  if (!poll && !error) return null;
  return (
    <section className="forum-poll" aria-label="Post poll" aria-busy={voting}>
      {poll && <>
        <h3>{poll.question}</h3>
        <div className="forum-poll-options">
          {options.map(option => {
            const percent = total ? Math.round(Number(option.vote_count || 0) / total * 100) : 0;
            return <button key={option.id} type="button" className="forum-poll-option"
              aria-pressed={Boolean(option.voted_by_current_user)}
              disabled={!session || voted || expired || voting || loading}
              onClick={() => vote(option.id)}>
              {results && <span className="forum-poll-fill" style={{ width: `${percent}%` }} aria-hidden="true" />}
              <span>{option.voted_by_current_user && "✓ "}{option.text}</span>
              {results && <span>{percent}%</span>}
            </button>;
          })}
        </div>
        <p className="small forum-poll-footer">{total} {total === 1 ? "vote" : "votes"}{poll.allows_multiple ? " · Multiple choice" : ""}{expired ? " · Closed" : ""}</p>
        {!session && !expired && <Link to="/login/">Sign in to vote</Link>}
      </>}
      {error && <div role="alert"><p>{error}</p><button type="button" onClick={() => setVersion(v => v + 1)}>Reload poll</button></div>}
    </section>
  );
}

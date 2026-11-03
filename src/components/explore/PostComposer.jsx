import { useEffect, useRef, useState } from "react";
import { navigate } from "../../app/router.jsx";
import { favoriteLeagues } from "../../data/leagues/favoriteLeagues.js";
import { sessionStore } from "../../services/session.js";
import { State } from "../ui/State.jsx";
export default function PostComposer() {
  const [text, setText] = useState(""),
    [league, setLeague] = useState("nba"),
    [error, setError] = useState(null),
    [pending, setPending] = useState(false);
  const busy = useRef(false),
    mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  async function submit(event) {
    event.preventDefault();
    if (!text.trim() || busy.current) return;
    busy.current = true;
    setPending(true);
    setError(null);
    try {
      const data = await sessionStore.request(
        `/api/forum/league/${encodeURIComponent(league)}`,
        { method: "POST", body: JSON.stringify({ text: text.trim(), league }) },
      );
      if (!data.post?.id)
        throw new Error(
          "Your post could not be opened. Check the league forum before posting again.",
        );
      if (mounted.current)
        navigate(`/post/?id=${encodeURIComponent(data.post.id)}`);
    } catch (error) {
      if (mounted.current) setError(error.message);
    } finally {
      busy.current = false;
      if (mounted.current) setPending(false);
    }
  }
  return (
    <form className="explore-composer" onSubmit={submit}>
      <label>
        League
        <select
          value={league}
          disabled={pending}
          onChange={(event) => setLeague(event.target.value)}
        >
          {Object.entries(favoriteLeagues).map(([id, item]) => (
            <option key={id} value={id}>
              {item.label}
            </option>
          ))}
        </select>
      </label>
      <label>
        Your post
        <textarea
          rows={4}
          maxLength={5000}
          value={text}
          disabled={pending}
          placeholder="What’s your take?"
          onChange={(event) => setText(event.target.value)}
        />
      </label>
      <State error={error} />
      <button
        type="submit"
        className="tempo-button"
        disabled={pending || !text.trim()}
      >
        {pending ? "Posting…" : "Post to league"}
      </button>
    </form>
  );
}

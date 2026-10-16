import { useState } from "react";
import { Link, navigate } from "../router.jsx";
import { API_URL, sessionStore } from "../session.js";
export default function Login() {
  const [username, setUsername] = useState(""),
    [password, setPassword] = useState(""),
    [show, setShow] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const blocked = location.protocol === "https:" && API_URL.startsWith("http:");
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await sessionStore.login(username.trim(), password);
      navigate("/home/", { replace: true });
    } catch (err) {
      setError(
        err.status === 401 ? "Incorrect username or password." : err.message,
      );
    } finally {
      setPassword("");
      setShow(false);
      setBusy(false);
    }
  }
  return (
    <section className="login-layout">
      <div className="login-intro">
        <p className="eyebrow">Welcome back to Tempo</p>
        <h1>
          YOUR GAME.
          <br /> YOUR TEMPO.
        </h1>
        <p>
          Scores, stories, and the conversation.
          <br />
          Pick up right where you left off.
        </p>
      </div>
      <article className="login-panel">
        <div className="login-tabs">
          <span aria-current="page">Sign in</span>
          <Link to="/support/#account-access">Account help</Link>
        </div>
        <h2>Welcome back.</h2>
        <p className="login-description">
          Use the same username and password as the Tempo app.
        </p>
        {blocked && (
          <p className="draft-notice" role="status">
            Web sign-in is not available with the current local HTTP backend.
            Use a local HTTP preview on the same network.
          </p>
        )}
        {error && (
          <p className="draft-notice" role="alert">
            {error}
          </p>
        )}
        <form onSubmit={submit}>
          <fieldset disabled={busy || blocked}>
            <legend className="sr-only">Account credentials</legend>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              placeholder="Enter your username"
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <label htmlFor="password">Password</label>
            <div className="password-control">
              <input
                id="password"
                name="password"
                placeholder="Enter your password"
                type={show ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                id="toggle-password"
                aria-label={show ? "Hide password" : "Show password"}
                aria-pressed={show}
                onClick={() => setShow(!show)}
              >
                {show ? "Hide" : "Show"}
              </button>
            </div>
            <button type="submit" className="tempo-button">
              {busy ? "Signing in…" : "Sign in"}
            </button>
          </fieldset>
        </form>
        <Link className="account-help" to="/support/#account-access">
          Need help signing in?
        </Link>
        <p className="login-footnote">
          Manage your account and create a new one in the Tempo mobile app.
        </p>
        <footer>
          <Link to="/privacy/">Privacy Policy</Link>
          <Link to="/support/">Help &amp; Support</Link>
        </footer>
      </article>
    </section>
  );
}

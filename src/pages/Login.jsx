import { useState } from "react";

import { Link, navigate } from "../app/router.jsx";
import { API_URL, sessionStore } from "../services/session.js";
export default function Login() {
  const [username, setUsername] = useState(""),
    [password, setPassword] = useState(""),
    [rememberMe, setRememberMe] = useState(false),
    [show, setShow] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const blocked = location.protocol === "https:" && API_URL.startsWith("http:");
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await sessionStore.login(username.trim(), password, rememberMe);
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
    <section className="login-layout login-form-only">
      <h1 className="sr-only">Sign in</h1>
      <article className="login-panel">
        <p className="login-description">Use your Tempo app account.</p>
        {blocked && (
          <p className="draft-notice" role="status">
            Use a local HTTP preview on the same network to sign in.
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
            <label className="remember-me">
              <input
                type="checkbox"
                name="rememberMe"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
              />
              Remember me
            </label>
            <button type="submit" className="tempo-button">
              {busy ? "Signing in…" : "Sign in"}
            </button>
          </fieldset>
        </form>
        <Link className="account-help" to="/support/#account-access">
          Sign-in help
        </Link>
        <p className="login-footnote">
          Create or manage your account in the Tempo app.
        </p>
        <footer>
          <Link to="/privacy/">Privacy Policy</Link>
          <Link to="/support/">Help &amp; Support</Link>
        </footer>
      </article>
    </section>
  );
}

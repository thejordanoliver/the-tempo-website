import { useEffect, useState } from "react";
import { Link } from "./router.jsx";
import { API_URL, sessionStore } from "./session.js";
export function useResource(path, version = 0) {
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: null,
  });
  useEffect(() => {
    const controller = new AbortController();
    setState({ data: null, loading: true, error: null });
    sessionStore
      .request(path, {
        signal: AbortSignal.any([
          controller.signal,
          AbortSignal.timeout(20000),
        ]),
      })
      .then((data) => {
        if (!controller.signal.aborted)
          setState({ data, loading: false, error: null });
      })
      .catch((error) => {
        if (!controller.signal.aborted)
          setState({ data: null, loading: false, error: error.message });
      });
    return () => controller.abort();
  }, [path, version]);
  return state;
}
export function safeURL(value) {
  try {
    const url = new URL(value, API_URL);
    return value && ["http:", "https:"].includes(url.protocol)
      ? url.href
      : null;
  } catch {
    return null;
  }
}
export function Image({ src, alt = "", ...props }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  const url = safeURL(src);
  return !url || failed ? null : (
    <img
      {...props}
      src={url}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  );
}
export function State({ loading, error, empty, onRetry }) {
  if (!loading && !error && !empty) return null;
  return (
    <div className="page-state" role="status">
      <p>{loading ? "Loading…" : error || empty}</p>
      {error && onRetry && (
        <button type="button" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
export function Footer() {
  return (
    <footer className="site-footer">
      <span>TEMPO SPORTS</span>
      <Link to="/support/">Support</Link>
      <Link to="/privacy/">Privacy Policy</Link>
      <a href="mailto:jordanoliver@thetemposports.com">Contact</a>
    </footer>
  );
}
export function Table({ headers, rows }) {
  return (
    <div
      className="table-scroll"
      role="region"
      aria-label="Scrollable statistics table"
      tabIndex={0}
    >
      <table>
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th scope="col" key={i}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) =>
                j === 0 ? (
                  <th scope="row" key={j}>
                    {cell ?? "—"}
                  </th>
                ) : (
                  <td key={j}>{cell ?? "—"}</td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

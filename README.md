# Tempo website

React website for Tempo, hosted on GitHub Pages. The source lives in `src/`; the root HTML files and `web-assets/` are generated output.

## Development

```sh
npm ci
npm run dev
```

Open the local URL printed by the server (default: `http://127.0.0.1:8766`). Source changes rebuild automatically; refresh the browser to see them.

## Backend

Set `TEMPO_API_URL` in `.env` before running `npm run dev` or `npm run build`:

```sh
TEMPO_API_URL=https://the-tempo-api.onrender.com
```

Both commands load `.env` automatically. An explicit environment variable overrides the file, for example:

```sh
TEMPO_API_URL=https://your-api.example npm run build
```

The API URL is public configuration embedded at build time. Never put secrets in it. `.env` is Git-ignored. A missing or invalid URL fails the build instead of silently selecting a local backend. HTTPS-hosted pages require an HTTPS API; an HTTP backend can be used with a local HTTP preview on the same network.

After changing the API URL, rebuild and publish the generated HTML and `web-assets/`. Editing `.env` alone does not update an already published website. Restart `npm run dev` after environment changes.

## Pages and sessions

React handles the homepage, sign-in, Home, profile, Support, Privacy Policy, games, articles, the league directory, and individual league pages. Navigation uses the browser history API, including Back/Forward. Every known route has a generated HTML entry so direct links and reloads work on GitHub Pages, under either a project path or a custom domain. Old `tempo-website/` links redirect to the canonical routes.

Browse `/leagues/` to search all 32 leagues across nine sports. League detail links use `/league/?league=nba`, with optional `tab`, `date`, `season`, `week`, and `page` parameters preserved by Back/Forward and reload. Scores, news, standings, and sport-specific sections use the existing backend and session request layer; league forums require sign-in.

Session tokens and basic account details use tab-only `sessionStorage` by default. Selecting Remember me on sign-in uses `localStorage` to restore sign-in across browser visits until sign-out or refresh-token expiry. Access tokens refresh when needed. Support and other page navigation preserve sign-in. Signing out clears the saved session immediately. Passwords are never persisted.

Sports data and articles come only from the backend. Article HTML is converted to text and safe links; untrusted HTML is never inserted into the page.

## Verify and publish

```sh
npm test
npm run build
```

Commit the source, package lockfile, generated root route HTML and `web-assets/`, then push. GitHub Pages should remain configured to publish `main` → `/(root)`. No separate build service or hosting subscription is needed. Font files and their licenses are self-hosted.

The privacy policy remains a draft; see `PRIVACY-REVIEW.md` before treating it as final. Its content and the existing homepage copy were preserved during the React migration.

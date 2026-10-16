# Tempo website

React website for Tempo, hosted on GitHub Pages. The source lives in `src/`; the root HTML files and `web-assets/` are generated output.

## Development

```sh
npm ci
npm run dev
```

Open the local URL printed by the server (default: `http://127.0.0.1:8766`). Source changes rebuild automatically; refresh the browser to see them.

## Backend

The temporary default is `http://192.168.1.225:4000`. Local account and sports-data testing requires access to that network. HTTPS-hosted pages cannot call an HTTP backend. Set a public HTTPS API when it is ready:

```sh
TEMPO_API_URL=https://your-api.example npm run build
```

The API URL is public configuration embedded at build time. Never put secrets in it. A `.env.example` documents the setting; `.env` files are ignored and are not loaded automatically.

## Pages and sessions

React handles the homepage, sign-in, Home, profile, Support, Privacy Policy, games and articles. Navigation uses the browser history API, including Back/Forward. Every known route has a generated HTML entry so direct links and reloads work on GitHub Pages, under either a project path or a custom domain. Old `tempo-website/` links redirect to the canonical routes.

Session tokens and basic account details stay in this browser tab's `sessionStorage`, and access tokens refresh when needed. Support and other page navigation preserve sign-in. Signing out clears the saved session immediately. Passwords are never persisted.

Sports data and articles come only from the backend. Article HTML is converted to text and safe links; untrusted HTML is never inserted into the page.

## Verify and publish

```sh
npm test
npm run build
```

Commit the source, package lockfile, generated root route HTML and `web-assets/`, then push. GitHub Pages should remain configured to publish `main` → `/(root)`. No separate build service or hosting subscription is needed. Font files and their licenses are self-hosted.

The privacy policy remains a draft; see `PRIVACY-REVIEW.md` before treating it as final. Its content and the existing homepage copy were preserved during the React migration.

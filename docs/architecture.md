# Website structure

This repository is the browser-based React website. The Expo mobile app and the backend have separate repositories.

## Source ownership

| Directory                                      | Responsibility                                                                               |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `src/main.jsx`                                 | Browser entrypoint and root React render.                                                    |
| `src/app/`                                     | App shell, history router, global theme state.                                               |
| `src/pages/`                                   | Route-level composition and controls.                                                        |
| `src/components/home/`                         | Favorites rail and league-grouped Home scores.                                               |
| `src/components/games/`                        | Game cards, details, summary and presentation models.                                        |
| `src/components/leagues/`                      | League content, rankings, drafts and shared league logos.                                    |
| `src/components/mma/`                          | UFC events, fight cards and champions.                                                       |
| `src/components/teams/`, `players/`, `forums/` | Feature UI and local styles.                                                                 |
| `src/components/layout/`                       | Navigation and footer.                                                                       |
| `src/components/ui/`                           | Shared state, image, table, date picker, heading, icon and theme components.                 |
| `src/hooks/`                                   | Requests, cancellation, Home aggregation and live subscription lifecycle.                    |
| `src/services/`                                | Canonical session-aware HTTP layer and shared sports socket.                                 |
| `src/data/`                                    | League, team and player metadata plus view-specific mapping of normalized backend responses. |
| `src/utils/`                                   | Date formatting, safe media URLs and Home score grouping.                                    |
| `src/styles/`                                  | Site-wide fonts, theme tokens and base layout.                                               |
| `src/assets/`                                  | Imported league and team logos.                                                              |
| `assets/`                                      | Existing public artwork, self-hosted fonts and licenses.                                     |
| `tests/`                                       | Node tests, including server rendering and live-update lifecycle checks.                     |
| `scripts/`                                     | Local preview and static production build.                                                   |

Import specific modules directly. Feature styles stay next to their component; global tokens stay in `src/styles/global.css`. Pages compose feature UI and hooks. Shared UI does not fetch data. Backend requests use `sessionStore.request`; do not add a second session/token system or fetch sports providers directly.

## Home scores

`useHomeScores` loads the backend scoreboards for supported leagues. `groupHomeScores` places each game in exactly one league section, removes duplicate IDs within each league, and retains distinct games when leagues happen to share an ID. Favorite-team leagues lead, followed by saved leagues and the remaining supported leagues. Within a league, favorite-team games lead; other games are ordered live, upcoming, final, then by the backend's matchup priority. Home displays at most 10 games per sport across its league sections. The limit is applied after deduplication and ranking, so saved leagues keep their priority. Empty sections after capping are omitted; league-page links retain access to the full schedule.

`HomeScoreSections` owns the presentation: theme-aware league logos, named headings, game counts and links that preserve the selected date. The existing sport-specific cards remain shared with league pages. Guest Home retains its league selector and uses the same section UI.

## Real-time data

Initial data still loads through the existing authenticated HTTP layer. Home, guest scoreboards, league scores/fights, and supported game-detail pages subscribe to the backend's `/sports-live` Socket.IO namespace through `useLiveSportsSubscription` and `liveSportsSocket`.

The socket uses the origin of the configured `TEMPO_API_URL`; no provider connections are made in the browser. Scoreboards subscribe using sport, league and selected date/week/season filters. Game details subscribe using sport, league and game ID. The website consumes full normalized snapshots via `sports:scoreboard:update` and `sports:game:update`; it does not request the optional delta representation.

One connection serves all mounted consumers. Identical subscriptions are reference-counted. Route/date changes unsubscribe the old selection; queued callbacks after cleanup are ignored. Hidden tabs disconnect and rejoin active subscriptions when visible; network reconnects also rejoin. The latest session access token is supplied on each connection. Incoming live snapshots take precedence over an older in-flight HTTP response. HTTP errors and retry controls remain available when initial data cannot load.

## Generated files

The root route directories, `index.html`, `web-assets/`, `.nojekyll` and legacy `tempo-website/` redirects are generated by `npm run build`. They intentionally remain at the repository root because GitHub Pages publishes `main` → `/(root)`. Do not move them into the source tree or edit generated bundles by hand. `CNAME` remains the domain configuration. `.env`, `node_modules/` and `.preview/` are local-only.

Run `npm run format` to format the entire editable repository, and `npm run format:check` to verify it. Generated HTML and bundles, local state and dependencies are excluded. Scores, news, standings, stats and records have separate league components; static standings tables are shared without circular imports.

Run `npm test` and `npm run build` after changing imports or moving files. No hosting configuration or production deployment is needed for source development.

## Explore

`src/pages/Explore.jsx` composes search and the widget board; `src/components/explore/` owns their presentation. `useExploreSearch` cancels superseded requests, waits 400 ms before searching, and scopes recent sports searches by account. Public fan profiles are in `src/pages/User.jsx`; only the backend's public fields are displayed.

`useExploreBoard` loads account settings before enabling edits, serializes saves, sends `X-Tempo-User-Id` and the expected revision, and blocks saves after a 409 conflict until settings are reloaded. Failed saves keep local edits for retry. The page keys search and board instances by account, so pending responses and local edits cannot populate a different user's board. Widget configuration uses the same field names and six types as the app; flags the web board does not use are retained when saving.

Widget data uses the shared request/session layer. Only Favorite Games subscribes to live game feeds, and only for its ten visible games. Unmounting or hiding the tab follows the shared sports socket lifecycle. Post creation is an explicit form action through the existing forum endpoint; previews and tests do not submit posts.

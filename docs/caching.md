# Website data caching

The shared `sessionStore.request` caches successful JSON GET responses in memory. All pages, search, player team lookups, Home scoreboards, and Explore widgets use this layer. No API response cache is persisted to disk or localStorage.

| Resource                                                                                        | Fresh lifetime | Maximum display age during background refresh |
| ----------------------------------------------------------------------------------------------- | -------------- | --------------------------------------------- |
| Scores, games and details                                                                       | 10 seconds     | 30 seconds                                    |
| Team details, rosters and player profiles                                                       | 10 minutes     | 30 minutes                                    |
| Player stats, game logs, standings, leaders, transactions, drafts, awards, recruits and records | 2 minutes      | 6 minutes                                     |
| News lists                                                                                      | 1 minute       | 3 minutes                                     |
| Articles                                                                                        | 5 minutes      | 15 minutes                                    |
| Search                                                                                          | 30 seconds     | Fresh results only                            |
| Users, favorites, feeds and forums                                                              | 15 seconds     | Fresh results only                            |
| Explore favorite games                                                                          | 10 seconds     | Fresh results only                            |

Policies are defined in `src/services/requestCache.js`. Unknown endpoints, authentication endpoints, widget layout settings, writes, and `refresh=1` requests bypass stored responses. Widget settings always fetch their latest revision before editing.

At most 200 responses are retained, evicting the least recently used entries. Identical concurrent reads share a request; cancelling one view does not cancel other consumers. The last consumer cancels the transport. Errors and cancellations are not cached.

`sessionStore.peek(path, {allowStale: true})` supports immediate navigation without a loading flash. Fetching an expired response revalidates it in the background; a brief offline failure keeps previously resolved public content visible within its allowed age. Live score snapshots update the same cache and prevent an older HTTP response from overwriting it.

Use `request(path, {cache: "reload"})` for explicit refresh/retry: it bypasses stored data and previous in-flight reads. `cache: "no-store"` skips both reading and writing the cache. `useResource` and score/team hooks automatically bypass it when their refresh version changes.

Writes invalidate responses before and after the request, including uncertain failures. Signing in/out, changing account, or syncing a different remembered account clears the cache, cancels pending reads, and changes the scope observed by fetching hooks. Ordinary same-session token rotation and local profile hydration preserve cached sports data.

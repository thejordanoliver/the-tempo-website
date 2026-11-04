import assert from "node:assert/strict";
import test from "node:test";
import { hookHarness, flush } from "./helpers/hookHarness.mjs";

test("visited profile tabs stay mounted without eagerly opening unvisited tabs", async () => {
  const h = await hookHarness("src/hooks/useVisitedTabs.js");
  try {
    h.start("default", ["overview"]);
    assert.equal(JSON.stringify(h.state), '["overview"]');
    h.update(["stats"]);
    await flush();
    h.update(["gamelog"]);
    await flush();
    h.update(["overview"]);
    await flush();
    assert.equal(JSON.stringify(h.state), '["overview","stats","gamelog"]');
    h.update(["stats"]);
    await flush();
    assert.equal(JSON.stringify(h.state), '["overview","stats","gamelog"]');
  } finally {
    h.stop();
  }
});

test("season team metadata stays loading until every team resolves and rerenders do not refetch", async () => {
  const h = await hookHarness("src/hooks/usePlayerTeams.js");
  try {
    h.start("default", ["nba", [1, "1", 2]]);
    assert.equal(h.requests.length, 2);
    assert.equal(h.state.loading, true);
    h.requests[0].resolve({ team: { id: 1, code: "ATL", logo: "atl.png" } });
    await flush();
    assert.equal(h.state.loading, true);
    h.requests[1].resolve({ team: { id: 2, code: "BOS", logo: "bos.png" } });
    await flush();
    assert.equal(h.state.loading, false);
    assert.equal(h.state.teams["2"].code, "BOS");
    h.update(["nba", [2, 1, 1]]);
    await flush();
    assert.equal(h.requests.length, 2);
    assert.equal(h.state.teams["1"].logo, "atl.png");
  } finally {
    h.stop();
  }
});

test("team failures expose retry and old player or league responses cannot overwrite the new selection", async () => {
  const h = await hookHarness("src/hooks/usePlayerTeams.js");
  try {
    h.start("default", ["nba", [1]]);
    h.requests[0].reject(new Error("Team lookup failed"));
    await flush();
    assert.equal(h.state.error, "Team lookup failed");
    h.state.retry();
    await flush();
    assert.equal(h.requests.length, 2);
    assert.equal(h.state.loading, true);
    h.update(["cfb", [57]]);
    h.requests[1].resolve({ team: { code: "OLD" } });
    h.requests[2].resolve({
      team: { id: 57, code: "FLA", logo: "florida.png" },
    });
    await flush();
    assert.equal(h.state.teams["57"].code, "FLA");
    assert.equal(h.state.teams["1"], undefined);
    h.update(["cfb", []]);
    assert.equal(h.state.loading, false);
    assert.equal(h.state.error, null);
  } finally {
    h.stop();
  }
});

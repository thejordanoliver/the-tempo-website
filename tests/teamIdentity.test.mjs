import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { test } from "node:test";

import { build } from "esbuild";
await mkdir(".preview/tests", { recursive: true });
await build({
  entryPoints: ["src/data/teams/teamIdentity.js"],
  outfile: ".preview/tests/team-identity.mjs",
  bundle: true,
  platform: "node",
  format: "esm",
  loader: { ".png": "dataurl" },
});
const { teamIdentity, teamLogoSource } = await import(
  "../.preview/tests/team-identity.mjs"
);
for (const [id, name] of [
  [26, "Jazz"],
  [20, "76ers"],
]) {
  test(`${name} uses the app’s dark-background logo variant`, () => {
    const team = teamIdentity({ id }, "nba");
    assert.equal(team.shortName, name);
    assert.equal(team.logoDark, team.logoLight);
    assert.notEqual(team.logoDark, team.logo);
  });
}
test("unknown teams retain backend-provided theme variants", () => {
  const team = teamIdentity(
    {
      id: 999999,
      logo: "https://example.test/normal.png",
      logoDark: "https://example.test/dark.png",
    },
    "nba",
  );
  assert.equal(team.logoDark, "https://example.test/dark.png");
});

test("known teams prefer backend logo variants over bundled assets", () => {
  const team = teamIdentity(
    {
      id: 26,
      logo: "https://example.test/normal.png",
      logoDark: "https://example.test/dark.png",
    },
    "nba",
  );
  assert.equal(team.logo, "https://example.test/normal.png");
  assert.equal(team.logoDark, "https://example.test/dark.png");
});

test("team image src follows theme switches and forced dark backgrounds", () => {
  const team = teamIdentity(
    { id: 999999, logo: "normal.png", logoDark: "dark.png" },
    "nba",
  );
  assert.equal(teamLogoSource(team, "light"), "normal.png");
  assert.equal(teamLogoSource(team, "dark"), "dark.png");
  assert.equal(teamLogoSource(team, "light"), "normal.png");
  assert.equal(teamLogoSource(team, "light", true), "dark.png");
});

test("missing dark logos fall back to the available normal logo", () => {
  const team = teamIdentity(
    { id: 999999, logo: "normal.png", logoDark: null },
    "nba",
  );
  assert.equal(teamLogoSource(team, "dark"), "normal.png");
});

for (const [league, id] of [
  ["mcbb", 150],
  ["wcbb", 150],
  ["cfb", 245],
]) {
  test(`${league} keeps college dark logos through repeated card resolution and score refreshes`, () => {
    const raw = { id, logo: "https://example.test/normal.png" };
    const first = teamIdentity(raw, league);
    assert(first.logoDark.endsWith("/logo_dark.png"));
    assert.equal(
      teamLogoSource(teamIdentity(first, league), "dark"),
      first.logoDark,
    );
    const update = teamIdentity({ ...raw, score: 12 }, league);
    assert.equal(teamLogoSource(update, "dark"), first.logoDark);
    assert.equal(teamLogoSource(update, "light"), raw.logo);
  });
}

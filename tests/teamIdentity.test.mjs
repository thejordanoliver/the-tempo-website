import { test } from "node:test";
import assert from "node:assert/strict";
import { build } from "esbuild";
import { mkdir } from "node:fs/promises";
await mkdir(".preview/tests", { recursive: true });
await build({
  entryPoints: ["src/teamIdentity.js"],
  outfile: ".preview/tests/team-identity.mjs",
  bundle: true,
  platform: "node",
  format: "esm",
  loader: { ".png": "dataurl" },
});
const { teamIdentity } = await import("../.preview/tests/team-identity.mjs");
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

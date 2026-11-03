import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import path from "node:path";
import { test } from "node:test";
import { pathToFileURL, fileURLToPath } from "node:url";

import { build } from "esbuild";
const folder = path.resolve(".preview/tests/league-assets");
await build({
  entryPoints: ["src/data/leagues/favoriteLeagues.js"],
  outdir: folder,
  bundle: true,
  format: "esm",
  loader: { ".png": "file" },
  outExtension: { ".js": ".mjs" },
});
const { favoriteLeagues } = await import(
  pathToFileURL(path.join(folder, "favoriteLeagues.mjs")).href
);
test("league logos resolve beside their bundle for every page route", async () => {
  for (const [league, config] of Object.entries(favoriteLeagues)) {
    for (const source of [config.logo, config.logoDark]) {
      const url = new URL(source);
      assert.equal(path.dirname(fileURLToPath(url)), folder, league);
      await access(fileURLToPath(url));
      assert.equal(new URL(source, "https://example.test/home/").href, source);
    }
  }
});

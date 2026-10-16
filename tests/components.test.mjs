import { test } from "node:test";
import assert from "node:assert/strict";
import { build } from "esbuild";
import { mkdir, writeFile } from "node:fs/promises";
await mkdir(".preview/tests", { recursive: true });
const result = await build({
  stdin: {
    contents: `import React from 'react';import {renderToStaticMarkup} from 'react-dom/server';import Landing from './src/pages/Landing.jsx';import Support from './src/pages/Support.jsx';import Privacy from './src/pages/Privacy.jsx';import Game from './src/pages/Game.jsx';import Article from './src/pages/Article.jsx';import {safeURL} from './src/components.jsx';export {safeURL};export const render=(name,props={})=>renderToStaticMarkup(React.createElement({Landing,Support,Privacy,Game,Article}[name],props));`,
    resolveDir: process.cwd(),
    loader: "jsx",
  },
  bundle: true,
  write: false,
  platform: "node",
  format: "esm",
  jsx: "automatic",
  packages: "external",
});
await writeFile(".preview/tests/render.mjs", result.outputFiles[0].contents);
const { render, safeURL } = await import("../.preview/tests/render.mjs");
test("homepage preserves copy and links to the React sign-in route", () => {
  const html = render("Landing");
  assert(html.includes("YOUR GAME."));
  assert(html.includes('href="/login/"'));
  assert(!html.includes('href="./login/"'));
});
test("support and privacy remain public with contact and draft notice", () => {
  assert(render("Support").includes("jordanoliver@thetemposports.com"));
  assert(render("Privacy").includes("Draft — pending verification."));
});
test("invalid game/article links render recoverable states", () => {
  assert(
    render("Game", { search: "?id=bad" }).includes("Select a supported game"),
  );
  assert(render("Article", { search: "" }).includes("Select an article"));
});
test("external media/link validation rejects executable URLs", () => {
  assert.equal(safeURL("javascript:alert(1)"), null);
  assert.equal(safeURL("data:text/html,bad"), null);
  assert.equal(
    safeURL("https://example.test/story"),
    "https://example.test/story",
  );
});

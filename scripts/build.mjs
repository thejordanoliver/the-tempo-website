import { build } from "esbuild";
import { mkdir, writeFile, rm, readdir } from "node:fs/promises";
import path from "node:path";
export async function buildSite({
  outdir = process.cwd(),
  minify = true,
} = {}) {
  await mkdir(path.join(outdir, "web-assets"), { recursive: true });
  // Remove only previous generated bundles; user assets and app sources are preserved.
  const previousAssets = await readdir(path.join(outdir, "web-assets"));
  const api = process.env.TEMPO_API_URL || "http://192.168.1.225:4000";
  const url = new URL(api);
  if (!["http:", "https:"].includes(url.protocol))
    throw new Error("TEMPO_API_URL must use http(s)");
  const result = await build({
    entryPoints: ["src/main.jsx"],
    outdir: path.join(outdir, "web-assets"),
    entryNames: "app-[hash]",
    assetNames: "[name]-[hash]",
    bundle: true,
    minify,
    format: "esm",
    jsx: "automatic",
    target: ["es2022"],
    loader: { ".ttf": "file", ".png": "file" },
    define: { __TEMPO_API_URL__: JSON.stringify(api.replace(/\/+$/, "")) },
    metafile: true,
  });
  const outputs = Object.keys(result.metafile.outputs),
    js = path.basename(outputs.find((p) => p.endsWith(".js"))),
    css = path.basename(outputs.find((p) => p.endsWith(".css")));
  for (const route of [
    "",
    "home",
    "login",
    "profile",
    "support",
    "privacy",
    "game",
    "article",
  ]) {
    const prefix = route ? "../" : "./";
    const title = route
      ? route[0].toUpperCase() + route.slice(1)
      : "Your game. Your Tempo.";
    await mkdir(path.join(outdir, route), { recursive: true });
    await writeFile(
      path.join(outdir, route, "index.html"),
      `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="tempo-base" content="${prefix}"><meta name="description" content="Tempo sports scores, news, and fan conversations.">${route === "privacy" ? '<meta name="robots" content="noindex">' : ""}<title>${title} | Tempo Sports</title><link rel="stylesheet" href="${prefix}web-assets/${css}"><script type="module" src="${prefix}web-assets/${js}"></script></head><body><div id="root"></div><noscript>Enable JavaScript to use Tempo. Contact jordanoliver@thetemposports.com for help.</noscript></body></html>\n`,
    );
  }
  await writeFile(path.join(outdir, ".nojekyll"), "");
  // Old uploaded subfolder URLs redirect to canonical routes without duplicating the app.
  for (const route of [
    "",
    "home",
    "login",
    "profile",
    "support",
    "privacy",
    "game",
    "article",
  ]) {
    const prefix = route ? "../../" : "../";
    const destination = prefix + (route ? route + "/" : "");
    const folder = path.join(outdir, "tempo-website", route);
    await mkdir(folder, { recursive: true });
    await writeFile(
      path.join(folder, "index.html"),
      `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Tempo</title><script>location.replace(new URL(${JSON.stringify(destination)},location.href).href+location.search+location.hash)</script></head><body><a href="${destination}">Continue to Tempo</a></body></html>\n`,
    );
  }
  const retained = new Set(outputs.map((file) => path.basename(file)));
  for (const entry of previousAssets)
    if (!retained.has(entry) && /^(app|Oswald|BarlowCondensed)/.test(entry))
      await rm(path.join(outdir, "web-assets", entry));
  console.log(`React site built: ${js}, ${css}`);
  return result;
}
if (process.argv[1] === new URL(import.meta.url).pathname) await buildSite();

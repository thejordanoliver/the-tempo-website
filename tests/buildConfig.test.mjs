import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";

import { getApiUrl } from "../scripts/build.mjs";

test("build loads the HTTPS API from .env and allows explicit environment overrides", () => {
  const folder = mkdtempSync(path.join(tmpdir(), "tempo-build-config-"));
  const envPath = path.join(folder, ".env");
  try {
    writeFileSync(
      envPath,
      '# API configuration\nTEMPO_API_URL="https://the-tempo-api.onrender.com/"\n',
    );
    assert.equal(
      getApiUrl({ env: {}, envPath }),
      "https://the-tempo-api.onrender.com",
    );
    assert.equal(
      getApiUrl({ env: { TEMPO_API_URL: "http://localhost:4000" }, envPath }),
      "http://localhost:4000",
    );
    writeFileSync(envPath, "TEMPO_API_URL=invalid\n");
    assert.throws(
      () => getApiUrl({ env: {}, envPath }),
      /absolute http\(s\) URL/,
    );
    writeFileSync(envPath, "TEMPO_API_URL=ftp://example.test\n");
    assert.throws(() => getApiUrl({ env: {}, envPath }), /must use http/);
  } finally {
    rmSync(folder, { recursive: true, force: true });
  }
});

test("build requires configuration instead of silently using a private HTTP address", () => {
  const folder = mkdtempSync(path.join(tmpdir(), "tempo-build-config-"));
  const envPath = path.join(folder, ".env");
  try {
    assert.throws(() => getApiUrl({ env: {}, envPath }), /Set TEMPO_API_URL/);
    assert.equal(
      getApiUrl({ env: { TEMPO_API_URL: "https://example.test" }, envPath }),
      "https://example.test",
    );
    writeFileSync(envPath, "TEMPO_API_URL=   \n");
    assert.throws(() => getApiUrl({ env: {}, envPath }), /Set TEMPO_API_URL/);
  } finally {
    rmSync(folder, { recursive: true, force: true });
  }
});

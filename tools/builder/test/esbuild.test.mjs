import { test } from "node:test";
import assert from "node:assert/strict";
import { build } from "esbuild";
import { readFile, mkdtemp, writeFile, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";
import { createRequire } from "node:module";

const here = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

// Bundle build/esbuild.ts with esbuild-wasm EXTERNAL so the test and the module
// share one esbuild-wasm instance (initialized here with a compiled wasmModule).
async function loadBuild() {
  const dir = await mkdtemp(join(tmpdir(), "wvi-esb-"));
  const entry = join(dir, "entry.ts");
  await writeFile(
    entry,
    `export * from ${JSON.stringify(join(here, "../src/build/esbuild.ts"))};
     export { MemFs } from ${JSON.stringify(join(here, "../src/npm/memfs.ts"))};`,
  );
  const out = join(here, ".wvi-esb-test.cjs");
  await build({
    entryPoints: [entry],
    bundle: true,
    format: "cjs",
    platform: "node",
    outfile: out,
    external: ["esbuild-wasm"],
    logLevel: "silent",
  });
  const mod = require(out);
  return { mod, cleanup: () => rm(dir, { recursive: true, force: true }) };
}

test("esbuild-wasm bundles TSX + react from memfs to a runnable dist", async () => {
  // In Node, esbuild-wasm auto-initializes from its bundled wasm on first build.
  const { mod, cleanup } = await loadBuild();
  const fs = new mod.MemFs();
  // Minimal react/react-dom stubs in node_modules so bundling resolves bare imports.
  fs.writeText("node_modules/react/package.json", JSON.stringify({ name: "react", version: "18.2.0", main: "index.js" }));
  fs.writeText("node_modules/react/index.js", "module.exports = { createElement: (t, p, ...c) => ({ t, p, c }) };");
  fs.writeText("node_modules/react-dom/package.json", JSON.stringify({ name: "react-dom", version: "18.2.0", main: "client.js" }));
  fs.writeText("node_modules/react-dom/client.js", "exports.createRoot = (el) => ({ render: (v) => { el.__rendered = v; } });");
  fs.writeText("src/main.tsx", "import React from 'react';\nimport { createRoot } from 'react-dom/client';\nconst App = () => <h1>Hello esbuild</h1>;\ncreateRoot(document.getElementById('root')).render(<App />);\n");

  const outputs = await mod.buildProject(fs, "src/main.tsx");
  assert.ok(outputs.length >= 1, "expected at least one output");
  const js = outputs.find((o) => o.path.endsWith(".js"));
  assert.ok(js, "expected a js bundle");
  const text = new TextDecoder().decode(js.contents);
  assert.ok(text.includes("Hello esbuild"), "bundle must contain the app string");
  assert.ok(text.includes("createRoot"), "bundle must include react-dom client");
  await cleanup();
});

test("esbuild resolves relative TS imports and strips types", async () => {
  const esbuild = require("esbuild-wasm");
  const { mod, cleanup } = await loadBuild();
  const fs = new mod.MemFs();
  fs.writeText("src/util.ts", "export const add = (a: number, b: number): number => a + b;");
  fs.writeText("src/main.ts", "import { add } from './util';\nconsole.log(add(1, 2));");
  const outputs = await mod.buildProject(fs, "src/main.ts");
  const js = outputs.find((o) => o.path.endsWith(".js"));
  const text = new TextDecoder().decode(js.contents);
  assert.ok(!text.includes(": number"), "types must be stripped");
  assert.ok(text.length > 0, "bundle must be non-empty");
  // The relative import's body (a+b) must be inlined by bundling.
  assert.ok(/\+\s*\w|\w\s*\+/.test(text), "relative import body must be bundled");
  await cleanup();
});
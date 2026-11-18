// Real tsc over memfs: error case, clean case, .vue shim, no-ts case.
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
const ts = require("typescript");

// Concatenated lib closure, mirroring BuildController.TS_LIBS.
const LIBS = [
  "lib.es2020.d.ts", "lib.es2019.d.ts", "lib.es2018.d.ts", "lib.es2017.d.ts",
  "lib.es2016.d.ts", "lib.es2015.d.ts", "lib.es5.d.ts",
  "lib.decorators.d.ts", "lib.decorators.legacy.d.ts",
  "lib.es2015.core.d.ts", "lib.es2015.collection.d.ts", "lib.es2015.iterable.d.ts",
  "lib.es2015.symbol.d.ts", "lib.es2015.generator.d.ts", "lib.es2015.promise.d.ts",
  "lib.es2015.proxy.d.ts", "lib.es2015.reflect.d.ts", "lib.es2015.symbol.wellknown.d.ts",
  "lib.es2016.array.include.d.ts", "lib.es2016.intl.d.ts",
  "lib.es2017.arraybuffer.d.ts", "lib.es2017.date.d.ts", "lib.es2017.intl.d.ts",
  "lib.es2017.object.d.ts", "lib.es2017.sharedmemory.d.ts", "lib.es2017.string.d.ts",
  "lib.es2017.typedarrays.d.ts",
  "lib.es2018.asynciterable.d.ts", "lib.es2018.asyncgenerator.d.ts", "lib.es2018.promise.d.ts",
  "lib.es2018.regexp.d.ts", "lib.es2018.intl.d.ts",
  "lib.es2019.array.d.ts", "lib.es2019.object.d.ts", "lib.es2019.string.d.ts",
  "lib.es2019.symbol.d.ts", "lib.es2019.intl.d.ts",
  "lib.es2020.bigint.d.ts", "lib.es2020.intl.d.ts", "lib.es2020.date.d.ts",
  "lib.es2020.number.d.ts", "lib.es2020.promise.d.ts", "lib.es2020.sharedmemory.d.ts",
  "lib.es2020.string.d.ts", "lib.es2020.symbol.wellknown.d.ts",
  "lib.dom.d.ts", "lib.dom.iterable.d.ts", "lib.dom.asynciterable.d.ts",
];
const libsText = (
  await Promise.all(LIBS.map((n) => readFile(join(here, "../node_modules/typescript/lib", n), "utf8")))
).join("\n");

async function loadTc() {
  const dir = await mkdtemp(join(tmpdir(), "wvi-tc-"));
  const entry = join(dir, "entry.ts");
  await writeFile(
    entry,
    `export * from ${JSON.stringify(join(here, "../src/build/typecheck.ts"))};
     export { MemFs } from ${JSON.stringify(join(here, "../src/npm/memfs.ts"))};`,
  );
  const out = join(here, ".wvi-tc-test.cjs");
  await build({ entryPoints: [entry], bundle: true, format: "cjs", platform: "node", outfile: out, logLevel: "silent" });
  const mod = require(out);
  return { mod, cleanup: () => rm(dir, { recursive: true, force: true }) };
}

test("type error is reported with file:line:col", async () => {
  const { mod, cleanup } = await loadTc();
  const fs = new mod.MemFs();
  fs.writeText("src/main.ts", "const n: number = 'oops';\nconsole.log(n);\n");
  const r = await mod.runTypecheck(fs, libsText, ts);
  assert.equal(r.ok, false);
  assert.equal(r.checkedFiles, 1);
  assert.ok(r.errors.some((e) => e.startsWith("src/main.ts:1:")), r.errors.join("\n"));
  await cleanup();
});

test("clean TS passes and DOM lib is available", async () => {
  const { mod, cleanup } = await loadTc();
  const fs = new mod.MemFs();
  fs.writeText("src/main.ts", "const el: HTMLElement | null = document.querySelector('#app');\nconst n: number = 1;\nconsole.log(el, n);\n");
  const r = await mod.runTypecheck(fs, libsText, ts);
  assert.equal(r.ok, true, r.errors.join("\n"));
  await cleanup();
});

test(".vue import resolves via shim; vue-internal not checked", async () => {
  const { mod, cleanup } = await loadTc();
  const fs = new mod.MemFs();
  fs.writeText("src/App.vue", "<template><b>{{n}}</b></template><script setup lang=\"ts\">const n: number = 'bad'</script>");
  fs.writeText("src/main.ts", "import App from './App.vue';\nconsole.log(App);\n");
  const r = await mod.runTypecheck(fs, libsText, ts);
  // main.ts is clean; the SFC's internal type error is out of scope for v1.
  assert.equal(r.ok, true, r.errors.join("\n"));
  assert.equal(r.checkedFiles, 1);
  await cleanup();
});

test("no ts files -> trivially ok", async () => {
  const { mod, cleanup } = await loadTc();
  const fs = new mod.MemFs();
  fs.writeText("src/main.js", "console.log(1);");
  const r = await mod.runTypecheck(fs, libsText, ts);
  assert.equal(r.ok, true);
  assert.equal(r.checkedFiles, 0);
  await cleanup();
});
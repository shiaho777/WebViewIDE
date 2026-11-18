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

test("without vue deps: shim fallback + explicit note", async () => {
  const { mod, cleanup } = await loadTc();
  const fs = new mod.MemFs();
  fs.writeText("src/App.vue", "<template><b>{{n}}</b></template><script setup lang=\"ts\">const n: number = 'bad'</script>");
  fs.writeText("src/main.ts", "import App from './App.vue';\nconsole.log(App);\n");
  const r = await mod.runTypecheck(fs, libsText, ts);
  assert.equal(r.ok, true, r.errors.join("\n"));
  assert.equal(r.checkedFiles, 1);
  assert.ok(r.notes.some((n) => n.includes("未安装 vue")), r.notes.join("\n"));
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

// ---- SFC-internal checking (real compiler-sfc asset + vue type stub) ----
import vm from "node:vm";

async function loadVueCompiler() {
  const code = await readFile(join(here, "../../../app/src/main/assets/builder/vue-compiler.js"), "utf8");
  const sandbox = { console, setTimeout, clearTimeout, TextEncoder, TextDecoder, URL, process: { env: {} } };
  sandbox.window = sandbox;
  sandbox.self = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox, { filename: "vue-compiler.js" });
  return sandbox.VueCompilerSFC;
}

// Minimal but real-shaped vue typings: ref<T> returns Ref<T> with typed .value.
function vueStub(fs) {
  fs.writeText("node_modules/vue/package.json", JSON.stringify({ name: "vue", version: "3.5.45", module: "index.js", types: "index.d.ts" }));
  fs.writeText("node_modules/vue/index.js", "export const ref = (v) => ({ value: v });\nexport const createApp = (c) => ({ mount: () => {} });\n");
  fs.writeText(
    "node_modules/vue/index.d.ts",
    "export interface Ref<T> { value: T }\nexport declare function ref<T>(value: T): Ref<T>;\nexport declare function ref<T = any>(): Ref<T | undefined>;\nexport declare function createApp(root: any): { mount(el: string | Element): void };\nexport declare function defineComponent<T>(c: T): T;\nexport declare function openBlock(): void;\nexport declare function createElementBlock(...args: any[]): any;\nexport declare function createElementVNode(...args: any[]): any;\nexport declare function toDisplayString(v: any): string;\nexport declare function withDirectives(...args: any[]): any;\nexport declare const vModelText: any;\n",
  );
}

test("SFC script-setup type error is reported against the .vue file", async () => {
  const { mod, cleanup } = await loadTc();
  const compiler = await loadVueCompiler();
  const fs = new mod.MemFs();
  vueStub(fs);
  fs.writeText(
    "src/App.vue",
    `<template><b>{{ n }}</b></template>\n<script setup lang="ts">\nimport { ref } from 'vue'\nconst n = ref<number>('bad')\n</script>`,
  );
  fs.writeText("src/main.ts", "import { createApp } from 'vue';\nimport App from './App.vue';\ncreateApp(App).mount('#app');");
  const r = await mod.runTypecheck(fs, libsText, ts, compiler);
  assert.equal(r.ok, false);
  const hit = r.errors.find((e) => e.startsWith("src/App.vue:"));
  assert.ok(hit, "error must be reported against .vue, got:\n" + r.errors.join("\n"));
  // 'bad' sits on line 4 of the SFC; sourcemap must land there.
  assert.ok(/src\/App\.vue:4:/.test(hit), "expected line 4, got: " + hit);
  await cleanup();
});

test("SFC template expression type error maps to the template line", async () => {
  const { mod, cleanup } = await loadTc();
  const compiler = await loadVueCompiler();
  const fs = new mod.MemFs();
  vueStub(fs);
  fs.writeText(
    "src/App.vue",
    `<template>\n  <b>{{ n.toFixed(2) }}</b>\n</template>\n<script setup lang="ts">\nimport { ref } from 'vue'\nconst n = ref<string>('x')\n</script>`,
  );
  fs.writeText("src/main.ts", "import { createApp } from 'vue';\nimport App from './App.vue';\ncreateApp(App).mount('#app');");
  const r = await mod.runTypecheck(fs, libsText, ts, compiler);
  assert.equal(r.ok, false);
  const hit = r.errors.find((e) => e.startsWith("src/App.vue:") && e.includes("toFixed"));
  assert.ok(hit, "template error expected, got:\n" + r.errors.join("\n"));
  assert.ok(/src\/App\.vue:2:/.test(hit), "expected template line 2, got: " + hit);
  await cleanup();
});

test("clean typed SFC passes", async () => {
  const { mod, cleanup } = await loadTc();
  const compiler = await loadVueCompiler();
  const fs = new mod.MemFs();
  vueStub(fs);
  fs.writeText(
    "src/App.vue",
    `<template><button @click="n++">{{ n }}</button></template>\n<script setup lang="ts">\nimport { ref } from 'vue'\nconst n = ref<number>(0)\n</script>\n<style scoped>button { color: red }</style>`,
  );
  fs.writeText("src/main.ts", "import { createApp } from 'vue';\nimport App from './App.vue';\ncreateApp(App).mount('#app');");
  const r = await mod.runTypecheck(fs, libsText, ts, compiler);
  assert.equal(r.ok, true, r.errors.join("\n"));
  await cleanup();
});

test("lang=js SFC is skipped with a note", async () => {
  const { mod, cleanup } = await loadTc();
  const compiler = await loadVueCompiler();
  const fs = new mod.MemFs();
  vueStub(fs);
  fs.writeText("src/Legacy.vue", `<template><i>x</i></template>\n<script>export default { data() { return { bad: 1 } } }</script>`);
  fs.writeText("src/main.ts", "import { createApp } from 'vue';\nimport L from './Legacy.vue';\ncreateApp(L).mount('#app');");
  const r = await mod.runTypecheck(fs, libsText, ts, compiler);
  assert.equal(r.ok, true, r.errors.join("\n"));
  assert.ok(r.notes.some((n) => n.includes("js/无脚本")), r.notes.join("\n"));
  await cleanup();
});
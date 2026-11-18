// Real esbuild-wasm builds of .vue projects: the onLoad plugin compiles SFCs
// with the committed compiler asset (vm-loaded, injected via the global).
import { test } from "node:test";
import assert from "node:assert/strict";
import { build } from "esbuild";
import { readFile, mkdtemp, writeFile, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";
import { createRequire } from "node:module";
import vm from "node:vm";

const here = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

async function loadBuildWithCompiler() {
  // Load the committed IIFE asset and expose it as the global the loader reads.
  const code = await readFile(join(here, "../../../app/src/main/assets/builder/vue-compiler.js"), "utf8");
  const sandbox = { console, setTimeout, clearTimeout, TextEncoder, TextDecoder, URL, process: { env: {} } };
  sandbox.window = sandbox;
  sandbox.self = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox, { filename: "vue-compiler.js" });
  globalThis.window = sandbox; // ensureVueCompiler() short-circuits on this

  const dir = await mkdtemp(join(tmpdir(), "wvi-vue-"));
  const entry = join(dir, "entry.ts");
  await writeFile(
    entry,
    `export * from ${JSON.stringify(join(here, "../src/build/esbuild.ts"))};
     export { MemFs } from ${JSON.stringify(join(here, "../src/npm/memfs.ts"))};
     export { sfcId } from ${JSON.stringify(join(here, "../src/build/vue.ts"))};`,
  );
  const out = join(here, ".wvi-vue-test.cjs");
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

function vueStub(fs) {
  fs.writeText("node_modules/vue/package.json", JSON.stringify({ name: "vue", version: "3.5.45", module: "index.js" }));
  fs.writeText(
    "node_modules/vue/index.js",
    "export const ref = (v) => ({ value: v });\nexport const createApp = (c) => ({ mount: (el) => { el.__app = c; } });\nexport const openBlock = () => {};\nexport const createElementBlock = (t, p, c) => ({ t, p, c });\nexport const createElementVNode = (t, p, c) => ({ t, p, c });\nexport const toDisplayString = (v) => String(v);\nexport const Fragment = Symbol('f');\nexport const renderList = () => [];\nexport const defineComponent = (c) => c;\n",
  );
}

const decode = (outputs) => {
  const js = outputs.find((o) => o.path.endsWith(".js"));
  assert.ok(js, "expected a js bundle");
  return new TextDecoder().decode(js.contents);
};

test("script setup + TS + scoped style builds end to end", async () => {
  const { mod, cleanup } = await loadBuildWithCompiler();
  const fs = new mod.MemFs();
  vueStub(fs);
  fs.writeText(
    "src/App.vue",
    `<template><button @click="n++">{{ n }}</button></template>
<script setup lang="ts">
import { ref } from 'vue'
const n = ref<number>(0)
</script>
<style scoped>button { color: red }</style>`,
  );
  fs.writeText("src/main.ts", "import { createApp } from 'vue';\nimport App from './App.vue';\ncreateApp(App).mount('#app');");
  const text = decode(await mod.buildProject(fs, "src/main.ts"));
  const id = mod.sfcId("src/App.vue");
  assert.ok(text.includes(id), "scoped id must appear in the bundle");
  assert.ok(text.includes("__scopeId=") || text.includes("__scopeId ="), "component __scopeId attached");
  assert.ok(text.includes("color: red") || text.includes("color:red"), "scoped css injected");
  assert.ok(!text.includes(": number"), "TS types stripped");
  assert.ok(text.includes("createApp") || text.includes("__app"), "entry wired");
  await cleanup();
});

test("plain script SFC gets a separate render attached", async () => {
  const { mod, cleanup } = await loadBuildWithCompiler();
  const fs = new mod.MemFs();
  vueStub(fs);
  fs.writeText(
    "src/Plain.vue",
    `<template><p>{{ msg }}</p></template>
<script>
export default { data() { return { msg: 'plain-hello' } } }
</script>`,
  );
  fs.writeText("src/main.js", "import { createApp } from 'vue';\nimport P from './Plain.vue';\ncreateApp(P).mount('#app');");
  const text = decode(await mod.buildProject(fs, "src/main.js"));
  assert.ok(text.includes("plain-hello"), "script body bundled");
  assert.ok(/render/.test(text), "render attached");
  await cleanup();
});

test("template-only SFC builds without any script", async () => {
  const { mod, cleanup } = await loadBuildWithCompiler();
  const fs = new mod.MemFs();
  vueStub(fs);
  fs.writeText("src/Static.vue", "<template><h1>static-title</h1></template>");
  fs.writeText("src/main.js", "import { createApp } from 'vue';\nimport S from './Static.vue';\ncreateApp(S).mount('#app');");
  const text = decode(await mod.buildProject(fs, "src/main.js"));
  assert.ok(text.includes("static-title"), "template content bundled");
  await cleanup();
});

test("extensionless .vue import resolves; bad SFC reports the filename", async () => {
  const { mod, cleanup } = await loadBuildWithCompiler();
  const fs = new mod.MemFs();
  vueStub(fs);
  fs.writeText("src/App.vue", "<template><i>ext-less</i></template>");
  fs.writeText("src/main.js", "import { createApp } from 'vue';\nimport A from './App';\ncreateApp(A).mount('#app');");
  const text = decode(await mod.buildProject(fs, "src/main.js"));
  assert.ok(text.includes("ext-less"), "extensionless .vue resolved");

  const bad = new mod.MemFs();
  vueStub(bad);
  bad.writeText("src/Bad.vue", "<template><p></template>");
  bad.writeText("src/main.js", "import B from './Bad.vue';\nconsole.log(B);");
  await assert.rejects(() => mod.buildProject(bad, "src/main.js"), /Bad\.vue/);
  await cleanup();
});
// Verifies the committed vue-compiler.js asset: the IIFE global loads in a
// bare context and compiles all three SFC shapes (setup / plain / no script).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const here = dirname(fileURLToPath(import.meta.url));
const assetPath = join(here, "../../../app/src/main/assets/builder/vue-compiler.js");

async function loadCompiler() {
  const code = await readFile(assetPath, "utf8");
  const sandbox = { console, setTimeout, clearTimeout, TextEncoder, TextDecoder, URL, process: { env: {} } };
  sandbox.window = sandbox;
  sandbox.self = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox, { filename: "vue-compiler.js" });
  assert.ok(sandbox.VueCompilerSFC, "IIFE global VueCompilerSFC must exist");
  return sandbox.VueCompilerSFC;
}

test("asset loads and exposes the compiler API", async () => {
  const c = await loadCompiler();
  for (const fn of ["parse", "compileScript", "compileTemplate", "compileStyleAsync"]) {
    assert.equal(typeof c[fn], "function", fn);
  }
});

test("script setup + TS compiles with inline template", async () => {
  const c = await loadCompiler();
  const src = `<template><button @click="n++">{{ n }}</button></template>
<script setup lang="ts">
import { ref } from 'vue'
const n = ref<number>(0)
</script>`;
  const { descriptor, errors } = c.parse(src, { filename: "App.vue" });
  assert.equal(errors.length, 0);
  const out = c.compileScript(descriptor, {
    id: "data-v-test1234",
    inlineTemplate: true,
    genDefaultAs: "__sfc__",
    templateOptions: { compilerOptions: { expressionPlugins: ["typescript"] } },
  });
  assert.ok(out.content.includes("__sfc__"), "genDefaultAs honoured");
  assert.ok(out.content.includes("ref"), "script body preserved");
  // Inline template means render logic is inside the setup output.
  assert.ok(/onClick|n\+\+|_ctx|\$setup/.test(out.content), "template compiled inline");
});

test("plain script compiles and template renders separately", async () => {
  const c = await loadCompiler();
  const src = `<template><p>{{ msg }}</p></template>
<script>
export default { data() { return { msg: 'hi' } } }
</script>`;
  const { descriptor, errors } = c.parse(src, { filename: "Plain.vue" });
  assert.equal(errors.length, 0);
  const script = c.compileScript(descriptor, { id: "data-v-plain001" });
  assert.ok(script.content.includes("data()"));
  const tpl = c.compileTemplate({
    source: descriptor.template.content,
    filename: "Plain.vue",
    id: "data-v-plain001",
  });
  assert.equal(tpl.errors.length, 0);
  assert.ok(tpl.code.includes("render") || tpl.code.includes("function"), "render code generated");
});

test("no-script SFC compiles template only", async () => {
  const c = await loadCompiler();
  const src = `<template><h1>static</h1></template>`;
  const { descriptor, errors } = c.parse(src, { filename: "Static.vue" });
  assert.equal(errors.length, 0);
  assert.equal(descriptor.script, null);
  assert.equal(descriptor.scriptSetup, null);
  const tpl = c.compileTemplate({ source: descriptor.template.content, filename: "Static.vue", id: "x" });
  assert.equal(tpl.errors.length, 0);
  assert.ok(tpl.code.length > 0);
});

test("scoped style compiles with data-v attribute", async () => {
  const c = await loadCompiler();
  const src = `<template><p>x</p></template><style scoped>p { color: red }</style>`;
  const { descriptor } = c.parse(src, { filename: "Scoped.vue" });
  assert.equal(descriptor.styles.length, 1);
  assert.ok(descriptor.styles[0].scoped);
  const out = await c.compileStyleAsync({
    source: descriptor.styles[0].content,
    filename: "Scoped.vue",
    id: "data-v-abcd1234",
    scoped: true,
  });
  assert.equal(out.errors.length, 0);
  assert.ok(out.code.includes("[data-v-abcd1234]"), "scoped selector rewritten");
});
// Builds the npm/esbuild build-runtime bundle into app/src/main/assets/builder/.
// Output is committed to git; the Android build never needs Node. manifest.json
// records source/lockfile/bundle hashes so CI can verify (see ci.yml).
import { build } from "esbuild";
import { createHash } from "node:crypto";
import { copyFile, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = join(here, "../../app/src/main/assets/builder");
await mkdir(outDir, { recursive: true });

await build({
  entryPoints: [join(here, "src/main.ts")],
  bundle: true,
  minify: true,
  format: "iife",
  target: ["chrome90"],
  outfile: join(outDir, "builder.bundle.js"),
  legalComments: "none",
  logLevel: "info",
});

// Vue SFC compiler: the official self-contained browser ESM bundle, minified
// into an IIFE global so the file:// build page can load it as a classic script
// (dynamic ESM import is unreliable on WebView file:// origins).
await build({
  entryPoints: [join(here, "node_modules/@vue/compiler-sfc/dist/compiler-sfc.esm-browser.js")],
  bundle: true,
  minify: true,
  format: "iife",
  globalName: "VueCompilerSFC",
  target: ["chrome90"],
  outfile: join(outDir, "vue-compiler.js"),
  legalComments: "none",
  logLevel: "info",
});

await copyFile(join(here, "src/index.html"), join(outDir, "index.html"));

async function* walk(dir) {
  for (const ent of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, ent.name);
    if (ent.isDirectory()) yield* walk(p);
    else yield p;
  }
}

const sha = (buf) => createHash("sha256").update(buf).digest("hex");
const sources = {};
for await (const p of walk(join(here, "src"))) {
  sources[relative(here, p).replaceAll("\\", "/")] = sha(await readFile(p));
}
const manifest = {
  generator: "tools/builder/build.mjs",
  sources,
  buildScript: sha(await readFile(join(here, "build.mjs"))),
  packageJson: sha(await readFile(join(here, "package.json"))),
  lockfile: sha(await readFile(join(here, "package-lock.json"))),
  bundle: sha(await readFile(join(outDir, "builder.bundle.js"))),
  vueCompiler: sha(await readFile(join(outDir, "vue-compiler.js"))),
};
await writeFile(join(outDir, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
console.log("manifest.json written");
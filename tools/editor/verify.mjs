// Verifies the committed editor bundle matches the committed sources.
// Used by CI so the Android build can stay Node-free while the bundle
// in app/src/main/assets/editor/ is provably built from tools/editor/src.
import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = join(here, "../../app/src/main/assets/editor");
const sha = (buf) => createHash("sha256").update(buf).digest("hex");

const manifest = JSON.parse(await readFile(join(outDir, "manifest.json"), "utf8"));
const problems = [];

async function* walk(dir) {
  for (const ent of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, ent.name);
    if (ent.isDirectory()) yield* walk(p);
    else yield p;
  }
}

const sources = {};
for await (const p of walk(join(here, "src"))) {
  sources[relative(here, p).replaceAll("\\", "/")] = sha(await readFile(p));
}
const expected = JSON.stringify(Object.fromEntries(Object.entries(sources).sort()));
const recorded = JSON.stringify(Object.fromEntries(Object.entries(manifest.sources ?? {}).sort()));
if (expected !== recorded) problems.push("src/ hashes differ from manifest.json — run `npm run build` and commit the result");

for (const [key, path] of [
  ["buildScript", join(here, "build.mjs")],
  ["packageJson", join(here, "package.json")],
  ["lockfile", join(here, "package-lock.json")],
  ["bundle", join(outDir, "editor.bundle.js")],
]) {
  if (sha(await readFile(path)) !== manifest[key]) problems.push(`${key} hash differs from manifest.json`);
}

if (problems.length) {
  console.error("Editor bundle verification FAILED:\n- " + problems.join("\n- "));
  process.exit(1);
}
console.log("Editor bundle matches committed sources.");
import { test } from "node:test";
import assert from "node:assert/strict";
import { gzipSync } from "node:zlib";
import { createHash } from "node:crypto";
import { build } from "esbuild";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";

const here = dirname(fileURLToPath(import.meta.url));

// Bundle the npm modules to a temp ESM file so Node can import the TS sources.
async function loadNpm() {
  const dir = await mkdtemp(join(tmpdir(), "wvi-npm-"));
  const entry = join(dir, "entry.ts");
  await writeFile(
    entry,
    `export * from ${JSON.stringify(join(here, "../src/npm/semver.ts"))};
     export * from ${JSON.stringify(join(here, "../src/npm/tar.ts"))};
     export * from ${JSON.stringify(join(here, "../src/npm/memfs.ts"))};
     export * from ${JSON.stringify(join(here, "../src/npm/native.ts"))};
     export * from ${JSON.stringify(join(here, "../src/npm/install.ts"))};`,
  );
  const out = join(dir, "bundle.mjs");
  await build({ entryPoints: [entry], bundle: true, format: "esm", platform: "node", outfile: out, logLevel: "silent" });
  const mod = await import(out);
  return { mod, cleanup: () => rm(dir, { recursive: true, force: true }) };
}

function tarHeader(name, size) {
  const h = new Uint8Array(512);
  const put = (s, off, len) => { for (let i = 0; i < s.length && i < len; i++) h[off + i] = s.charCodeAt(i); };
  put(name, 0, 100);
  put("0000644\0", 100, 8);
  put("0000000\0", 108, 8);
  put("0000000\0", 116, 8);
  const oct = size.toString(8).padStart(11, "0") + "\0";
  put(oct, 124, 12);
  put("        ", 148, 8); // checksum placeholder (spaces)
  h[156] = 48; // '0' regular file
  put("ustar\0", 257, 6);
  let sum = 0;
  for (const b of h) sum += b;
  const cs = sum.toString(8).padStart(6, "0") + "\0 ";
  put(cs, 148, 8);
  return h;
}

function makeTarball(files) {
  const chunks = [];
  for (const [name, content] of Object.entries(files)) {
    const data = new TextEncoder().encode(content);
    chunks.push(tarHeader("package/" + name, data.length));
    chunks.push(data);
    const pad = (512 - (data.length % 512)) % 512;
    if (pad) chunks.push(new Uint8Array(pad));
  }
  chunks.push(new Uint8Array(1024)); // end blocks
  let total = 0;
  for (const c of chunks) total += c.length;
  const tar = new Uint8Array(total);
  let off = 0;
  for (const c of chunks) { tar.set(c, off); off += c.length; }
  return gzipSync(tar);
}

const integrityOf = (gz) => "sha512-" + createHash("sha512").update(gz).digest("base64");

test("semver subset resolves common ranges", async () => {
  const { mod, cleanup } = await loadNpm();
  const { satisfies, maxSatisfying } = mod;
  assert.ok(satisfies("1.2.3", "^1.0.0"));
  assert.ok(!satisfies("2.0.0", "^1.0.0"));
  assert.ok(satisfies("1.2.9", "~1.2.3"));
  assert.ok(!satisfies("1.3.0", "~1.2.3"));
  assert.ok(satisfies("1.5.0", ">=1.0.0 <2.0.0"));
  assert.ok(satisfies("3.1.0", "1.x || ^3.0.0"));
  assert.equal(maxSatisfying(["1.0.0", "1.2.0", "2.0.0"], "^1.0.0"), "1.2.0");
  assert.equal(maxSatisfying(["1.0.0", "1.1.0-beta.1"], "^1.0.0"), "1.0.0"); // prerelease excluded
  await cleanup();
});

test("tar extracts and strips package/ prefix", async () => {
  const { mod, cleanup } = await loadNpm();
  const gz = makeTarball({ "index.js": "console.log(1)", "lib/a.js": "export default 2" });
  const entries = mod.extractTarball(gz);
  const names = entries.map((e) => e.name).sort();
  assert.deepEqual(names, ["index.js", "lib/a.js"]);
  assert.equal(new TextDecoder().decode(entries.find((e) => e.name === "index.js").data), "console.log(1)");
  await cleanup();
});

test("integrity verify accepts good and rejects bad", async () => {
  const { mod, cleanup } = await loadNpm();
  const gz = makeTarball({ "index.js": "x" });
  assert.ok(await mod.verifyIntegrity(gz, integrityOf(gz)));
  assert.ok(!(await mod.verifyIntegrity(gz, "sha512-AAAA")));
  await cleanup();
});

test("memfs confines paths and evicts subtrees", async () => {
  const { mod, cleanup } = await loadNpm();
  const fs = new mod.MemFs();
  assert.ok(fs.writeText("node_modules/a/index.js", "x"));
  assert.ok(!fs.writeText("../escape.js", "x"));
  assert.ok(fs.exists("node_modules/a/index.js"));
  assert.equal(fs.evictPrefix("node_modules/a"), 1);
  assert.ok(!fs.exists("node_modules/a/index.js"));
  await cleanup();
});

test("native packages are detected", async () => {
  const { mod, cleanup } = await loadNpm();
  assert.ok(mod.nativeReason({ name: "x", gypfile: true }, []));
  assert.ok(mod.nativeReason({ name: "x" }, ["binding.gyp"]));
  assert.ok(mod.nativeReason({ name: "x", scripts: { install: "node-gyp rebuild" } }, []));
  assert.equal(mod.nativeReason({ name: "react", scripts: {} }, ["index.js"]), null);
  await cleanup();
});

test("install resolves, extracts, and writes lock against mock registry", async () => {
  const { mod, cleanup } = await loadNpm();
  const gz = makeTarball({ "index.js": "module.exports=1", "package.json": '{"name":"lodash","version":"4.17.21"}' });
  const meta = { versions: { "4.17.21": { name: "lodash", version: "4.17.21", dist: { tarball: "https://registry.npmjs.org/lodash/-/lodash-4.17.21.tgz", integrity: integrityOf(gz) } } } };
  const net = {
    async fetch(url, integrity) {
      if (url.endsWith("/lodash")) return new TextEncoder().encode(JSON.stringify(meta));
      return gz;
    },
  };
  const fs = new mod.MemFs();
  const log = { log() {}, progress() {} };
  const res = await mod.install({ lodash: "^4.0.0" }, net, fs, log);
  assert.ok(res.ok, res.error);
  assert.equal(res.installed.lodash, "4.17.21");
  assert.ok(fs.exists("node_modules/lodash/index.js"));
  assert.ok(fs.exists("package-lock.json"));
  await cleanup();
});

test("install fails on integrity mismatch", async () => {
  const { mod, cleanup } = await loadNpm();
  const gz = makeTarball({ "index.js": "x" });
  const meta = { versions: { "1.0.0": { name: "p", version: "1.0.0", dist: { tarball: "https://registry.npmjs.org/p/-/p-1.0.0.tgz", integrity: "sha512-BADBAD" } } } };
  const net = { async fetch(url) { return url.endsWith("/p") ? new TextEncoder().encode(JSON.stringify(meta)) : gz; } };
  const res = await mod.install({ p: "^1.0.0" }, net, new mod.MemFs(), { log() {}, progress() {} });
  assert.ok(!res.ok);
  assert.match(res.error, /完整性校验失败/);
  await cleanup();
});

test("install refuses native packages with guidance", async () => {
  const { mod, cleanup } = await loadNpm();
  const gz = makeTarball({ "index.js": "x", "binding.gyp": "{}" });
  const meta = { versions: { "1.0.0": { name: "native", version: "1.0.0", dist: { tarball: "https://registry.npmjs.org/native/-/native-1.0.0.tgz", integrity: integrityOf(gz) } } } };
  const net = { async fetch(url) { return url.endsWith("/native") ? new TextEncoder().encode(JSON.stringify(meta)) : gz; } };
  const res = await mod.install({ native: "^1.0.0" }, net, new mod.MemFs(), { log() {}, progress() {} });
  assert.ok(!res.ok);
  assert.match(res.error, /原生/);
  assert.match(res.error, /wasm/);
  await cleanup();
});
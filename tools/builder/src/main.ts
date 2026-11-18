// Build-runtime entry: wires the Kotlin bridge to the npm/esbuild pipeline.
// install runs the npm subset client; build (esbuild-wasm) is wired in N5.
import { install, type NetClient } from "./npm/install";
import { MemFs } from "./npm/memfs";
import { ensureEsbuild, buildProject } from "./build/esbuild";
import { ensureVueCompiler } from "./build/vue";
import { ensureTypeScript, runTypecheck } from "./build/typecheck";

declare global {
  interface Window {
    WviBuild?: { post(json: string): void };
    __wviBuildReceive(json: string): void;
  }
}

interface Msg {
  id?: number;
  type: string;
  payload?: Record<string, unknown>;
}

function post(type: string, payload: Record<string, unknown>, id?: number): void {
  window.WviBuild?.post(JSON.stringify({ id: id ?? 0, type, payload }));
}

const fs = new MemFs();

// Pending net requests resolved by Kotlin netResponse messages.
const netPending = new Map<number, (bytes: Uint8Array) => void>();
let netSeq = 0;

// Pending fsWrite requests resolved by Kotlin fsWriteResponse messages.
const fsPending = new Map<number, (ok: boolean) => void>();
let fsSeq = 0;

function writeDisk(path: string, text: string): Promise<boolean> {
  return new Promise((resolve) => {
    const id = ++fsSeq;
    fsPending.set(id, resolve);
    post("fsWrite", { path, text }, id);
  });
}

// Pending fsRead requests resolved by Kotlin fsReadResponse messages.
const fsReadPending = new Map<number, (text: string | null) => void>();
let fsReadSeq = 0;

function readDisk(path: string): Promise<string | null> {
  return new Promise((resolve) => {
    const id = ++fsReadSeq;
    fsReadPending.set(id, resolve);
    post("fsRead", { path }, id);
  });
}

function b64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function bytesToB64(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

// Build-stage IO: read source bytes / list source files / write dist bytes.
const readSourcePending = new Map<number, (b64: string | null) => void>();
let readSourceSeq = 0;
function readSource(path: string): Promise<Uint8Array | null> {
  return new Promise((resolve) => {
    const id = ++readSourceSeq;
    readSourcePending.set(id, (b64) => resolve(b64 === null ? null : b64ToBytes(b64)));
    post("readSource", { path }, id);
  });
}

const listSourcePending = new Map<number, (paths: string[]) => void>();
let listSourceSeq = 0;
function listSource(): Promise<string[]> {
  return new Promise((resolve) => {
    const id = ++listSourceSeq;
    listSourcePending.set(id, resolve);
    post("listSource", {}, id);
  });
}

const writeDistPending = new Map<number, (ok: boolean) => void>();
let writeDistSeq = 0;
function writeDist(path: string, bytes: Uint8Array): Promise<boolean> {
  return new Promise((resolve) => {
    const id = ++writeDistSeq;
    writeDistPending.set(id, resolve);
    post("writeDist", { path, b64: bytesToB64(bytes) }, id);
  });
}

let wasmUrl = "";
let tsBase = "";

async function runTypecheckCmd(id: number): Promise<void> {
  for (let i = 0; i < 600 && !tsBase; i++) await new Promise((r) => setTimeout(r, 100));
  if (!tsBase) {
    post("tcdone", { ok: false, summary: "TypeScript 未就绪" }, id);
    return;
  }
  log.progress(0.2, "加载类型检查器");
  const ts = await ensureTypeScript(tsBase);
  const libsText = await (await fetch(tsBase.replace(/\/?$/, "/") + "libs.d.ts")).text();
  log.progress(0.4, "读取源文件");
  const paths = await listSource();
  for (const p of paths) {
    if (p.startsWith("dist/")) continue;
    const bytes = await readSource(p);
    if (bytes) fs.write(p, bytes);
  }
  log.progress(0.6, "tsc 类型检查（.ts/.tsx + ts SFC）");
  const result = await runTypecheck(fs, libsText, ts);
  for (const n of result.notes) log.log("warn", n);
  for (const e of result.errors.slice(0, 100)) log.log("error", e);
  log.progress(1, "类型检查完成");
  post(
    "tcdone",
    {
      ok: result.ok,
      summary: result.checkedFiles === 0
        ? "没有可检查的 TS 文件（.ts/.tsx 或 lang=ts 的 .vue）"
        : result.ok
          ? `类型检查通过（${result.checkedFiles} 个文件）`
          : `发现 ${result.errors.length} 个类型错误（不影响构建）`,
    },
    id,
  );
}

const net: NetClient = {
  fetch(url: string, integrity?: string): Promise<Uint8Array> {
    return new Promise((resolve) => {
      const id = ++netSeq;
      netPending.set(id, resolve);
      post("net", { url, method: "GET", integrity: integrity ?? "" }, id);
    });
  },
};

const log = {
  log(level: string, text: string) {
    post("log", { level, text });
  },
  progress(fraction: number, label: string) {
    post("progress", { fraction, label });
  },
};

async function runInstall(id: number): Promise<void> {
  let pkgText = fs.readText("package.json");
  if (!pkgText) {
    // memfs starts empty; load the manifest from the project dir via the bridge.
    pkgText = await readDisk("package.json");
    if (pkgText) fs.writeText("package.json", pkgText);
  }
  if (!pkgText) {
    post("done", { ok: false, summary: "缺少 package.json" }, id);
    return;
  }
  const pkg = JSON.parse(pkgText) as { dependencies?: Record<string, string> };
  const result = await install(pkg.dependencies ?? {}, net, fs, log);
  if (result.ok) {
    // Persist node_modules + lock to the project dir, then evict from memory.
    const paths = fs.list("node_modules");
    let written = 0;
    for (const p of paths) {
      const text = fs.readText(p);
      if (text !== null && (await writeDisk(p, text))) written++;
    }
    const lock = fs.readText("package-lock.json");
    if (lock !== null) await writeDisk("package-lock.json", lock);
    fs.evictPrefix("node_modules");
    log.log("info", `已写盘 ${written} 个依赖文件`);
    post("done", { ok: true, summary: `已安装 ${Object.keys(result.installed).length} 个包` }, id);
  } else {
    post("error", { message: result.error ?? "安装失败" }, id);
    post("done", { ok: false, summary: result.error ?? "安装失败" }, id);
  }
}

async function waitForWasmUrl(): Promise<boolean> {
  for (let i = 0; i < 600 && !wasmUrl; i++) {
    await new Promise((r) => setTimeout(r, 100));
  }
  return !!wasmUrl;
}

async function runBuild(id: number): Promise<void> {
  if (!(await waitForWasmUrl())) {
    post("done", { ok: false, summary: "esbuild wasm 未就绪" }, id);
    return;
  }
  log.progress(0.1, "加载源文件");
  const paths = await listSource();
  for (const p of paths) {
    if (p.startsWith("dist/") || p.startsWith("node_modules/")) continue;
    const bytes = await readSource(p);
    if (bytes) fs.write(p, bytes);
  }
  // Load installed dependencies back from disk into memfs for bundling.
  const nmPaths = await listSource();
  for (const p of nmPaths) {
    if (!p.startsWith("node_modules/")) continue;
    const bytes = await readSource(p);
    if (bytes) fs.write(p, bytes);
  }
  const entry = ["src/main.tsx", "src/main.jsx", "src/main.ts", "src/main.js", "main.js", "index.js"]
    .find((c) => fs.exists(c));
  if (!entry) {
    post("done", { ok: false, summary: "找不到入口（src/main.* 或 index.js）" }, id);
    return;
  }
  // Vue SFC projects need the compiler asset; load it before bundling.
  if (fs.list("src").some((p) => p.endsWith(".vue"))) {
    log.progress(0.3, "加载 Vue 编译器");
    await ensureVueCompiler();
  }
  log.progress(0.4, "esbuild 打包（TS/JSX 仅转译，不做类型检查）");
  await ensureEsbuild(wasmUrl);
  const outputs = await buildProject(fs, entry);
  log.progress(0.8, "写出 dist");
  for (const o of outputs) {
    await writeDist("dist/" + o.path, o.contents);
  }
  // Copy index.html into dist so the preview has an entry.
  const html = fs.readText("index.html");
  if (html) await writeDist("dist/index.html", new TextEncoder().encode(html));
  log.progress(1, "构建完成");
  post("done", { ok: true, summary: `构建完成，${outputs.length} 个产物` }, id);
}

function handle(msg: Msg): void {
  const id = msg.id ?? 0;
  const p = msg.payload ?? {};
  switch (msg.type) {
    case "install":
      void runInstall(id);
      break;
    case "build":
      void runBuild(id).catch((e) => {
        post("error", { message: String(e) }, id);
        post("done", { ok: false, summary: String(e) }, id);
      });
      break;
    case "wasmUrl":
      wasmUrl = String(p.url ?? "");
      break;
    case "tsUrl":
      tsBase = String(p.url ?? "");
      break;
    case "typecheck":
      void runTypecheckCmd(id).catch((e) => {
        post("error", { message: String(e) }, id);
        post("tcdone", { ok: false, summary: String(e) }, id);
      });
      break;
    case "cancel":
      post("done", { ok: false, summary: "cancelled" }, id);
      break;
    case "netResponse": {
      const resolver = netPending.get(id);
      if (resolver) {
        netPending.delete(id);
        resolver(b64ToBytes(String(p.body ?? "")));
      }
      break;
    }
    case "fsWriteResponse": {
      const resolver = fsPending.get(id);
      if (resolver) {
        fsPending.delete(id);
        resolver(Boolean(p.ok));
      }
      break;
    }
    case "fsReadResponse": {
      const resolver = fsReadPending.get(id);
      if (resolver) {
        fsReadPending.delete(id);
        resolver(p.exists ? String(p.text ?? "") : null);
      }
      break;
    }
    case "readSourceResponse": {
      const resolver = readSourcePending.get(id);
      if (resolver) {
        readSourcePending.delete(id);
        resolver(p.exists ? String(p.b64 ?? "") : null);
      }
      break;
    }
    case "listSourceResponse": {
      const resolver = listSourcePending.get(id);
      if (resolver) {
        listSourcePending.delete(id);
        resolver(Array.isArray(p.paths) ? (p.paths as string[]) : []);
      }
      break;
    }
    case "writeDistResponse": {
      const resolver = writeDistPending.get(id);
      if (resolver) {
        writeDistPending.delete(id);
        resolver(Boolean(p.ok));
      }
      break;
    }
    default:
      break;
  }
}

window.__wviBuildReceive = (json: string) => {
  try {
    handle(JSON.parse(json) as Msg);
  } catch (e) {
    post("error", { message: String(e) });
  }
};

// The WviBuild interface may be injected slightly after the bundle runs; retry
// the ready signal until the bridge is present so Kotlin never misses it.
let readyTries = 0;
function emitReady(): void {
  if (window.WviBuild) {
    post("ready", {});
    return;
  }
  if (++readyTries < 100) setTimeout(emitReady, 50);
}
emitReady();
// Build-runtime entry: wires the Kotlin bridge to the npm/esbuild pipeline.
// install runs the npm subset client; build (esbuild-wasm) is wired in N5.
import { install, type NetClient } from "./npm/install";
import { MemFs } from "./npm/memfs";

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

function b64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
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
  const pkgText = fs.readText("package.json");
  if (!pkgText) {
    post("done", { ok: false, summary: "缺少 package.json" }, id);
    return;
  }
  const pkg = JSON.parse(pkgText) as { dependencies?: Record<string, string> };
  const result = await install(pkg.dependencies ?? {}, net, fs, log);
  if (result.ok) {
    post("done", { ok: true, summary: `已安装 ${Object.keys(result.installed).length} 个包` }, id);
  } else {
    post("error", { message: result.error ?? "安装失败" }, id);
    post("done", { ok: false, summary: result.error ?? "安装失败" }, id);
  }
}

function handle(msg: Msg): void {
  const id = msg.id ?? 0;
  const p = msg.payload ?? {};
  switch (msg.type) {
    case "install":
      void runInstall(id);
      break;
    case "build":
      // esbuild-wasm pipeline wired in N5.
      post("log", { level: "info", text: "build 尚未接线（N5）" }, id);
      post("done", { ok: false, summary: "build pending" }, id);
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
    case "fsReadResponse":
    case "fsWriteResponse":
      // handled by the persistence layer in N4.
      break;
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

post("ready", {});
// esbuild-wasm build: initialize with a locally-cached wasm URL, then bundle the
// project from an in-memory fs (sources + node_modules loaded via the bridge).
import * as esbuild from "esbuild-wasm";
import { MemFs } from "../npm/memfs";
import { compileSfc } from "./vue";

let initialized = false;

export async function ensureEsbuild(wasmURL: string): Promise<void> {
  if (initialized) return;
  await esbuild.initialize({ wasmURL, worker: false });
  initialized = true;
}

const LOADERS: Record<string, esbuild.Loader> = {
  ".js": "js",
  ".mjs": "js",
  ".cjs": "js",
  ".jsx": "jsx",
  ".ts": "ts",
  ".tsx": "tsx",
  ".css": "css",
  ".json": "json",
  ".txt": "text",
  ".svg": "text",
};

function loaderFor(path: string): esbuild.Loader {
  const dot = path.lastIndexOf(".");
  return LOADERS[dot >= 0 ? path.slice(dot) : ""] ?? "js";
}

/** Resolve a bare/relative import against the memfs (node_modules + project). */
function resolveInFs(fs: MemFs, importer: string, spec: string): string | null {
  const join = (base: string, rel: string) => {
    const parts = (base ? base.split("/") : []).concat(rel.split("/"));
    const out: string[] = [];
    for (const p of parts) {
      if (p === "" || p === ".") continue;
      if (p === "..") out.pop();
      else out.push(p);
    }
    return out.join("/");
  };
  const candidates: string[] = [];
  if (spec.startsWith(".") || spec.startsWith("/")) {
    const base = spec.startsWith("/") ? "" : importer.split("/").slice(0, -1).join("/");
    const target = spec.startsWith("/") ? spec.slice(1) : join(base, spec);
    candidates.push(target, target + ".js", target + ".jsx", target + ".ts", target + ".tsx", target + ".vue", target + ".json", target + "/index.js");
  } else {
    const pkgRoot = "node_modules/" + spec;
    const pkgJson = fs.readText(pkgRoot + "/package.json");
    if (pkgJson) {
      try {
        const pj = JSON.parse(pkgJson) as { module?: string; main?: string };
        const entry = pj.module || pj.main || "index.js";
        candidates.push(join(pkgRoot, entry));
      } catch {
        candidates.push(pkgRoot + "/index.js");
      }
    }
    candidates.push(pkgRoot + "/index.js", pkgRoot + ".js");
  }
  for (const c of candidates) {
    if (fs.exists(c)) return c;
  }
  return null;
}

function memfsPlugin(fs: MemFs): esbuild.Plugin {
  return {
    name: "wvi-memfs",
    setup(build) {
      build.onResolve({ filter: /.*/ }, (args) => {
        if (args.kind === "entry-point") return { path: args.path, namespace: "wvi" };
        const resolved = resolveInFs(fs, args.importer, args.path);
        if (resolved) return { path: resolved, namespace: "wvi" };
        return { path: args.path, namespace: "wvi" };
      });
      build.onLoad({ filter: /.*/, namespace: "wvi" }, async (args) => {
        const data = fs.read(args.path);
        if (!data) return { errors: [{ text: "找不到模块 " + args.path }] };
        if (args.path.endsWith(".vue")) {
          try {
            const sfc = await compileSfc(new TextDecoder().decode(data), args.path);
            return { contents: sfc.code, loader: sfc.loader };
          } catch (e) {
            return { errors: [{ text: String((e as Error)?.message ?? e) }] };
          }
        }
        return { contents: data, loader: loaderFor(args.path) };
      });
    },
  };
}

export interface BuildOutput {
  path: string;
  contents: Uint8Array;
}

export async function buildProject(fs: MemFs, entry: string): Promise<BuildOutput[]> {
  const result = await esbuild.build({
    entryPoints: [entry],
    bundle: true,
    minify: true,
    write: false,
    outdir: "dist",
    format: "iife",
    target: ["chrome90"],
    plugins: [memfsPlugin(fs)],
    // Vue esm-bundler build expects these flags; harmless for non-Vue projects.
    define: {
      "process.env.NODE_ENV": '"production"',
      __VUE_OPTIONS_API__: "true",
      __VUE_PROD_DEVTOOLS__: "false",
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: "false",
    },
    logLevel: "silent",
  });
  // esbuild-wasm reports "/dist/main.js" (leading slash) while node esbuild
  // reports "dist/main.js"; strip either so main.ts's "dist/" prefix is single.
  return (result.outputFiles ?? []).map((f) => ({
    path: f.path.replace(/^\/?dist\//, ""),
    contents: f.contents,
  }));
}
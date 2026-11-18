// Opt-in TypeScript type check. tsc + lib.d.ts are lazy-loaded from the https
// asset base Kotlin prepares; the program runs over the in-memory project fs.
// Never gates the esbuild build. .ts/.tsx are checked directly; lang="ts" SFCs
// are compiled to virtual <path>.vue.ts via the committed compiler-sfc asset
// (inlineTemplate covers template expressions too), with sourcemap mapping of
// diagnostics back to .vue positions. lang="js" / no-script SFCs are skipped;
// without installed vue deps SFC imports fall back to an any-shim.
import { MemFs, normalize } from "../npm/memfs";
import { ensureVueCompiler, sfcId, type SfcCompiler } from "./vue";

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    ts?: any;
  }
}

let tsLoading: Promise<any> | null = null;

export function ensureTypeScript(baseUrl: string): Promise<any> {
  if (window.ts) return Promise.resolve(window.ts);
  if (tsLoading) return tsLoading;
  tsLoading = new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = baseUrl.replace(/\/?$/, "/") + "typescript.js";
    s.onload = () => (window.ts ? resolve(window.ts) : reject(new Error("TypeScript 加载后不可用")));
    s.onerror = () => {
      tsLoading = null;
      reject(new Error("TypeScript 加载失败"));
    };
    document.head.appendChild(s);
  });
  return tsLoading;
}

const VUE_SHIM = 'declare module "*.vue" {\n  const component: any;\n  export default component;\n}\n';

export interface TypecheckResult {
  ok: boolean;
  errors: string[];
  checkedFiles: number;
  notes: string[];
}

const B64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

/** Minimal VLQ sourcemap decoder: generated line/col -> original line/col. */
export function decodeMappings(mappings: string): Array<Array<[number, number, number, number]>> {
  const lines: Array<Array<[number, number, number, number]>> = [];
  let srcIdx = 0, origLine = 0, origCol = 0;
  for (const lineStr of mappings.split(";")) {
    const segs: Array<[number, number, number, number]> = [];
    let genCol = 0;
    for (const seg of lineStr.split(",")) {
      if (!seg) continue;
      const vals: number[] = [];
      let shift = 0, value = 0;
      for (const ch of seg) {
        const digit = B64.indexOf(ch);
        if (digit < 0) break;
        value += (digit & 31) * Math.pow(2, shift);
        if (digit & 32) {
          shift += 5;
        } else {
          const negate = value & 1;
          value = Math.floor(value / 2);
          vals.push(negate ? -value : value);
          shift = 0;
          value = 0;
        }
      }
      if (vals.length === 0) continue;
      genCol += vals[0];
      if (vals.length >= 4) {
        srcIdx += vals[1];
        origLine += vals[2];
        origCol += vals[3];
        segs.push([genCol, srcIdx, origLine, origCol]);
      }
    }
    lines.push(segs);
  }
  return lines;
}

function mapPosition(
  map: { mappings: string },
  line: number,
  col: number,
): { line: number; col: number } | null {
  const lines = decodeMappings(map.mappings);
  const segs = lines[line];
  if (!segs || segs.length === 0) return null;
  let best: [number, number, number, number] | null = null;
  for (const s of segs) {
    if (s[0] <= col && (best === null || s[0] >= best[0])) best = s;
  }
  if (!best) return null;
  return { line: best[2], col: best[3] };
}

/** Runs tsc over memfs; [ts]/[compiler] injectable so Node tests use real ones. */
export async function runTypecheck(
  fs: MemFs,
  libsText: string,
  ts?: any,
  compiler?: SfcCompiler,
): Promise<TypecheckResult> {
  const t = ts ?? window.ts;
  if (!t) throw new Error("TypeScript 未加载");

  const virtual = new Map<string, string>();
  for (const p of fs.list()) {
    if (p.startsWith("dist/")) continue;
    const text = fs.readText(p);
    if (text !== null) virtual.set("/" + p, text);
  }
  virtual.set("/__wvi_libs.d.ts", libsText);

  const notes: string[] = [];
  // SFC internal checking: compile lang=ts SFCs to virtual <path>.vue.ts.
  // TS resolution tries <import>.ts, so './App.vue' picks up '/src/App.vue.ts'.
  const sfcMaps = new Map<string, { mappings: string }>();
  const sfcFiles = fs.list("src").filter((p) => p.endsWith(".vue"));
  let sfcChecked = 0;
  let sfcSkipped = 0;
  const vueInstalled = virtual.has("/node_modules/vue/package.json");
  if (sfcFiles.length > 0 && !vueInstalled) {
    notes.push("未安装 vue 依赖，.vue 内部未检查（先「安装依赖」）");
  }
  if (sfcFiles.length > 0 && vueInstalled) {
    const c = compiler ?? (await ensureVueCompiler());
    for (const p of sfcFiles) {
      const source = fs.readText(p);
      if (source === null) continue;
      const { descriptor, errors } = c.parse(source, { filename: p });
      if (errors.length) {
        notes.push(`${p}: 解析失败，跳过内部检查`);
        continue;
      }
      const block = descriptor.scriptSetup ?? descriptor.script;
      if (!block || (block.lang !== "ts" && block.lang !== "tsx")) {
        sfcSkipped++;
        continue;
      }
      const scopeId = sfcId(p).replace(/^data-v-/, "");
      const script = c.compileScript(descriptor, {
        id: scopeId,
        inlineTemplate: true,
        genDefaultAs: "_sfc_main",
        templateOptions: { compilerOptions: { expressionPlugins: ["typescript"] } },
      });
      // compileScript with genDefaultAs omits the default export; add it so
      // importers see the component type. The untyped __props param is a
      // compiler artifact (vue-tsc types it too); annotate to avoid a bogus
      // implicit-any error. __scopeId is build-only, not needed for checking.
      const code =
        script.content.replace(/setup\(__props\)/g, "setup(__props: any)") +
        "\nexport default _sfc_main;\n";
      virtual.set("/" + p + ".ts", code);
      const map = (script as unknown as { map?: { mappings: string } }).map;
      if (map && map.mappings) sfcMaps.set("/" + p + ".ts", map);
      sfcChecked++;
    }
    if (sfcSkipped > 0) notes.push(`${sfcSkipped} 个 js/无脚本 SFC 未检查（仅支持 lang="ts"）`);
  }
  // Shim only helps SFCs without a virtual module; harmless otherwise.
  virtual.set("/__wvi_vue_shim.d.ts", VUE_SHIM);

  const roots = [...virtual.keys()].filter(
    (p) =>
      (p.endsWith(".ts") || p.endsWith(".tsx")) &&
      !p.endsWith(".d.ts") &&
      !p.includes("/node_modules/") &&
      p !== "/__wvi_libs.d.ts",
  );
  if (roots.length === 0) return { ok: true, errors: [], checkedFiles: 0, notes };

  const options: any = {
    target: t.ScriptTarget.ES2020,
    module: t.ModuleKind.ESNext,
    moduleResolution: t.ModuleResolutionKind.Bundler ?? t.ModuleResolutionKind.Node10,
    jsx: t.JsxEmit.ReactJSX,
    strict: true,
    noEmit: true,
    skipLibCheck: true,
    allowJs: false,
    types: [],
  };

  const host: any = {
    getSourceFile: (fileName: string, languageVersion: any) => {
      const key = fileName.startsWith("/") ? fileName : "/" + normalize(fileName);
      const text = virtual.get(key ?? fileName);
      if (text === undefined) return undefined;
      return t.createSourceFile(fileName, text, languageVersion, true);
    },
    writeFile: () => {},
    getDefaultLibFileName: () => "/__wvi_libs.d.ts",
    useCaseSensitiveFileNames: () => true,
    getCanonicalFileName: (f: string) => f,
    getCurrentDirectory: () => "/",
    getNewLine: () => "\n",
    fileExists: (f: string) => virtual.has(f.startsWith("/") ? f : "/" + normalize(f)),
    readFile: (f: string) => virtual.get(f.startsWith("/") ? f : "/" + normalize(f)),
    directoryExists: (d: string) => {
      const prefix = d.endsWith("/") ? d : d + "/";
      for (const k of virtual.keys()) if (k.startsWith(prefix)) return true;
      return false;
    },
    getDirectories: () => [],
  };

  const program = t.createProgram([...roots, "/__wvi_vue_shim.d.ts", "/__wvi_libs.d.ts"], options, host);
  const diags = [...program.getSemanticDiagnostics(), ...program.getSyntacticDiagnostics()];
  const errors: string[] = [];
  for (const d of diags) {
    const msg = t.flattenDiagnosticMessageText(d.messageText, "\n");
    if (d.file && typeof d.start === "number") {
      const { line, character } = d.file.getLineAndCharacterOfPosition(d.start);
      let name = d.file.fileName.replace(/^\//, "");
      let outLine = line + 1;
      let outCol = character + 1;
      const map = sfcMaps.get(d.file.fileName);
      if (map) {
        // Report against the .vue file; map through the compileScript sourcemap.
        name = name.replace(/\.ts$/, "");
        const mapped = mapPosition(map, line, character);
        if (mapped) {
          outLine = mapped.line + 1;
          outCol = mapped.col + 1;
        }
      }
      errors.push(`${name}:${outLine}:${outCol} ${msg}`);
    } else {
      errors.push(msg);
    }
  }
  return { ok: errors.length === 0, errors, checkedFiles: roots.length, notes };
}
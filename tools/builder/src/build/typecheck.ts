// Opt-in TypeScript type check. tsc + lib.d.ts are lazy-loaded from the https
// asset base Kotlin prepares; the program runs over the in-memory project fs.
// Never gates the esbuild build. v1 checks .ts/.tsx only; .vue imports resolve
// to an any-component shim (SFC-internal checking would need vue-tsc).
import { MemFs, normalize } from "../npm/memfs";

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
}

/** Runs tsc over memfs; [ts] injectable so Node tests use the real compiler. */
export async function runTypecheck(
  fs: MemFs,
  libsText: string,
  ts?: any,
): Promise<TypecheckResult> {
  const t = ts ?? window.ts;
  if (!t) throw new Error("TypeScript 未加载");

  const virtual = new Map<string, string>();
  for (const p of fs.list()) {
    if (p.startsWith("dist/")) continue;
    const text = fs.readText(p);
    if (text !== null) virtual.set("/" + p, text);
  }
  virtual.set("/__wvi_vue_shim.d.ts", VUE_SHIM);
  virtual.set("/__wvi_libs.d.ts", libsText);

  const roots = [...virtual.keys()].filter(
    (p) => (p.endsWith(".ts") || p.endsWith(".tsx")) && !p.endsWith(".d.ts") && !p.includes("/node_modules/"),
  );
  if (roots.length === 0) return { ok: true, errors: [], checkedFiles: 0 };

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
      const name = d.file.fileName.replace(/^\//, "");
      errors.push(`${name}:${line + 1}:${character + 1} ${msg}`);
    } else {
      errors.push(msg);
    }
  }
  return { ok: errors.length === 0, errors, checkedFiles: roots.length };
}
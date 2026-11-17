// Detect packages that require native compilation / install scripts, which the
// WebView build runtime cannot run. We default to --ignore-scripts and refuse
// such packages with guidance toward wasm variants.

export interface PkgJson {
  name?: string;
  version?: string;
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  gypfile?: boolean;
  binary?: unknown;
}

const NATIVE_SCRIPTS = ["install", "postinstall", "preinstall", "prepare"];

/** Returns a human-readable reason if the package needs native build, else null. */
export function nativeReason(pkg: PkgJson, entryNames: string[]): string | null {
  const name = pkg.name ?? "package";
  if (pkg.gypfile === true) return `${name} 使用 node-gyp 原生编译`;
  if (entryNames.some((n) => n === "binding.gyp" || n.endsWith("/binding.gyp"))) {
    return `${name} 含 binding.gyp 原生模块`;
  }
  if (pkg.binary) return `${name} 需下载原生二进制（node-pre-gyp）`;
  const scripts = pkg.scripts ?? {};
  for (const key of NATIVE_SCRIPTS) {
    const cmd = scripts[key];
    if (cmd && /node-gyp|prebuild|node-pre-gyp|cmake|make\b|\.node\b/.test(cmd)) {
      return `${name} 的 ${key} 脚本需原生构建`;
    }
  }
  return null;
}

export const NATIVE_HINT =
  "该包需要原生构建，WebView 运行时不支持。请改用 wasm 变体（如 esbuild-wasm、@rollup/wasm-node），或移除该依赖。";
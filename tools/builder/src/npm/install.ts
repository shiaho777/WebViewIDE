// npm subset installer: resolve dependency tree via registry metadata, fetch
// tarballs, verify integrity, extract into node_modules, refuse native packages.
// Net/fs are injected so this is unit-testable against a mock registry.
import { maxSatisfying } from "./semver";
import { extractTarball, verifyIntegrity, isSafeEntry } from "./tar";
import { nativeReason, NATIVE_HINT, type PkgJson } from "./native";
import { MemFs } from "./memfs";

export interface NetClient {
  /** GET a URL, return raw bytes (tarball gz or metadata json). */
  fetch(url: string, integrity?: string): Promise<Uint8Array>;
}

export interface InstallLog {
  log(level: string, text: string): void;
  progress(fraction: number, label: string): void;
}

export interface InstallResult {
  ok: boolean;
  installed: Record<string, string>;
  lock: Record<string, { version: string; integrity: string }>;
  error?: string;
}

const REGISTRY = "https://registry.npmjs.org";

interface Meta {
  versions: Record<string, PkgJson & { dist?: { tarball?: string; integrity?: string } }>;
}

export async function install(
  rootDeps: Record<string, string>,
  net: NetClient,
  fs: MemFs,
  log: InstallLog,
): Promise<InstallResult> {
  const installed: Record<string, string> = {};
  const lock: Record<string, { version: string; integrity: string }> = {};
  const queue: Array<{ name: string; range: string }> = Object.entries(rootDeps).map(([name, range]) => ({ name, range }));
  let done = 0;
  const seen = new Set<string>();

  while (queue.length) {
    const { name, range } = queue.shift()!;
    if (seen.has(name)) continue;
    seen.add(name);
    log.progress(Math.min(0.95, done / Math.max(1, done + queue.length + 1)), `安装 ${name}`);
    try {
      const metaBytes = await net.fetch(`${REGISTRY}/${encodeURIComponent(name)}`);
      const meta = JSON.parse(new TextDecoder().decode(metaBytes)) as Meta;
      const versions = Object.keys(meta.versions ?? {});
      const picked = maxSatisfying(versions, range);
      if (!picked) {
        return { ok: false, installed, lock, error: `${name}@${range} 没有匹配的版本` };
      }
      const ver = meta.versions[picked];
      const integrity = ver.dist?.integrity ?? "";
      const tarballUrl = ver.dist?.tarball ?? `${REGISTRY}/${name}/-/${name}-${picked}.tgz`;
      const gz = await net.fetch(tarballUrl, integrity);
      if (integrity && !(await verifyIntegrity(gz, integrity))) {
        return { ok: false, installed, lock, error: `${name}@${picked} 完整性校验失败` };
      }
      const entries = extractTarball(gz);
      const reason = nativeReason(ver, entries.map((e) => e.name));
      if (reason) {
        return { ok: false, installed, lock, error: `${reason}。${NATIVE_HINT}` };
      }
      for (const e of entries) {
        if (!isSafeEntry(e.name)) continue;
        fs.write(`node_modules/${name}/${e.name}`, e.data);
      }
      installed[name] = picked;
      lock[name] = { version: picked, integrity };
      done++;
      for (const [dep, depRange] of Object.entries(ver.dependencies ?? {})) {
        if (!seen.has(dep)) queue.push({ name: dep, range: depRange });
      }
    } catch (err) {
      return { ok: false, installed, lock, error: `安装 ${name} 失败：${String(err)}` };
    }
  }

  fs.writeText("package-lock.json", JSON.stringify({ lockfileVersion: 3, packages: lock }, null, 2));
  log.progress(1, "安装完成");
  return { ok: true, installed, lock };
}
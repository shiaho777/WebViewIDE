// In-memory filesystem for the build runtime. Paths are normalized and confined
// to a virtual root; persistence to the real project dir happens via the bridge.

export function normalize(path: string): string | null {
  if (path.includes("\0")) return null;
  const parts = path.replace(/\\/g, "/").split("/");
  const stack: string[] = [];
  for (const p of parts) {
    if (p === "" || p === ".") continue;
    if (p === "..") {
      if (stack.length === 0) return null;
      stack.pop();
    } else stack.push(p);
  }
  return stack.join("/");
}

export class MemFs {
  private files = new Map<string, Uint8Array>();

  write(path: string, data: Uint8Array): boolean {
    const n = normalize(path);
    if (n === null) return false;
    this.files.set(n, data);
    return true;
  }

  writeText(path: string, text: string): boolean {
    return this.write(path, new TextEncoder().encode(text));
  }

  read(path: string): Uint8Array | null {
    const n = normalize(path);
    if (n === null) return null;
    return this.files.get(n) ?? null;
  }

  readText(path: string): string | null {
    const b = this.read(path);
    return b ? new TextDecoder().decode(b) : null;
  }

  exists(path: string): boolean {
    const n = normalize(path);
    return n !== null && this.files.has(n);
  }

  delete(path: string): void {
    const n = normalize(path);
    if (n !== null) this.files.delete(n);
  }

  /** Evict a subtree from memory after it has been persisted to disk. */
  evictPrefix(prefix: string): number {
    const n = normalize(prefix);
    if (n === null) return 0;
    let removed = 0;
    for (const key of [...this.files.keys()]) {
      if (key === n || key.startsWith(n + "/")) {
        this.files.delete(key);
        removed++;
      }
    }
    return removed;
  }

  list(prefix = ""): string[] {
    const n = normalize(prefix) ?? "";
    return [...this.files.keys()].filter((k) => n === "" || k === n || k.startsWith(n + "/")).sort();
  }

  get size(): number {
    return this.files.size;
  }
}
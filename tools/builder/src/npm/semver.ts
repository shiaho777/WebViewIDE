// Minimal semver subset for the npm client: exact, ^, ~, >=, >, <=, <, =,
// x-wildcards, space-AND, ||-OR, and prerelease tags. Not a full node-semver
// replacement — enough to resolve typical package.json dependency ranges.

export interface SemVer {
  major: number;
  minor: number;
  patch: number;
  pre: string[];
}

export function parse(v: string): SemVer | null {
  const m = /^v?(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?(?:\+[0-9A-Za-z.-]+)?$/.exec(v.trim());
  if (!m) return null;
  return {
    major: +m[1],
    minor: +m[2],
    patch: +m[3],
    pre: m[4] ? m[4].split(".") : [],
  };
}

export function cmp(a: SemVer, b: SemVer): number {
  if (a.major !== b.major) return a.major - b.major;
  if (a.minor !== b.minor) return a.minor - b.minor;
  if (a.patch !== b.patch) return a.patch - b.patch;
  // A version without prerelease outranks one with prerelease.
  if (a.pre.length === 0 && b.pre.length === 0) return 0;
  if (a.pre.length === 0) return 1;
  if (b.pre.length === 0) return -1;
  const n = Math.max(a.pre.length, b.pre.length);
  for (let i = 0; i < n; i++) {
    const x = a.pre[i];
    const y = b.pre[i];
    if (x === undefined) return -1;
    if (y === undefined) return 1;
    const xn = /^\d+$/.test(x);
    const yn = /^\d+$/.test(y);
    if (xn && yn) {
      const d = +x - +y;
      if (d !== 0) return d;
    } else if (xn) return -1;
    else if (yn) return 1;
    else if (x !== y) return x < y ? -1 : 1;
  }
  return 0;
}

type Test = (v: SemVer) => boolean;

function hasX(s: string): boolean {
  return /(^|\.)[xX*](\.|$)/.test(s) || s === "*" || s === "";
}

function parseComparator(c: string): Test {
  const m = /^(>=|<=|>|<|=|\^|~)?\s*(.+)$/.exec(c.trim());
  if (!m) return () => false;
  const op = m[1] || "=";
  const raw = m[2].trim();
  if (raw === "*" || raw === "") return () => true;

  // x-range: 1, 1.2, 1.x, 1.2.x
  const parts = raw.split(".");
  if (parts.some((p) => p === "x" || p === "X" || p === "*") || parts.length < 3) {
    const maj = parts[0] === undefined || /[xX*]/.test(parts[0]) ? null : +parts[0];
    const min = parts[1] === undefined || /[xX*]/.test(parts[1]) ? null : +parts[1];
    return (v) => {
      if (maj !== null && v.major !== maj) return false;
      if (min !== null && v.minor !== min) return false;
      return true;
    };
  }

  const base = parse(raw);
  if (!base) return () => false;
  switch (op) {
    case "^":
      return (v) => {
        if (cmp(v, base) < 0) return false;
        if (base.major > 0) return v.major === base.major;
        if (base.minor > 0) return v.major === 0 && v.minor === base.minor;
        return v.major === 0 && v.minor === 0 && v.patch === base.patch;
      };
    case "~":
      return (v) => cmp(v, base) >= 0 && v.major === base.major && v.minor === base.minor;
    case ">":
      return (v) => cmp(v, base) > 0;
    case ">=":
      return (v) => cmp(v, base) >= 0;
    case "<":
      return (v) => cmp(v, base) < 0;
    case "<=":
      return (v) => cmp(v, base) <= 0;
    default:
      return (v) => cmp(v, base) === 0;
  }
}

function parseAnd(range: string): Test {
  const comps = range.trim().split(/\s+/).filter(Boolean).map(parseComparator);
  return (v) => comps.every((t) => t(v));
}

export function satisfies(version: string, range: string): boolean {
  const v = parse(version);
  if (!v) return false;
  const r = range.trim();
  if (r === "*" || r === "" || r === "latest") return true;
  return r.split("||").some((part) => parseAnd(part)(v));
}

/** Highest version satisfying the range; prereleases excluded unless the range names one. */
export function maxSatisfying(versions: string[], range: string): string | null {
  const allowPre = /-([0-9A-Za-z.-]+)/.test(range);
  let best: SemVer | null = null;
  let bestStr: string | null = null;
  for (const s of versions) {
    const v = parse(s);
    if (!v) continue;
    if (v.pre.length > 0 && !allowPre) continue;
    if (!satisfies(s, range)) continue;
    if (best === null || cmp(v, best) > 0) {
      best = v;
      bestStr = s;
    }
  }
  return bestStr;
}
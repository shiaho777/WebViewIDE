// Tarball extraction (gunzip + untar) and npm integrity verification.
import { gunzipSync, strToU8 } from "fflate";

export interface TarEntry {
  name: string;
  data: Uint8Array;
}

/** npm integrity is "sha512-<base64>"; return the hex digest or null. */
export function integrityToHex(integrity: string): string | null {
  const m = /^sha512-(.+)$/.exec(integrity.trim());
  if (!m) return null;
  return m[1];
}

export async function sha512Base64(bytes: Uint8Array): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-512", bytes as BufferSource);
  const arr = new Uint8Array(digest);
  let bin = "";
  for (const b of arr) bin += String.fromCharCode(b);
  return btoa(bin);
}

export async function verifyIntegrity(bytes: Uint8Array, integrity: string): Promise<boolean> {
  const expect = integrityToHex(integrity);
  if (!expect) return false;
  const actual = await sha512Base64(bytes);
  return actual === expect;
}

function readStr(buf: Uint8Array, off: number, len: number): string {
  let end = off;
  const limit = Math.min(off + len, buf.length);
  while (end < limit && buf[end] !== 0) end++;
  let s = "";
  for (let i = off; i < end; i++) s += String.fromCharCode(buf[i]);
  return s;
}

function readOctal(buf: Uint8Array, off: number, len: number): number {
  const s = readStr(buf, off, len).trim();
  if (!s) return 0;
  return parseInt(s, 8) || 0;
}

/** Untar a (already gunzipped) buffer; strips the leading "package/" dir. */
export function untar(buf: Uint8Array): TarEntry[] {
  const out: TarEntry[] = [];
  let off = 0;
  let longName: string | null = null;
  while (off + 512 <= buf.length) {
    const header = buf.subarray(off, off + 512);
    // Two zero blocks mark end of archive.
    if (header.every((b) => b === 0)) break;
    let name = readStr(header, 0, 100);
    const prefix = readStr(header, 345, 155);
    if (prefix) name = prefix + "/" + name;
    if (longName) {
      name = longName;
      longName = null;
    }
    const size = readOctal(header, 124, 12);
    const type = String.fromCharCode(header[156]);
    const dataStart = off + 512;
    const padded = Math.ceil(size / 512) * 512;
    if (type === "L") {
      // GNU long name: payload is the real name of the next entry.
      longName = readStr(buf, dataStart, size).replace(/\0+$/, "");
    } else if (type === "0" || type === "\0" || type === "") {
      const clean = name.replace(/^package\//, "");
      if (clean && !clean.endsWith("/")) {
        out.push({ name: clean, data: buf.slice(dataStart, dataStart + size) });
      }
    }
    off = dataStart + padded;
  }
  return out;
}

export function extractTarball(gz: Uint8Array): TarEntry[] {
  return untar(gunzipSync(gz));
}

/** Reject paths that escape the package root. */
export function isSafeEntry(name: string): boolean {
  if (name.startsWith("/") || name.includes("\0")) return false;
  const parts = name.split("/");
  let depth = 0;
  for (const p of parts) {
    if (p === "..") {
      depth--;
      if (depth < 0) return false;
    } else if (p !== "." && p !== "") depth++;
  }
  return true;
}

export { strToU8 };
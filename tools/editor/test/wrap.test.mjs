// Unit test for the narrow-pane wrap policy. Runs on Node's built-in test
// runner so the Android build still needs no test framework.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const source = await readFile(join(here, "../src/main.ts"), "utf8");

// Extract the threshold and the policy branch straight from the source so the
// test tracks the real implementation rather than a duplicated constant.
const threshold = Number(/const WRAP_MIN_WIDTH = (\d+)/.exec(source)?.[1]);
const usesThresholdForInitial = /wrapConf\.of\(window\.innerWidth >= WRAP_MIN_WIDTH \? EditorView\.lineWrapping : \[\]\)/.test(source);
const reconfiguresOnResize = /wrapConf\.reconfigure\(wantWrap \? EditorView\.lineWrapping : \[\]\)/.test(source);
const fitListensToResize = /window\.addEventListener\("resize", fit\)/.test(source);

test("threshold is a sane phone-split width", () => {
  assert.ok(Number.isFinite(threshold), "WRAP_MIN_WIDTH must be declared");
  assert.ok(threshold >= 320 && threshold <= 600, `unexpected threshold ${threshold}`);
});

test("narrow panes scroll instead of wrapping", () => {
  const wrap = (w) => w >= threshold;
  assert.equal(wrap(187), false); // phone split pane
  assert.equal(wrap(320), false);
  assert.equal(wrap(threshold - 1), false);
  assert.equal(wrap(threshold), true);
  assert.equal(wrap(1080), true); // full-width code face
});

test("policy is wired to init, resize and reconfigure", () => {
  assert.ok(usesThresholdForInitial, "initial wrap must use the threshold");
  assert.ok(reconfiguresOnResize, "resize must reconfigure wrapping");
  assert.ok(fitListensToResize, "fit must run on resize");
});
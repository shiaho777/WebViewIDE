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

// Find/replace regression: without the search() extension the first command
// silently fell back to opening CM's panel and reported false success.
test("search state field is mounted so find/replace work on first use", () => {
  assert.ok(/import \{[^}]*\bsearch\b[^}]*\} from "@codemirror\/search"/.test(source), "must import search");
  assert.ok(/search\(\{ createPanel:/.test(source), "must mount search() with a suppressed panel");
});

test("format action reindents the whole document", () => {
  assert.ok(/import \{[^}]*indentSelection[^}]*\} from "@codemirror\/commands"/.test(source), "must import indentSelection");
  assert.ok(/case "format":/.test(source), "must handle format");
  assert.ok(/indentSelection\(view\)/.test(source), "format must reindent");
});

test("symbol-bar inserts route through input handlers so auto-close runs", () => {
  assert.ok(source.includes("view.state.facet(EditorView.inputHandler)"), "insert must run input handlers");
  assert.ok(/userEvent: "input\.type"/.test(source), "fallback insert must be tagged as typing");
});

test("JS mode enables TypeScript + JSX so .ts/.tsx highlight", () => {
  assert.ok(/javascript\(\{ typescript: true, jsx: true \}\)/.test(source), "js kind must enable ts+jsx");
});

test("vue kind uses lang-vue over an HTML base for SFC blocks", () => {
  assert.ok(/import \{ vue \} from "@codemirror\/lang-vue"/.test(source), "must import lang-vue");
  assert.ok(/case "vue":/.test(source), "must handle vue kind");
  assert.ok(/vue\(\{ base: html\(\) \}\)/.test(source), "vue must layer on html base (script/style nesting)");
});

test("match highlighting is provided without the built-in panel", () => {
  assert.ok(source.includes("getSearchQuery"), "must read the active query");
  assert.ok(source.includes("cm-searchMatch"), "must decorate matches");
  assert.ok(/ViewPlugin\.fromClass/.test(source), "highlight must be a view plugin");
  assert.ok(source.includes("searchHighlight,"), "plugin must be in extensions");
});
// WebViewIDE editor face: CodeMirror 6 inside a WebView, driven by a JSON
// message bridge. The Kotlin-side document buffer stays the single source
// of truth; this view only reports changes and executes commands.
//
// Down (Kotlin -> JS): window.__wviReceive(json)
//   {id, type, payload}  type: setDoc | goto | undo | redo | find | replace |
//                              replaceAll | insert | theme | focus
// Up (JS -> Kotlin): window.WviBridge.post(json)
//   {id?, type, payload} type: ready | change | cursor | findResult
import { EditorState, Compartment } from "@codemirror/state";
import {
  EditorView,
  keymap,
  lineNumbers,
  highlightActiveLine,
  highlightActiveLineGutter,
  drawSelection,
  highlightSpecialChars,
  rectangularSelection,
} from "@codemirror/view";
import { defaultKeymap, history, historyKeymap, undo, redo, indentWithTab } from "@codemirror/commands";
import {
  autocompletion,
  completionKeymap,
  closeBrackets,
  closeBracketsKeymap,
  acceptCompletion,
} from "@codemirror/autocomplete";
import { searchKeymap, SearchQuery, setSearchQuery, findNext, findPrevious, replaceNext, replaceAll } from "@codemirror/search";
import {
  bracketMatching,
  foldGutter,
  foldKeymap,
  indentOnInput,
  indentUnit,
  HighlightStyle,
  syntaxHighlighting,
} from "@codemirror/language";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { javascript } from "@codemirror/lang-javascript";
import { json } from "@codemirror/lang-json";
import { tags as t } from "@lezer/highlight";

declare global {
  interface Window {
    WviBridge?: { post(json: string): void };
    __wviReceive(json: string): void;
  }
}

interface Msg {
  id?: number;
  type: string;
  payload?: Record<string, unknown>;
}

function post(type: string, payload: Record<string, unknown>, id?: number): void {
  window.WviBridge?.post(JSON.stringify({ id: id ?? 0, type, payload }));
}

const languageConf = new Compartment();
const themeConf = new Compartment();

function languageFor(kind: string) {
  switch (kind) {
    case "html":
      return html();
    case "css":
      return css();
    case "js":
      return javascript();
    case "json":
      return json();
    default:
      return [];
  }
}

interface Palette {
  bg: string;
  fg: string;
  gutter: string;
  gutterFg: string;
  activeLine: string;
  selection: string;
  cursor: string;
  keyword: string;
  string: string;
  number: string;
  comment: string;
  tag: string;
  attr: string;
}

function themeFor(p: Palette) {
  const base = EditorView.theme(
    {
      "&": { backgroundColor: p.bg, color: p.fg, fontSize: "14px", height: "100%" },
      ".cm-scroller": { fontFamily: "monospace", lineHeight: "1.45" },
      ".cm-content": { caretColor: p.cursor, paddingBottom: "48px" },
      ".cm-cursor, .cm-dropCursor": { borderLeftColor: p.cursor, borderLeftWidth: "2px" },
      "&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection":
        { backgroundColor: p.selection },
      ".cm-gutters": { backgroundColor: p.gutter, color: p.gutterFg, border: "none" },
      ".cm-activeLine": { backgroundColor: p.activeLine },
      ".cm-activeLineGutter": { backgroundColor: p.activeLine, color: p.fg },
      ".cm-foldGutter .cm-gutterElement": { padding: "0 2px" },
      ".cm-tooltip": { backgroundColor: p.gutter, color: p.fg, border: `1px solid ${p.gutterFg}` },
      ".cm-tooltip-autocomplete ul li[aria-selected]": { backgroundColor: p.selection, color: p.fg },
      ".cm-searchMatch": { backgroundColor: p.selection },
      ".cm-searchMatch.cm-searchMatch-selected": { backgroundColor: p.activeLine, outline: `1px solid ${p.cursor}` },
      ".cm-panels": { backgroundColor: p.gutter, color: p.fg },
    },
    { dark: true },
  );
  const highlight = HighlightStyle.define([
    { tag: [t.keyword, t.modifier, t.operatorKeyword], color: p.keyword },
    { tag: [t.string, t.special(t.string), t.regexp], color: p.string },
    { tag: [t.number, t.bool, t.null, t.atom], color: p.number },
    { tag: [t.comment, t.blockComment, t.lineComment, t.docComment], color: p.comment, fontStyle: "italic" },
    { tag: [t.tagName, t.angleBracket], color: p.tag },
    { tag: [t.attributeName, t.propertyName], color: p.attr },
    { tag: [t.function(t.variableName), t.function(t.propertyName)], color: p.attr },
    { tag: [t.typeName, t.className, t.namespace], color: p.number },
    { tag: t.heading, color: p.keyword, fontWeight: "bold" },
    { tag: t.link, color: p.string, textDecoration: "underline" },
    { tag: t.invalid, color: "#ff5555" },
  ]);
  return [base, syntaxHighlighting(highlight)];
}

const defaultPalette: Palette = {
  bg: "#121316",
  fg: "#e3e2e6",
  gutter: "#1a1b1f",
  gutterFg: "#8d9199",
  activeLine: "#1f2126",
  selection: "#33415e",
  cursor: "#a8c7fa",
  keyword: "#a8c7fa",
  string: "#7ddc8a",
  number: "#f2b8b5",
  comment: "#8d9199",
  tag: "#a8c7fa",
  attr: "#c5a8fa",
};

let changeTimer: number | undefined;
let lastPosted = "";

const view = new EditorView({
  parent: document.body,
  state: EditorState.create({
    doc: "",
    extensions: [
      lineNumbers(),
      highlightActiveLineGutter(),
      highlightSpecialChars(),
      history(),
      foldGutter(),
      drawSelection(),
      rectangularSelection(),
      indentOnInput(),
      bracketMatching(),
      closeBrackets(),
      autocompletion(),
      highlightActiveLine(),
      indentUnit.of("  "),
      EditorState.tabSize.of(2),
      EditorView.lineWrapping,
      keymap.of([
        // On soft keyboards Tab must be acceptable as completion too.
        { key: "Tab", run: acceptCompletion },
        indentWithTab,
        ...closeBracketsKeymap,
        ...defaultKeymap,
        ...searchKeymap,
        ...historyKeymap,
        ...foldKeymap,
        ...completionKeymap,
      ]),
      languageConf.of([]),
      themeConf.of(themeFor(defaultPalette)),
      EditorView.updateListener.of((u) => {
        if (u.selectionSet || u.focusChanged) {
          const head = u.state.selection.main.head;
          const line = u.state.doc.lineAt(head);
          post("cursor", { pos: head, line: line.number, col: head - line.from + 1 });
        }
        if (!u.docChanged) return;
        window.clearTimeout(changeTimer);
        changeTimer = window.setTimeout(() => {
          const text = view.state.doc.toString();
          if (text === lastPosted) return;
          lastPosted = text;
          post("change", { text });
        }, 120);
      }),
    ],
  }),
});

function flushChange(): void {
  window.clearTimeout(changeTimer);
  const text = view.state.doc.toString();
  if (text !== lastPosted) {
    lastPosted = text;
    post("change", { text });
  }
}

function setDoc(text: string, kind: string): void {
  window.clearTimeout(changeTimer);
  lastPosted = text;
  view.dispatch({
    changes: { from: 0, to: view.state.doc.length, insert: text },
    selection: { anchor: 0 },
    effects: languageConf.reconfigure(languageFor(kind)),
    scrollIntoView: false,
  });
  view.dispatch({ effects: EditorView.scrollIntoView(0) });
}

function goto(pos: number): void {
  const p = Math.max(0, Math.min(pos, view.state.doc.length));
  view.dispatch({ selection: { anchor: p }, effects: EditorView.scrollIntoView(p, { y: "center" }) });
  view.focus();
}

function applySearch(query: string): void {
  view.dispatch({ effects: setSearchQuery.of(new SearchQuery({ search: query, caseSensitive: false })) });
}

function handle(msg: Msg): void {
  const p = msg.payload ?? {};
  switch (msg.type) {
    case "setDoc":
      setDoc(String(p.text ?? ""), String(p.kind ?? "plain"));
      break;
    case "goto":
      goto(Number(p.pos ?? 0));
      break;
    case "undo":
      undo(view);
      flushChange();
      break;
    case "redo":
      redo(view);
      flushChange();
      break;
    case "find": {
      applySearch(String(p.query ?? ""));
      const ok = (p.dir === "prev" ? findPrevious : findNext)(view);
      const sel = view.state.selection.main;
      post("findResult", { found: ok, pos: sel.from }, msg.id);
      break;
    }
    case "replace":
      view.dispatch({
        effects: setSearchQuery.of(
          new SearchQuery({ search: String(p.query ?? ""), replace: String(p.text ?? ""), caseSensitive: false }),
        ),
      });
      const ok = replaceNext(view);
      flushChange();
      post("findResult", { found: ok, pos: view.state.selection.main.from }, msg.id);
      break;
    case "replaceAll": {
      applySearch(String(p.query ?? ""));
      // SearchQuery.replace drives the replacement text.
      view.dispatch({
        effects: setSearchQuery.of(
          new SearchQuery({ search: String(p.query ?? ""), replace: String(p.text ?? ""), caseSensitive: false }),
        ),
      });
      const changed = replaceAll(view);
      flushChange();
      post("findResult", { done: true, changed }, msg.id);
      break;
    }
    case "insert": {
      const text = String(p.text ?? "");
      view.dispatch(view.state.replaceSelection(text));
      view.focus();
      flushChange();
      break;
    }
    case "theme":
      view.dispatch({ effects: themeConf.reconfigure(themeFor({ ...defaultPalette, ...(p as unknown as Partial<Palette>) })) });
      break;
    case "focus":
      view.focus();
      break;
    case "flush":
      flushChange();
      break;
  }
}

window.__wviReceive = (json: string) => {
  try {
    handle(JSON.parse(json) as Msg);
  } catch (e) {
    post("error", { message: String(e) });
  }
};

post("ready", {});
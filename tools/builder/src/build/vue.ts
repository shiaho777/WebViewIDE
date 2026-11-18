// Lazy loader for the committed Vue SFC compiler asset (vue-compiler.js).
// The asset is an IIFE global; a classic <script> works on file:// WebView
// pages where dynamic ESM import does not. Loaded only when a .vue file shows up.

/** The subset of @vue/compiler-sfc the build plugin uses. */
export interface SfcCompiler {
  parse(source: string, options?: { filename?: string }): {
    descriptor: SfcDescriptor;
    errors: unknown[];
  };
  compileScript(descriptor: SfcDescriptor, options: Record<string, unknown>): { content: string };
  compileTemplate(options: Record<string, unknown>): { code: string; errors: unknown[] };
  compileStyleAsync(options: Record<string, unknown>): Promise<{ code: string; errors: unknown[] }>;
}

export interface SfcDescriptor {
  filename: string;
  source: string;
  template: { content: string; lang?: string } | null;
  script: { content: string; lang?: string } | null;
  scriptSetup: { content: string; lang?: string } | null;
  styles: Array<{ content: string; lang?: string; scoped?: boolean }>;
}

declare global {
  interface Window {
    VueCompilerSFC?: SfcCompiler;
  }
}

let loading: Promise<SfcCompiler> | null = null;

export function ensureVueCompiler(): Promise<SfcCompiler> {
  if (typeof window !== "undefined" && window.VueCompilerSFC) return Promise.resolve(window.VueCompilerSFC);
  if (loading) return loading;
  loading = new Promise<SfcCompiler>((resolve, reject) => {
    const script = document.createElement("script");
    // Relative to the builder page (file:///android_asset/builder/index.html).
    script.src = "vue-compiler.js";
    script.onload = () => {
      const c = window.VueCompilerSFC;
      if (c) resolve(c);
      else reject(new Error("Vue 编译器加载后不可用"));
    };
    script.onerror = () => {
      loading = null;
      reject(new Error("Vue 编译器加载失败（vue-compiler.js）"));
    };
    document.head.appendChild(script);
  });
  return loading;
}

/** Stable per-file scope id: data-v-xxxxxxxx from an FNV-1a path hash. */
export function sfcId(path: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < path.length; i++) {
    h ^= path.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return "data-v-" + h.toString(16).padStart(8, "0");
}

function errText(e: unknown): string {
  if (typeof e === "string") return e;
  const m = (e as { message?: string })?.message;
  return m ?? String(e);
}

export interface SfcResult {
  code: string;
  /** "ts" when any block uses TypeScript, else "js". */
  loader: "ts" | "js";
}

/**
 * Compiles one .vue file to a JS/TS module (vuejs/repl transform recipe):
 * script setup -> inlineTemplate; plain script -> separate render attached via
 * _sfc_main.render; no script -> template-only default export. Scoped styles
 * are compiled with the same id and injected as a <style> tag from module code.
 * [compiler] is injectable so Node tests can pass the vm-loaded asset.
 */
export async function compileSfc(
  source: string,
  filename: string,
  compiler?: SfcCompiler,
): Promise<SfcResult> {
  const c = compiler ?? (await ensureVueCompiler());
  // compileScript/compileTemplate add the "data-v-" prefix themselves, so they
  // need the bare hash; compileStyleAsync expects the full "data-v-xxx" id.
  const scopeId = sfcId(filename).replace(/^data-v-/, "");
  const id = sfcId(filename);
  const { descriptor, errors } = c.parse(source, { filename });
  if (errors.length) throw new Error(`${filename}: ${errText(errors[0])}`);
  const ts =
    descriptor.script?.lang === "ts" ||
    descriptor.scriptSetup?.lang === "ts" ||
    descriptor.script?.lang === "tsx" ||
    descriptor.scriptSetup?.lang === "tsx";
  const templateOptions = {
    compilerOptions: { expressionPlugins: ts ? ["typescript"] : [] },
  };
  const hasScoped = descriptor.styles.some((s) => s.scoped);
  let code: string;
  if (descriptor.script || descriptor.scriptSetup) {
    const script = c.compileScript(descriptor, {
      id: scopeId,
      inlineTemplate: true,
      genDefaultAs: "_sfc_main",
      templateOptions,
    });
    code = script.content;
    // Plain <script> + <template>: inlineTemplate only applies to script setup,
    // so compile the render function separately and attach it.
    if (!descriptor.scriptSetup && descriptor.template) {
      const tpl = c.compileTemplate({
        source: descriptor.template.content,
        filename,
        id: scopeId,
        compilerOptions: { ...templateOptions.compilerOptions, bindingMetadata: undefined },
      });
      if (tpl.errors.length) throw new Error(`${filename}: ${errText(tpl.errors[0])}`);
      code += "\n" + tpl.code.replace("export function render", "function _sfc_render");
      code += "\n_sfc_main.render = _sfc_render;";
    }
  } else if (descriptor.template) {
    const tpl = c.compileTemplate({ source: descriptor.template.content, filename, id: scopeId });
    if (tpl.errors.length) throw new Error(`${filename}: ${errText(tpl.errors[0])}`);
    code = tpl.code.replace("export function render", "function _sfc_render");
    code += "\nconst _sfc_main = { render: _sfc_render };";
  } else {
    code = "const _sfc_main = {};";
  }
  // The compiler does not emit __scopeId; the bundler must attach it (vuejs/repl).
  if (hasScoped) code += `\n_sfc_main.__scopeId = ${JSON.stringify(id)};`;
  code += "\nexport default _sfc_main;";
  // Styles: compile (scoped rewrite when requested) and inject at module eval.
  const css: string[] = [];
  for (const style of descriptor.styles) {
    const out = await c.compileStyleAsync({
      source: style.content,
      filename,
      id,
      scoped: Boolean(style.scoped),
    });
    if (out.errors.length) throw new Error(`${filename}: ${errText(out.errors[0])}`);
    css.push(out.code);
  }
  if (css.length) {
    code +=
      `\n{const __sfc_css = ${JSON.stringify(css.join("\n"))};` +
      `const __sfc_el = document.createElement("style");` +
      `__sfc_el.textContent = __sfc_css;document.head.appendChild(__sfc_el);}`;
  }
  return { code, loader: ts ? "ts" : "js" };
}
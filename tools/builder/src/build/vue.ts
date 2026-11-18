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
  if (window.VueCompilerSFC) return Promise.resolve(window.VueCompilerSFC);
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
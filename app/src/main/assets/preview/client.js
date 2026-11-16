// WebViewIDE live-preview client, injected before </body> by LocalPreviewServer.
// SSE payload: {"gen":N,"kind":"css"|"full","path":"relative/or/empty"}
// - css: swap matching <link rel=stylesheet> hrefs with a cache-busting param,
//   no reload, page state untouched.
// - full: snapshot scroll + form values to sessionStorage, reload, restore.
// Degrades to a plain reload whenever anything is unavailable.
(function () {
  "use strict";
  var KEY = "__wvi_state";

  function snapshot() {
    try {
      var fields = [];
      var els = document.querySelectorAll("input,textarea,select");
      for (var i = 0; i < els.length && fields.length < 300; i++) {
        var el = els[i];
        var id = el.id || el.name;
        if (!id) continue;
        var type = (el.type || "").toLowerCase();
        if (type === "password" || type === "file") continue;
        if (type === "checkbox" || type === "radio") {
          fields.push({ id: id, checked: !!el.checked });
        } else {
          fields.push({ id: id, value: el.value });
        }
      }
      sessionStorage.setItem(
        KEY,
        JSON.stringify({
          url: location.pathname + location.search,
          x: window.scrollX,
          y: window.scrollY,
          fields: fields,
          t: Date.now(),
        })
      );
    } catch (e) {
      /* storage unavailable: plain reload */
    }
  }

  function restore() {
    try {
      var raw = sessionStorage.getItem(KEY);
      if (!raw) return;
      sessionStorage.removeItem(KEY);
      var s = JSON.parse(raw);
      if (!s || s.url !== location.pathname + location.search) return;
      if (Date.now() - s.t > 15000) return;
      var byId = {};
      (s.fields || []).forEach(function (f) { byId[f.id] = f; });
      var els = document.querySelectorAll("input,textarea,select");
      for (var i = 0; i < els.length; i++) {
        var el = els[i];
        var f = byId[el.id || el.name];
        if (!f) continue;
        try {
          if ("checked" in f) el.checked = f.checked;
          else if ("value" in f) el.value = f.value;
        } catch (e) { /* skip stubborn element */ }
      }
      window.scrollTo(s.x || 0, s.y || 0);
      // Fonts/images may shift layout after load; re-apply once more.
      setTimeout(function () { window.scrollTo(s.x || 0, s.y || 0); }, 120);
    } catch (e) {
      /* restore failed: page still usable at top */
    }
  }

  function hotSwapCss(path, gen) {
    var links = document.querySelectorAll('link[rel~="stylesheet"]');
    var hit = false;
    for (var i = 0; i < links.length; i++) {
      var link = links[i];
      var href = link.getAttribute("href") || "";
      if (!href || /^(https?:)?\/\//i.test(href) || href.indexOf("data:") === 0) continue;
      var clean = href.split("?")[0].split("#")[0];
      var norm = clean.replace(/^\.\//, "").replace(/^\//, "");
      if (path && norm !== path.replace(/^\//, "")) continue;
      var next = clean + (clean.indexOf("?") >= 0 ? "&" : "?") + "__wvi=" + gen;
      // Swap on a clone so styles never flash empty; drop the old node onload.
      var clone = link.cloneNode();
      clone.setAttribute("href", next);
      clone.onload = function () { if (link.parentNode) link.parentNode.removeChild(link); };
      clone.onerror = function () { if (clone.parentNode) clone.parentNode.removeChild(clone); };
      link.parentNode.insertBefore(clone, link.nextSibling);
      hit = true;
    }
    if (!hit) fullReload();
  }

  function fullReload() {
    snapshot();
    location.reload();
  }

  try {
    var es = new EventSource("/__webviewide/reload");
    es.onmessage = function (ev) {
      var msg;
      try { msg = JSON.parse(ev.data); } catch (e) { fullReload(); return; }
      if (msg && msg.kind === "css") hotSwapCss(msg.path || "", msg.gen || Date.now());
      else fullReload();
    };
  } catch (e) {
    /* SSE unavailable: no live reload */
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", restore);
  } else {
    restore();
  }
  window.addEventListener("load", restore);
})();
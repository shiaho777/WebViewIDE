package dev.webviewide.preview

import dev.webviewide.project.jsonObject
import dev.webviewide.project.obj
import dev.webviewide.project.parseJson
import dev.webviewide.project.string

/**
 * In-app element inspector for the preview. Injects a picker into the page;
 * tapping an element reports its selector, size and a few computed styles back
 * through console.debug with a reserved prefix, which [parse] turns into a
 * readable summary. Real breakpoints stay with chrome://inspect.
 */
object DomInspector {
    const val PREFIX = "__WVI_DOM__"

    /** Picker script. Idempotent: re-running removes the previous listeners. */
    val enableScript: String = """
      (function(){
        if (window.__wviDomOn) { window.__wviDomOff && window.__wviDomOff(); }
        window.__wviDomOn = true;
        var hl = document.createElement('div');
        hl.style.cssText = 'position:fixed;pointer-events:none;z-index:2147483647;border:2px solid #61809b;background:rgba(97,128,155,.12);display:none;';
        document.documentElement.appendChild(hl);
        function box(e){ var r=e.getBoundingClientRect(); hl.style.display='block'; hl.style.left=r.left+'px'; hl.style.top=r.top+'px'; hl.style.width=r.width+'px'; hl.style.height=r.height+'px'; }
        function sel(e){ var s=e.tagName.toLowerCase(); if(e.id) s+='#'+e.id; else if(e.className && typeof e.className==='string') s+='.'+e.className.trim().split(/\s+/).join('.'); return s; }
        function over(e){ if(e.target && e.target!==hl) box(e.target); }
        function click(e){
          e.preventDefault(); e.stopPropagation();
          var t=e.target; if(!t || t===hl) return;
          box(t);
          var cs=getComputedStyle(t); var r=t.getBoundingClientRect();
          var data={ sel:sel(t), w:Math.round(r.width), h:Math.round(r.height),
            styles:{ color:cs.color, background:cs.backgroundColor, font:cs.fontSize+' '+cs.fontFamily,
                     display:cs.display, margin:cs.margin, padding:cs.padding } };
          console.debug('$PREFIX'+JSON.stringify(data));
        }
        document.addEventListener('mouseover', over, true);
        document.addEventListener('click', click, true);
        window.__wviDomOff=function(){ document.removeEventListener('mouseover',over,true); document.removeEventListener('click',click,true); hl.remove(); window.__wviDomOn=false; };
      })();
    """.trimIndent()

    val disableScript: String = "window.__wviDomOff && window.__wviDomOff();"

    data class ElementInfo(val selector: String, val width: Int, val height: Int, val styles: Map<String, String>)

    /** Parses a reserved-prefix console payload; null for anything else. */
    fun parse(message: String): ElementInfo? {
        if (!message.startsWith(PREFIX)) return null
        return runCatching {
            val o = parseJson(message.removePrefix(PREFIX)).jsonObject()
            val styles = o.obj("styles")
            val map = linkedMapOf<String, String>()
            styles.forEach { (k, v) -> if (v is String) map[k] = v }
            ElementInfo(
                selector = o.string("sel"),
                width = (o["w"] as? Number)?.toInt() ?: 0,
                height = (o["h"] as? Number)?.toInt() ?: 0,
                styles = map,
            )
        }.getOrNull()
    }

    fun format(info: ElementInfo): String = buildString {
        append(info.selector).append("  ·  ").append(info.width).append("×").append(info.height).append('\n')
        info.styles.forEach { (k, v) -> append(k).append(": ").append(v).append('\n') }
    }.trimEnd()
}
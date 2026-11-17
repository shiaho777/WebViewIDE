package dev.webviewide.preview

import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test

class DomInspectorTest {
    @Test fun parsesReservedPrefixPayload() {
        val json = """{"sel":"div#a.b","w":100,"h":40,"styles":{"color":"rgb(1, 2, 3)","display":"block"}}"""
        val info = DomInspector.parse(DomInspector.PREFIX + json)
        assertEquals("div#a.b", info?.selector)
        assertEquals(100, info?.width)
        assertEquals(40, info?.height)
        assertEquals("block", info?.styles?.get("display"))
    }

    @Test fun ignoresNonInspectorMessages() {
        assertNull(DomInspector.parse("hello world"))
        assertNull(DomInspector.parse(DomInspector.PREFIX + "not-json"))
        assertNull(DomInspector.parse(""))
    }

    @Test fun formatIncludesSelectorAndStyles() {
        val info = DomInspector.ElementInfo("p.x", 10, 20, linkedMapOf("color" to "red"))
        val text = DomInspector.format(info)
        assertTrue(text.contains("p.x"))
        assertTrue(text.contains("10×20"))
        assertTrue(text.contains("color: red"))
    }

    @Test fun enableScriptIsSelfContainedAndIdempotent() {
        val s = DomInspector.enableScript
        assertTrue(s.contains("__wviDomOn"))
        assertTrue(s.contains("__wviDomOff"))
        assertTrue(s.contains(DomInspector.PREFIX))
        assertTrue("must not fetch remote code", !s.contains("http://") && !s.contains("https://"))
    }

    @Test fun chromeRoutesPicksAndWiringPresent() {
        val chrome = java.io.File("src/main/java/dev/webviewide/preview/PreviewChrome.kt").readText()
        assertTrue(chrome.contains("DomInspector.parse(text)"))
        assertTrue(chrome.contains("host.onDomPick(picked)"))
        val preview = java.io.File("src/main/java/dev/webviewide/preview/WebPreview.kt").readText()
        assertTrue(preview.contains("DomInspector.enableScript"))
        assertTrue(preview.contains("DomInspector.disableScript"))
        assertTrue(preview.contains("host.onDomPick = { info -> domInfo = info }"))
    }
}
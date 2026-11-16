package dev.webviewide.ui.editor

import dev.webviewide.project.SourceKind
import dev.webviewide.project.int
import dev.webviewide.project.jsonObject
import dev.webviewide.project.obj
import dev.webviewide.project.parseJson
import dev.webviewide.project.string
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test

class EditorBridgeTest {
    @Test fun downMessagesCarryIdTypePayload() {
        val json = EditorBridge.setDoc(7, "<b>hi</b>\n\"x\"", SourceKind.HTML)
        val root = parseJson(json).jsonObject()
        assertEquals(7, root.int("id", 0))
        assertEquals("setDoc", root.string("type"))
        val payload = root.obj("payload")
        assertEquals("<b>hi</b>\n\"x\"", payload.string("text"))
        assertEquals("html", payload.string("kind"))
    }

    @Test fun kindKeysCoverAllSourceKinds() {
        assertEquals("html", EditorBridge.kindKey(SourceKind.HTML))
        assertEquals("css", EditorBridge.kindKey(SourceKind.CSS))
        assertEquals("js", EditorBridge.kindKey(SourceKind.JS))
        assertEquals("json", EditorBridge.kindKey(SourceKind.JSON))
        assertEquals("plain", EditorBridge.kindKey(SourceKind.PLAIN))
    }

    @Test fun findAndReplaceDirections() {
        assertEquals("next", parseJson(EditorBridge.find(1, "q", true)).jsonObject().obj("payload").string("dir"))
        assertEquals("prev", parseJson(EditorBridge.find(1, "q", false)).jsonObject().obj("payload").string("dir"))
        assertEquals("replace", parseJson(EditorBridge.replace(1, "q", "r", false)).jsonObject().string("type"))
        assertEquals("replaceAll", parseJson(EditorBridge.replace(1, "q", "r", true)).jsonObject().string("type"))
        assertEquals("r", parseJson(EditorBridge.replace(1, "q", "r", true)).jsonObject().obj("payload").string("text"))
    }

    @Test fun jsCallSafelyQuotesTheMessage() {
        val message = EditorBridge.insert(3, "'); alert('x")
        val call = EditorBridge.jsCall(message)
        assertTrue(call.startsWith("window.__wviReceive("))
        assertTrue(call.endsWith(")"))
        // The payload must survive as a single JS string literal, not executable code.
        val quoted = call.removePrefix("window.__wviReceive(").removeSuffix(")")
        val decoded = parseJson(parseJson(quoted) as String).jsonObject()
        assertEquals("'); alert('x", decoded.obj("payload").string("text"))
    }

    @Test fun upEventsParse() {
        assertEquals(EditorEvent.Ready, EditorEvents.parse("""{"id":0,"type":"ready","payload":{}}"""))
        val change = EditorEvents.parse("""{"id":0,"type":"change","payload":{"text":"a\nb"}}""")
        assertEquals(EditorEvent.Change("a\nb"), change)
        val cursor = EditorEvents.parse("""{"id":0,"type":"cursor","payload":{"pos":12,"line":3,"col":4}}""")
        assertEquals(EditorEvent.Cursor(12, 3, 4), cursor)
        val found = EditorEvents.parse("""{"id":2,"type":"findResult","payload":{"found":true,"pos":8}}""")
        assertEquals(EditorEvent.FindResult(found = true, pos = 8, done = false, changed = false), found)
        val done = EditorEvents.parse("""{"id":2,"type":"findResult","payload":{"done":true,"changed":true}}""")
        assertEquals(EditorEvent.FindResult(found = false, pos = 0, done = true, changed = true), done)
        val err = EditorEvents.parse("""{"id":0,"type":"error","payload":{"message":"boom"}}""")
        assertEquals(EditorEvent.Error("boom"), err)
    }

    @Test fun malformedUpMessagesAreIgnored() {
        assertNull(EditorEvents.parse("not json"))
        assertNull(EditorEvents.parse("[]"))
        assertNull(EditorEvents.parse("""{"type":"unknown","payload":{}}"""))
        assertNull(EditorEvents.parse(""))
    }
}
package dev.webviewide.build

import dev.webviewide.project.int
import dev.webviewide.project.jsonObject
import dev.webviewide.project.obj
import dev.webviewide.project.parseJson
import dev.webviewide.project.string
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test

class BuildBridgeTest {
    @Test fun downCommandsAreWellFormed() {
        val root = parseJson(BuildBridge.install(7)).jsonObject()
        assertEquals(7, root.int("id", 0))
        assertEquals("install", root.string("type"))
        assertEquals("build", parseJson(BuildBridge.build(8)).jsonObject().string("type"))
        assertEquals("cancel", parseJson(BuildBridge.cancel(9)).jsonObject().string("type"))
        assertEquals("typecheck", parseJson(BuildBridge.typecheck(3)).jsonObject().string("type"))
        assertEquals("tsUrl", parseJson(BuildBridge.tsUrl(3, "https://x/")).jsonObject().string("type"))
    }

    @Test fun typecheckDoneParsesSeparatelyFromBuildDone() {
        val tc = BuildEvents.parse("""{"id":3,"type":"tcdone","payload":{"ok":false,"summary":"2 errors"}}""")?.second
        assertEquals(BuildEvent.TcDone(false, "2 errors"), tc)
    }

    @Test fun netResponseCarriesBodyAndDigest() {
        val p = parseJson(BuildBridge.netResponse(3, 200, "aGk=", "abc123", "etag1")).jsonObject().obj("payload")
        assertEquals(200, p.int("status", 0))
        assertEquals("aGk=", p.string("body"))
        assertEquals("abc123", p.string("sha512"))
        assertEquals("etag1", p.string("etag"))
    }

    @Test fun upEventsRoundTrip() {
        assertEquals(BuildEvent.Ready, BuildEvents.parse("""{"id":0,"type":"ready","payload":{}}""")?.second)
        val log = BuildEvents.parse("""{"id":1,"type":"log","payload":{"level":"warn","text":"hi"}}""")
        assertEquals(1L, log?.first)
        assertEquals(BuildEvent.Log("warn", "hi"), log?.second)
        val prog = BuildEvents.parse("""{"id":2,"type":"progress","payload":{"fraction":0.5,"label":"install"}}""")?.second
        assertEquals(BuildEvent.Progress(0.5f, "install"), prog)
        val net = BuildEvents.parse("""{"id":3,"type":"net","payload":{"url":"https://r/x","method":"GET","integrity":"sha512-abc"}}""")?.second
        assertEquals(BuildEvent.Net("https://r/x", "GET", "sha512-abc"), net)
        val fw = BuildEvents.parse("""{"id":4,"type":"fsWrite","payload":{"path":"a.js","text":"x"}}""")?.second
        assertEquals(BuildEvent.FsWrite("a.js", "x", null), fw)
        val fr = BuildEvents.parse("""{"id":5,"type":"fsRead","payload":{"path":"a.js"}}""")?.second
        assertEquals(BuildEvent.FsRead("a.js"), fr)
        val done = BuildEvents.parse("""{"id":6,"type":"done","payload":{"ok":true,"summary":"ok"}}""")?.second
        assertEquals(BuildEvent.Done(true, "ok"), done)
        val err = BuildEvents.parse("""{"id":7,"type":"error","payload":{"message":"boom"}}""")?.second
        assertEquals(BuildEvent.Error("boom"), err)
    }

    @Test fun malformedUpMessagesAreRejected() {
        assertNull(BuildEvents.parse("not json"))
        assertNull(BuildEvents.parse("[]"))
        assertNull(BuildEvents.parse("""{"id":1,"type":"unknown","payload":{}}"""))
        assertNull(BuildEvents.parse(""))
    }

    @Test fun jsCallSafelyQuotes() {
        val call = BuildBridge.jsCall(BuildBridge.install(1))
        assertTrue(call.startsWith("window.__wviBuildReceive("))
        assertTrue(call.endsWith(")"))
    }
}
package dev.webviewide.server

import java.io.File
import java.net.Socket
import kotlin.io.path.createTempDirectory
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test

class PreviewServerTest {
    @Test fun normalizeRejectsEscape() {
        assertEquals("a/b", SiteFiles.normalize("/a/b"))
        assertEquals("b", SiteFiles.normalize("/a/../b"))
        assertNull(SiteFiles.normalize("/../x"))
        assertNull(SiteFiles.normalize("/%2e%2e/x"))
        assertEquals("b", SiteFiles.normalize("/a/%2e%2e/b"))
    }

    @Test fun basePrefixOnlyKeepsAbsolutePaths() {
        assertEquals("/docs/", SiteFiles.basePrefix("""<base href="/docs">"""))
        assertEquals("", SiteFiles.basePrefix("""<base href="https://example.com/">"""))
        assertEquals("", SiteFiles.basePrefix("""<base href="assets/">"""))
    }

    @Test fun resolveSpaBaseAndMissingAssets() {
        val root = createTempDirectory("site").toFile()
        try {
            File(root, "index.html").writeText("<html>home</html>")
            File(root, "app.js").writeText("js")
            val home = SiteFiles.resolve(root, "/", false, "index.html", "")
            assertTrue(home is SiteHit.FileHit)
            val spa = SiteFiles.resolve(root, "/app/page", true, "index.html", "/app/")
            assertTrue(spa is SiteHit.FileHit)
            assertEquals("index.html", (spa as SiteHit.FileHit).file.name)
            val missing = SiteFiles.resolve(root, "/missing.js", true, "index.html", "")
            assertTrue(missing is SiteHit.Error)
            assertEquals(404, (missing as SiteHit.Error).code)
            val escape = SiteFiles.resolve(root, "/../../", true, "index.html", "")
            assertEquals(400, (escape as SiteHit.Error).code)
            val outside = File(root.parentFile, "outside.txt")
            assertFalse(SiteFiles.isInside(root, outside))
            assertTrue(SiteFiles.isInside(root, File(root, "index.html")))
        } finally {
            root.deleteRecursively()
        }
    }

    @Test fun serverServesIndexSpaAndRejectsTraversal() {
        val root = createTempDirectory("preview").toFile()
        val server = LocalPreviewServer()
        try {
            File(root, "index.html").writeText("<!doctype html><html><body><p>hi</p></body></html>")
            server.root = root
            server.spaFallback = true
            server.liveReload = true
            server.entryFile = "index.html"
            val port = server.start(4173, false)
            val index = awaitGet(port, "/index.html")
            assertEquals(200, index.first)
            assertTrue(index.second.contains("data-webviewide=\"reload\""))
            assertTrue(index.second.contains("hi"))
            assertTrue(index.third.contains("no-store"))
            val route = awaitGet(port, "/app/page")
            assertEquals(200, route.first)
            assertTrue(route.second.contains("hi"))
            val missing = awaitGet(port, "/missing.js")
            assertEquals(404, missing.first)
            val slip = awaitGet(port, "/../../")
            assertEquals(400, slip.first)
            val encoded = awaitGet(port, "/%2e%2e/")
            assertEquals(400, encoded.first)
        } finally {
            server.stop()
            root.deleteRecursively()
        }
    }

    private fun awaitGet(port: Int, path: String): Triple<Int, String, String> {
        var last: Exception? = null
        repeat(20) {
            try {
                return get(port, path)
            } catch (error: Exception) {
                last = error
                Thread.sleep(25)
            }
        }
        throw last ?: IllegalStateException("no response")
    }

    private fun get(port: Int, path: String): Triple<Int, String, String> {
        Socket("127.0.0.1", port).use { socket ->
            socket.soTimeout = 2000
            val out = socket.getOutputStream()
            out.write("GET $path HTTP/1.1\r\nHost: 127.0.0.1\r\nConnection: close\r\n\r\n".toByteArray())
            out.flush()
            val text = socket.getInputStream().readBytes().toString(Charsets.ISO_8859_1)
            val status = text.substringAfter(" ").substringBefore(" ").toInt()
            val head = text.substringBefore("\r\n\r\n")
            val body = text.substringAfter("\r\n\r\n")
            return Triple(status, body, head)
        }
    }
}

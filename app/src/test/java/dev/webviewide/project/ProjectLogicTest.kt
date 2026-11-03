package dev.webviewide.project

import java.io.ByteArrayOutputStream
import java.io.File
import java.util.zip.ZipEntry
import java.util.zip.ZipOutputStream
import kotlin.io.path.createTempDirectory
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test

class ProjectLogicTest {
    @Test fun jsonRoundTripKeepsValues() {
        val text = encodeJson(
            mapOf(
                "s" to "a\"b\n",
                "b" to false,
                "n" to 3,
                "list" to listOf(1, "x"),
                "obj" to mapOf("k" to true),
            ),
        )
        val parsed = parseJson(text).jsonObject()
        assertEquals("a\"b\n", parsed.string("s"))
        assertEquals(false, parsed.boolean("b", true))
        assertEquals(3, parsed.int("n", 0))
        assertEquals("x", (parsed["list"] as List<*>)[1])
        assertEquals(true, parsed.obj("obj").boolean("k", false))
        assertEquals(text, encodeJson(parseJson(text)))
    }

    @Test fun webViewConfigRoundTripAndPermissions() {
        val config = WebViewConfig(
            javaScript = false,
            textZoom = 12,
            geolocation = false,
            cameraMic = true,
            userAgent = WebViewConfig.UA_DESKTOP,
            customUserAgent = "Mine",
            mixedContent = WebViewConfig.MIXED_NEVER,
        )
        val back = WebViewConfig.fromMap(parseJson(config.encode()).jsonObject())
        assertFalse(back.javaScript)
        assertEquals(50, back.textZoom)
        assertFalse(back.geolocation)
        assertEquals(WebViewConfig.UA_DESKTOP, back.userAgent)
        assertEquals(WebViewConfig.MIXED_NEVER, back.mixedContent)
        assertFalse(config.extraPermissions().any { it.contains("LOCATION") })
        assertTrue(config.extraPermissions().contains("android.permission.CAMERA"))
        assertTrue(config.extraPermissions().contains("android.permission.RECORD_AUDIO"))
        val both = WebViewConfig()
        assertTrue(both.extraPermissions().contains("android.permission.ACCESS_FINE_LOCATION"))
    }

    @Test fun packageNames() {
        assertTrue(ProjectIds.validPackageName("com.example.app"))
        assertTrue(ProjectIds.validPackageName("dev.webviewide.app_1"))
        assertFalse(ProjectIds.validPackageName("app"))
        assertFalse(ProjectIds.validPackageName("1.bad"))
        assertFalse(ProjectIds.validPackageName("com.example.1app"))
        assertFalse(ProjectIds.validPackageName("com..app"))
        assertEquals("p123", ProjectIds.packageSegment("123"))
        assertTrue(ProjectIds.profileName("ab/c").startsWith("p"))
    }

    @Test fun staticSiteIsRunnable() {
        val root = temp()
        try {
            File(root, "index.html").writeText("<html></html>")
            val found = ProjectDetect.detect(root)
            assertEquals(ProjectKinds.STATIC, found.kind)
            assertEquals("", found.serveRoot)
            assertTrue(found.runnable)
            assertFalse(found.spaFallback)
        } finally {
            root.deleteRecursively()
        }
    }

    @Test fun viteDistWinsOverPublicAndVueSource() {
        val root = temp()
        try {
            File(root, "package.json").writeText("""{"dependencies":{"vue":"3.5.0"}}""")
            File(root, "public").mkdirs()
            File(root, "public/index.html").writeText("public")
            File(root, "dist").mkdirs()
            File(root, "dist/index.html").writeText("built")
            val found = ProjectDetect.detect(root)
            assertEquals(ProjectKinds.VUE, found.kind)
            assertEquals("dist", found.serveRoot)
            assertTrue(found.runnable)
            assertTrue(found.spaFallback)
        } finally {
            root.deleteRecursively()
        }
    }

    @Test fun craBuildReact() {
        val root = fixture("""{"dependencies":{"react":"18.3.1","react-dom":"18.3.1"}}""", "build/index.html")
        try {
            val found = ProjectDetect.detect(root)
            assertEquals(ProjectKinds.REACT, found.kind)
            assertEquals("build", found.serveRoot)
            assertTrue(found.spaFallback)
        } finally {
            root.deleteRecursively()
        }
    }

    @Test fun nextOut() {
        val root = fixture("""{"dependencies":{"next":"14.0.0","react":"18.3.1"}}""", "out/index.html")
        try {
            val found = ProjectDetect.detect(root)
            assertEquals(ProjectKinds.NEXT, found.kind)
            assertEquals("out", found.serveRoot)
        } finally {
            root.deleteRecursively()
        }
    }

    @Test fun nuxtOutput() {
        val root = fixture("""{"dependencies":{"nuxt":"3.0.0"}}""", ".output/public/index.html")
        try {
            val found = ProjectDetect.detect(root)
            assertEquals(ProjectKinds.NUXT, found.kind)
            assertEquals(".output/public", found.serveRoot)
            assertTrue(found.runnable)
        } finally {
            root.deleteRecursively()
        }
    }

    @Test fun angularBrowserBundle() {
        val root = fixture("""{"dependencies":{"@angular/core":"18.0.0"}}""", "dist/myapp/browser/index.html")
        try {
            val found = ProjectDetect.detect(root)
            assertEquals(ProjectKinds.ANGULAR, found.kind)
            assertEquals("dist/myapp/browser", found.serveRoot)
            assertTrue(found.spaFallback)
        } finally {
            root.deleteRecursively()
        }
    }

    @Test fun vueSourceWithoutDistIsNotRunnable() {
        val root = temp()
        try {
            File(root, "package.json").writeText("""{"dependencies":{"vue":"3.5.0"}}""")
            File(root, "src").mkdirs()
            File(root, "src/App.vue").writeText("<template></template>")
            val found = ProjectDetect.detect(root)
            assertEquals(ProjectKinds.VUE, found.kind)
            assertFalse(found.runnable)
            assertTrue(found.summary.contains("Vue"))
        } finally {
            root.deleteRecursively()
        }
    }

    @Test fun docsifyRootIsRunnable() {
        val root = temp()
        try {
            File(root, "package.json").writeText("""{"dependencies":{"docsify":"4.0.0"}}""")
            File(root, "index.html").writeText("<html></html>")
            val found = ProjectDetect.detect(root)
            assertEquals(ProjectKinds.DOCS, found.kind)
            assertTrue(found.runnable)
            assertFalse(found.spaFallback)
        } finally {
            root.deleteRecursively()
        }
    }

    @Test fun vendoredMarkersRunOnDevice() {
        val vue = temp()
        val react = temp()
        try {
            File(vue, "index.html").writeText("<html></html>")
            File(vue, "vue.global.prod.js").writeText("vue")
            val vueFound = ProjectDetect.detect(vue)
            assertEquals(ProjectKinds.VUE, vueFound.kind)
            assertTrue(vueFound.runnable)
            File(react, "index.html").writeText("<html></html>")
            File(react, "react.production.min.js").writeText("react")
            val reactFound = ProjectDetect.detect(react)
            assertEquals(ProjectKinds.REACT, reactFound.kind)
            assertTrue(reactFound.runnable)
        } finally {
            vue.deleteRecursively()
            react.deleteRecursively()
        }
    }

    @Test fun missingIndexIsNotRunnable() {
        val root = temp()
        try {
            File(root, "readme.txt").writeText("hi")
            val found = ProjectDetect.detect(root)
            assertEquals(ProjectKinds.SOURCE, found.kind)
            assertFalse(found.runnable)
        } finally {
            root.deleteRecursively()
        }
    }

    @Test fun treeSkipsNodeModulesAndListsDirsFirst() {
        val root = temp()
        try {
            File(root, "b.js").writeText("b")
            File(root, "a").mkdirs()
            File(root, "a/c.js").writeText("c")
            File(root, "node_modules").mkdirs()
            File(root, "node_modules/x.js").writeText("x")
            val closed = FileTreeIndex.rows(root, emptySet())
            assertEquals(listOf("a", "b.js"), closed.map { it.rel })
            val open = FileTreeIndex.rows(root, setOf("a"))
            assertEquals(listOf("a", "a/c.js", "b.js"), open.map { it.rel })
            assertTrue(open.first().directory)
        } finally {
            root.deleteRecursively()
        }
    }

    @Test fun unzipSkipsNodeModulesAndUnwrapsSingleRoot() {
        val dest = temp()
        try {
            val bytes = ByteArrayOutputStream()
            ZipOutputStream(bytes).use { zip ->
                zip.putNextEntry(ZipEntry("app/node_modules/left.js"))
                zip.write("no".toByteArray())
                zip.putNextEntry(ZipEntry("app/index.html"))
                zip.write("<html></html>".toByteArray())
                zip.closeEntry()
            }
            ArchiveImport.unzip(bytes.toByteArray().inputStream(), dest)
            assertTrue(File(dest, "index.html").isFile)
            assertFalse(File(dest, "node_modules").exists())
            assertFalse(File(dest, "app").exists())
        } finally {
            dest.deleteRecursively()
        }
    }

    @Test fun unzipRejectsZipSlip() {
        val dest = temp()
        try {
            val bytes = ByteArrayOutputStream()
            ZipOutputStream(bytes).use { zip ->
                zip.putNextEntry(ZipEntry("../evil.txt"))
                zip.write("no".toByteArray())
                zip.closeEntry()
            }
            var threw = false
            try {
                ArchiveImport.unzip(bytes.toByteArray().inputStream(), dest)
            } catch (_: ImportLimitException) {
                threw = true
            }
            assertTrue(threw)
            assertFalse(File(dest.parentFile, "evil.txt").exists())
        } finally {
            dest.deleteRecursively()
        }
    }

    @Test fun highlighterCoversTheWholeBuffer() {
        val samples = listOf(
            SourceKind.HTML to """<div class="a">hi</div><script>const x = 1;</script><style>color: #fff;</style><!-- n -->""",
            SourceKind.JS to "const n = 1; // c\nlet s = \"a\"",
            SourceKind.CSS to "body { color: #abc; margin: 0; } /* x */",
            SourceKind.JSON to """{"a": true, "n": 1, "s": "x"}""",
            SourceKind.PLAIN to "plain text",
        )
        for ((kind, code) in samples) {
            val tokens = tokenize(code, kind)
            var cursor = 0
            for (tok in tokens) {
                assertEquals(code, cursor, tok.start)
                assertTrue(tok.end > tok.start)
                cursor = tok.end
            }
            assertEquals(code.length, cursor)
        }
    }

    private fun fixture(pkg: String, index: String): File {
        val root = temp()
        File(root, "package.json").writeText(pkg)
        val file = File(root, index)
        file.parentFile?.mkdirs()
        file.writeText("<html></html>")
        return root
    }

    private fun temp(): File = createTempDirectory("webviewide").toFile()
}

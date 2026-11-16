package dev.webviewide.project

import java.io.File
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class TemplatesTest {
    private val root = File("src/main/assets/templates")

    @Test fun everyTemplateHasItsAssets() {
        assertTrue("templates dir missing: ${root.absolutePath}", root.isDirectory)
        Templates.all.forEach { t ->
            val dir = File(root, t.id)
            assertTrue("${t.id} directory missing", dir.isDirectory)
            assertTrue("${t.id} needs index.html", File(dir, "index.html").isFile)
            assertTrue("${t.id} needs styles.css", File(dir, "styles.css").isFile)
        }
    }

    @Test fun metadataIdsMatchAssetDirectories() {
        val onDisk = root.listFiles()?.filter { it.isDirectory }?.map { it.name }?.sorted().orEmpty()
        assertEquals(onDisk, Templates.all.map { it.id }.sorted())
        Templates.all.forEach {
            assertTrue("${it.id} needs a name", it.name.isNotBlank())
            assertTrue("${it.id} needs a description", it.description.isNotBlank())
        }
    }

    @Test fun templatesAreFullyOffline() {
        // Packaged apps must work with no network: no CDN scripts, styles or fonts.
        val remote = Regex("""(src|href)\s*=\s*["']https?://""", RegexOption.IGNORE_CASE)
        Templates.all.forEach { t ->
            File(root, t.id).walkTopDown().filter { it.isFile && it.extension in setOf("html", "css", "js") }
                .forEach { f ->
                    val text = f.readText()
                    assertFalse("${t.id}/${f.name} references a remote asset", remote.containsMatchIn(text))
                    assertFalse("${t.id}/${f.name} uses @import from the network", text.contains("@import url(http"))
                }
        }
    }

    @Test fun showcaseTemplatesAreTheThreePolishedStarters() {
        assertEquals(listOf("portfolio", "game", "tool"), Templates.showcase.map { it.id })
        Templates.showcase.forEach { t ->
            assertTrue("${t.id} should ship a script", File(root, "${t.id}/main.js").isFile)
        }
    }

    @Test fun showcaseTemplatesUseLocalPersistenceOrAnimation() {
        // Each showcase starter should demonstrate a real capability, not a counter.
        val game = File(root, "game/main.js").readText()
        assertTrue(game.contains("localStorage"))
        val tool = File(root, "tool/main.js").readText()
        assertTrue(tool.contains("localStorage"))
        assertTrue(tool.contains("setInterval"))
        val portfolio = File(root, "portfolio/main.js").readText()
        assertTrue(portfolio.contains("IntersectionObserver"))
        assertTrue(portfolio.contains("requestAnimationFrame"))
    }

    @Test fun ledgerTemplateEscapesUserInput() {
        val tool = File(root, "tool/main.js").readText()
        assertTrue("user notes must be escaped before innerHTML", tool.contains("function escapeHtml"))
        assertTrue(tool.contains("escapeHtml(i.note)"))
    }

    @Test fun frameworkTemplatesStayBuildFree() {
        // Vue/React must use the bundled local builds and a real app, not a counter.
        listOf("vue" to "vue.global.prod.js", "react" to "react.production.min.js").forEach { (id, lib) ->
            val html = File(root, "$id/index.html").readText()
            assertTrue("$id must load $lib locally", html.contains("src=\"$lib\""))
            assertTrue(File(root, "$id/$lib").isFile)
            assertTrue("$id should be a todo app", html.contains("todos"))
            assertFalse("$id should not be the old counter demo", html.contains("count++"))
        }
        assertTrue(File(root, "react/htm.umd.js").isFile)
    }

    @Test fun lookupHelpersBehave() {
        assertTrue(Templates.isKnown("portfolio"))
        assertFalse(Templates.isKnown("does-not-exist"))
        assertEquals("个人主页", Templates.byId("portfolio")?.name)
        assertEquals(null, Templates.byId("nope"))
    }
}
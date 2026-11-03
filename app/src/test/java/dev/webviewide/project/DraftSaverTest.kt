package dev.webviewide.project

import java.io.File
import java.io.IOException
import kotlin.io.path.createTempDirectory
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class DraftSaverTest {
    @Test fun savesNewerVersionsOnly() {
        val writes = mutableListOf<String>()
        val saver = DraftSaver { _, text -> writes += text }
        val file = File("index.html")
        assertFalse(saver.isSaved(1))
        assertTrue(saver.save(file, "a", 1))
        assertTrue(saver.isSaved(1))
        assertFalse(saver.save(file, "stale", 1))
        assertTrue(saver.save(file, "b", 2))
        assertEquals(listOf("a", "b"), writes)
    }

    @Test fun discardSkipsPendingVersion() {
        val writes = mutableListOf<String>()
        val saver = DraftSaver { _, text -> writes += text }
        saver.discardThrough(3)
        assertTrue(saver.isSaved(3))
        assertFalse(saver.save(File("old.js"), "draft", 3))
        saver.discardThrough(1)
        assertTrue(saver.isSaved(3))
        assertTrue(writes.isEmpty())
    }

    @Test fun failedWriteStaysDirty() {
        var fail = true
        val saver = DraftSaver { _, _ -> if (fail) throw IOException("disk full") }
        val file = File("main.js")
        assertTrue(runCatching { saver.save(file, "x", 1) }.isFailure)
        assertFalse(saver.isSaved(1))
        fail = false
        assertTrue(saver.save(file, "x", 1))
        assertTrue(saver.isSaved(1))
    }

    @Test fun defaultWriterLandsOnDiskBeforeReturning() {
        val root = createTempDirectory("draft").toFile()
        try {
            val file = File(root, "src/index.html")
            val saver = DraftSaver()
            assertTrue(saver.save(file, "<h1>hi</h1>", 1))
            assertEquals("<h1>hi</h1>", file.readText())
        } finally {
            root.deleteRecursively()
        }
    }
}

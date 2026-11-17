package dev.webviewide.project

import java.io.File
import kotlin.io.path.createTempDirectory
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test

class FileHistoryTest {
    @Test fun recordListReadRoundTrip() {
        val base = createTempDirectory("hist").toFile()
        try {
            FileHistory.record(base, "p1", "index.html", "v1", ts = 1000)
            FileHistory.record(base, "p1", "index.html", "v2", ts = 2000)
            val entries = FileHistory.list(base, "p1", "index.html")
            assertEquals(listOf(2000L, 1000L), entries.map { it.ts })
            assertEquals("v1", FileHistory.read(base, "p1", "index.html", 1000))
            assertEquals("v2", FileHistory.read(base, "p1", "index.html", 2000))
            assertNull(FileHistory.read(base, "p1", "index.html", 9999))
        } finally {
            base.deleteRecursively()
        }
    }

    @Test fun identicalSaveIsSkipped() {
        val base = createTempDirectory("hist2").toFile()
        try {
            FileHistory.record(base, "p1", "a.css", "same", ts = 1000)
            FileHistory.record(base, "p1", "a.css", "same", ts = 2000)
            assertEquals(1, FileHistory.list(base, "p1", "a.css").size)
        } finally {
            base.deleteRecursively()
        }
    }

    @Test fun rollingCapPrunesOldSnapshots() {
        val base = createTempDirectory("hist3").toFile()
        try {
            for (i in 1..(FileHistory.MAX_VERSIONS + 5)) {
                FileHistory.record(base, "p1", "a.js", "v$i", ts = i.toLong())
            }
            val entries = FileHistory.list(base, "p1", "a.js")
            assertEquals(FileHistory.MAX_VERSIONS, entries.size)
            assertEquals((FileHistory.MAX_VERSIONS + 5).toLong(), entries.first().ts)
            // Oldest snapshot file must be pruned from disk.
            assertNull(FileHistory.read(base, "p1", "a.js", 1))
            val dir = File(base, "history/p1/${FileHistory.hashPath("a.js")}")
            val snapFiles = dir.listFiles()?.filter { it.name.toLongOrNull() != null }.orEmpty()
            assertEquals(FileHistory.MAX_VERSIONS, snapFiles.size)
        } finally {
            base.deleteRecursively()
        }
    }

    @Test fun filesAreIsolatedByPathAndProject() {
        val base = createTempDirectory("hist4").toFile()
        try {
            FileHistory.record(base, "p1", "a.js", "a", ts = 1)
            FileHistory.record(base, "p1", "b.js", "b", ts = 1)
            FileHistory.record(base, "p2", "a.js", "c", ts = 1)
            assertEquals("a", FileHistory.read(base, "p1", "a.js", 1))
            assertEquals("b", FileHistory.read(base, "p1", "b.js", 1))
            assertEquals("c", FileHistory.read(base, "p2", "a.js", 1))
            assertTrue(FileHistory.list(base, "p1", "missing.js").isEmpty())
        } finally {
            base.deleteRecursively()
        }
    }

    @Test fun sessionWiresHistoryAndRollback() {
        val s = File("src/main/java/dev/webviewide/ui/IdeSession.kt").readText()
        assertTrue(s.contains("FileHistory.record(app.filesDir, open.id, rel, snapshot)"))
        assertTrue(s.contains("fun historyEntries()"))
        assertTrue(s.contains("fun rollback(ts: Long)"))
        val screen = File("src/main/java/dev/webviewide/ui/IdeScreen.kt").readText()
        assertTrue(screen.contains("Panel.HISTORY -> HistorySheet("))
        assertTrue(screen.contains("session.rollback(ts)"))
    }
}
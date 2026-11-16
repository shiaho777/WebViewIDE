package dev.webviewide.project

import java.io.File
import kotlin.io.path.createTempDirectory
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test

class DraftJournalTest {
    @Test fun journalRoundTripAndClear() {
        val dir = createTempDirectory("journal").toFile()
        try {
            val journal = DraftJournal(File(dir, "j.txt"))
            assertNull(journal.recover())
            val target = File(dir, "src/index.html")
            journal.record(target, "<h1>未保存</h1>\n第二行", 42)
            val entry = journal.recover()
            assertEquals(target.absolutePath, entry?.target?.absolutePath)
            assertEquals(42L, entry?.version)
            assertEquals("<h1>未保存</h1>\n第二行", entry?.text)
            journal.clear()
            assertNull(journal.recover())
        } finally {
            dir.deleteRecursively()
        }
    }

    @Test fun corruptJournalIsIgnored() {
        val dir = createTempDirectory("journal-bad").toFile()
        try {
            val file = File(dir, "j.txt")
            val journal = DraftJournal(file)
            file.writeText("garbage")
            assertNull(journal.recover())
            file.writeText("/path\nnotanumber\ntext")
            assertNull(journal.recover())
        } finally {
            dir.deleteRecursively()
        }
    }

    @Test fun externalChangeBlocksClobberButNotFreshFiles() {
        val dir = createTempDirectory("guard").toFile()
        try {
            val file = File(dir, "a.js")
            file.writeText("original")
            val saver = DraftSaver()
            saver.noteDiskState(file)
            // Simulate an external edit.
            Thread.sleep(20)
            file.writeText("changed outside")
            file.setLastModified(System.currentTimeMillis() + 5000)
            val blocked = runCatching { saver.save(file, "editor draft", 1) }
            assertTrue(blocked.exceptionOrNull() is ExternalChangeException)
            assertEquals("changed outside", file.readText())
            // Re-opening (noting the new disk state) allows saving again.
            saver.noteDiskState(file)
            assertTrue(saver.save(file, "editor draft", 1))
            assertEquals("editor draft", file.readText())
            // Empty/new files are never blocked.
            val fresh = File(dir, "new.js")
            saver.noteDiskState(fresh)
            fresh.writeText("created elsewhere")
            assertTrue(saver.save(fresh, "mine", 2))
        } finally {
            dir.deleteRecursively()
        }
    }

    @Test fun normalSaveUpdatesGuard() {
        val dir = createTempDirectory("guard-normal").toFile()
        try {
            val file = File(dir, "b.js")
            val saver = DraftSaver()
            assertTrue(saver.save(file, "v1", 1))
            assertTrue(saver.save(file, "v2", 2))
            assertEquals("v2", file.readText())
            assertFalse(saver.isSaved(3))
        } finally {
            dir.deleteRecursively()
        }
    }
}
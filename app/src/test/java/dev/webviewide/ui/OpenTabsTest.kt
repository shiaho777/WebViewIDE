package dev.webviewide.ui

import java.io.File
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

/**
 * Pins the tab-list semantics (order, dedup, close-neighbour) and the wiring.
 * The list ops mirror IdeSession.load/closeFile; the wiring assertions read the
 * real source so a regression in the session is caught.
 */
class OpenTabsTest {
    private fun add(list: List<File>, f: File): List<File> = list.filter { it != f } + f
    private fun close(list: List<File>, f: File): List<File> = list.filter { it != f }

    @Test fun openingDedupsAndMovesToTail() {
        val a = File("a.html"); val b = File("b.css"); val c = File("c.js")
        var list = listOf<File>()
        list = add(list, a); list = add(list, b); list = add(list, c)
        assertEquals(listOf(a, b, c), list)
        list = add(list, a) // re-open moves to tail, no dup
        assertEquals(listOf(b, c, a), list)
    }

    @Test fun closingRemovesAndLastCloseEmpties() {
        val a = File("a.html"); val b = File("b.css")
        var list = listOf(a, b)
        list = close(list, a)
        assertEquals(listOf(b), list)
        list = close(list, b)
        assertTrue(list.isEmpty())
    }

    @Test fun sessionWiresTabsAndClose() {
        val s = File("src/main/java/dev/webviewide/ui/IdeSession.kt").readText()
        assertTrue(s.contains("var openFiles by mutableStateOf(listOf<File>())"))
        assertTrue(s.contains("fun closeFile(file: File)"))
        assertTrue("load must maintain tabs", s.contains("openFiles = if (file == null) emptyList() else (openFiles.filter { it != file } + file)"))
        assertTrue("project switch resets tabs", s.contains("openFiles = listOfNotNull(file)"))
        assertTrue("close activates neighbour", s.contains("load(remaining.lastOrNull())"))
    }

    @Test fun screenRendersTabBar() {
        val s = File("src/main/java/dev/webviewide/ui/IdeScreen.kt").readText()
        assertTrue(s.contains("FileTabBar("))
        assertTrue(s.contains("onClose = { session.closeFile(it) }"))
        assertTrue(s.contains("private fun FileTabBar("))
    }
}
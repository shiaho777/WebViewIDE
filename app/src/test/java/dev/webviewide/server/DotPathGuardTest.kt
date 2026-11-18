package dev.webviewide.server

import java.io.File
import kotlin.io.path.createTempDirectory
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class DotPathGuardTest {
    @Test fun dotSegmentsAreNeverServed() {
        val root = createTempDirectory("dot-guard").toFile()
        try {
            File(root, "index.html").writeText("<html>ok</html>")
            File(root, ".git").mkdirs()
            File(root, ".git/config").writeText("[core]\n\trepositoryformatversion = 0\n")
            File(root, ".env").writeText("SECRET=1")
            File(root, "sub").mkdirs()
            File(root, "sub/.hidden.txt").writeText("h")

            for (path in listOf("/.git/config", "/.env", "/sub/.hidden.txt", "/.git/")) {
                val hit = SiteFiles.resolve(root, path, false, "index.html", "")
                assertTrue("expected 404 for $path", hit is SiteHit.Error)
                assertEquals(404, (hit as SiteHit.Error).code)
            }
            // Encoded dot segments must not slip through either.
            val encoded = SiteFiles.resolve(root, "/%2egit/config", false, "index.html", "")
            assertTrue(encoded is SiteHit.Error)
            // Regular files still resolve.
            assertTrue(SiteFiles.resolve(root, "/index.html", false, "index.html", "") is SiteHit.FileHit)
        } finally {
            root.deleteRecursively()
        }
    }
}
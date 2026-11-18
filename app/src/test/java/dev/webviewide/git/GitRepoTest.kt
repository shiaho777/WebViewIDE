package dev.webviewide.git

import java.io.File
import kotlin.io.path.createTempDirectory
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test

class GitRepoTest {
    @Before fun env() {
        GitEnv.init(createTempDirectory("git-home").toFile())
    }

    @Test fun initStatusCommitRoundTrip() {
        val src = createTempDirectory("git-src").toFile()
        try {
            val repo = GitRepo(src)
            assertFalse(repo.exists())
            repo.init()
            assertTrue(repo.exists())
            assertTrue(File(src, ".git").isDirectory)
            repo.init() // idempotent

            // Fresh repos ignore reinstallable dependency output by default.
            assertEquals("node_modules/\n.DS_Store\n", File(src, ".gitignore").readText())
            File(src, "node_modules/lib").mkdirs()
            File(src, "node_modules/lib/x.js").writeText("dep")

            File(src, "index.html").writeText("<html>a</html>")
            File(src, "main.js").writeText("console.log(1)")
            val before = repo.status()
            assertEquals(3, before.size) // two sources + .gitignore itself
            assertTrue(before.none { it.path.startsWith("node_modules/") })
            assertTrue(before.filter { it.path != ".gitignore" }.all { it.kind == GitRepo.Change.Kind.UNTRACKED })

            val hash = repo.commit("first")
            assertEquals(7, hash.length)
            assertTrue(repo.status().isEmpty())

            File(src, "index.html").writeText("<html>b</html>")
            File(src, "styles.css").writeText("body{}")
            File(src, "main.js").delete()
            val after = repo.status()
            assertEquals(3, after.size)
            assertEquals(GitRepo.Change.Kind.MODIFIED, after.first { it.path == "index.html" }.kind)
            assertEquals(GitRepo.Change.Kind.UNTRACKED, after.first { it.path == "styles.css" }.kind)
            assertEquals(GitRepo.Change.Kind.REMOVED, after.first { it.path == "main.js" }.kind)

            repo.commit("second")
            assertTrue(repo.status().isEmpty())
        } finally {
            src.deleteRecursively()
        }
    }

    @Test fun commitUsesLocalIdentityWithoutGlobalConfig() {
        val src = createTempDirectory("git-id").toFile()
        try {
            val repo = GitRepo(src)
            repo.init()
            File(src, "a.txt").writeText("x")
            repo.commit("identity")
            org.eclipse.jgit.api.Git.open(src).use { git ->
                val head = git.log().setMaxCount(1).call().first()
                assertEquals("WebViewIDE", head.authorIdent.name)
            }
        } finally {
            src.deleteRecursively()
        }
    }

    @Test fun sessionWiresGitOnIoWithFlush() {
        val session = File("src/main/java/dev/webviewide/ui/IdeSession.kt").readText()
        assertTrue(session.contains("fun gitInit()"))
        assertTrue(session.contains("fun gitCommit(message: String)"))
        assertTrue(session.contains("fun refreshGit()"))
        assertTrue(session.contains("GitEnv.init(app.filesDir)"))
        // Commit must persist the pending draft first.
        val commitBody = session.substringAfter("fun gitCommit(message: String)").substringBefore("fun runPreview")
        assertTrue(commitBody.contains("flushBlocking()"))
        assertTrue(commitBody.contains("withContext(Dispatchers.IO)"))
    }

    @Test fun screenMountsGitPanel() {
        val screen = File("src/main/java/dev/webviewide/ui/IdeScreen.kt").readText()
        assertTrue(screen.contains("Panel.GIT -> GitSheet("))
        assertTrue(screen.contains("panel = Panel.GIT"))
        val sheet = File("src/main/java/dev/webviewide/ui/GitSheet.kt").readText()
        assertTrue(sheet.contains("初始化仓库"))
        assertTrue(sheet.contains("提交说明"))
    }
}
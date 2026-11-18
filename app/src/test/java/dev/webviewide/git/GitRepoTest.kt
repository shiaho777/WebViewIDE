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

    @Test fun branchCreateCheckoutAndFfMerge() {
        val src = createTempDirectory("git-branch").toFile()
        try {
            val repo = GitRepo(src)
            repo.init()
            File(src, "a.txt").writeText("base")
            repo.commit("base")
            assertEquals(listOf("main"), repo.branches().map { it.name })
            assertTrue(repo.branches().single().current)

            repo.createBranch("feature")
            assertEquals(listOf("main", "feature"), repo.branches().map { it.name })
            repo.checkout("feature")
            assertTrue(repo.branches().first { it.name == "feature" }.current)
            File(src, "a.txt").writeText("feature-work")
            repo.commit("feat")

            // main is behind feature -> ff merge succeeds.
            repo.checkout("main")
            assertEquals("base", File(src, "a.txt").readText())
            val msg = repo.merge("feature")
            assertTrue(msg.contains("feature"))
            assertEquals("feature-work", File(src, "a.txt").readText())

            // Diverged merge must fail clearly (no auto-merge).
            repo.createBranch("other")
            repo.checkout("other")
            File(src, "a.txt").writeText("other-work")
            repo.commit("other")
            repo.checkout("main")
            File(src, "a.txt").writeText("main-work")
            repo.commit("main2")
            try {
                repo.merge("other")
                org.junit.Assert.fail("diverged merge must not succeed")
            } catch (e: IllegalStateException) {
                assertTrue(e.message!!.contains("分叉"))
            }
        } finally {
            src.deleteRecursively()
        }
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

    @Test fun logDiffRestoreRoundTrip() {
        val src = createTempDirectory("git-hist").toFile()
        try {
            val repo = GitRepo(src)
            repo.init()
            assertTrue(repo.log().isEmpty()) // no commits yet
            File(src, "a.txt").writeText("v1\n")
            val h1 = repo.commit("one")
            File(src, "a.txt").writeText("v2\n")
            val h2 = repo.commit("two")

            val log = repo.log()
            assertEquals(listOf(h2, h1), log.map { it.hash })
            assertEquals("two", log.first().message)
            assertTrue(log.first().time > 0)

            File(src, "a.txt").writeText("v3\n")
            val diff = repo.diff("a.txt")
            assertTrue(diff.contains("-v2"))
            assertTrue(diff.contains("+v3"))
            // Untracked file renders as all-added.
            File(src, "new.txt").writeText("hello\n")
            assertTrue(repo.diff("new.txt").contains("+hello"))
            assertEquals("", repo.diff("missing.txt"))

            repo.restore("a.txt")
            assertEquals("v2\n", File(src, "a.txt").readText())
            assertTrue(repo.status().none { it.path == "a.txt" })
            // Restore leaves other files alone.
            assertEquals("hello\n", File(src, "new.txt").readText())
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
        // Same-key AnimatedContent swaps stack old+new editor and blank the
        // fresh WebView; docEpoch must participate in the contentKey.
        assertTrue(screen.contains("contentKey = { it?.path + \"#\" + session.docEpoch }"))
        val sheet = File("src/main/java/dev/webviewide/ui/GitSheet.kt").readText()
        assertTrue(sheet.contains("初始化仓库"))
        assertTrue(sheet.contains("提交说明"))
        assertTrue(sheet.contains("提交历史"))
        assertTrue(sheet.contains("恢复这个文件？"))
    }

    @Test fun restoreRemountsEditorAndReloadsPreview() {
        val session = File("src/main/java/dev/webviewide/ui/IdeSession.kt").readText()
        val body = session.substringAfter("fun gitRestore(path: String)").substringBefore("fun runPreview")
        assertTrue(body.contains("flushBlocking()"))
        assertTrue(body.contains("docEpoch += 1"))
        assertTrue(body.contains("saver.discardThrough(version)"))
        assertTrue(body.contains("server.reload"))
        assertTrue(session.contains("fun showGitDiff(path: String)"))
    }

    @Test fun branchOpsGuardDirtyWorktreeAndResync() {
        val session = File("src/main/java/dev/webviewide/ui/IdeSession.kt").readText()
        assertTrue(session.contains("fun gitCheckout(name: String)"))
        assertTrue(session.contains("fun gitMerge(name: String)"))
        assertTrue(session.contains("fun gitCreateBranch(name: String)"))
        val checkout = session.substringAfter("fun gitCheckout(name: String)").substringBefore("fun gitMerge")
        assertTrue(checkout.contains("flushBlocking()"))
        assertTrue(checkout.contains("先提交或恢复后再切换分支"))
        assertTrue(checkout.contains("resyncAfterWorktreeChange"))
        val sheet = File("src/main/java/dev/webviewide/ui/GitSheet.kt").readText()
        assertTrue(sheet.contains("新分支名"))
        assertTrue(sheet.contains("合并 "))
        val screen = File("src/main/java/dev/webviewide/ui/IdeScreen.kt").readText()
        assertTrue(screen.contains("onBranchCheckout = session::gitCheckout"))
    }
}
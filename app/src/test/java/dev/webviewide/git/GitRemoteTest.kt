package dev.webviewide.git

import java.io.File
import kotlin.io.path.createTempDirectory
import org.eclipse.jgit.api.Git
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Assert.fail
import org.junit.Before
import org.junit.Test

class GitRemoteTest {
    @Before fun env() {
        GitEnv.init(createTempDirectory("git-home").toFile())
    }

    private fun bare(): File {
        val dir = createTempDirectory("git-bare").toFile()
        Git.init().setBare(true).setDirectory(dir).setInitialBranch("main").call().close()
        return dir
    }

    /** A seeded origin: init a work repo, commit, push main into the bare repo. */
    private fun seededOrigin(origin: File, seed: File, text: String, msg: String): GitRepo {
        val repo = GitRepo(seed)
        repo.init()
        File(seed, "f.txt").writeText(text)
        repo.commit(msg)
        repo.setRemote(origin.toURI().toString())
        repo.push(null)
        return repo
    }

    @Test fun clonePushPullRoundTrip() {
        val origin = bare()
        val workA = createTempDirectory("git-a").toFile()
        val workB = createTempDirectory("git-b").toFile()
        try {
            val a = seededOrigin(origin, workA, "v1", "one")

            // Second clone sees the pushed commit.
            GitRepo.clone(origin.toURI().toString(), workB, null)
            assertEquals("v1", File(workB, "f.txt").readText())
            val b = GitRepo(workB)
            assertEquals("one", b.log().first().message)

            // A pushes a second commit; B pulls it fast-forward.
            File(workA, "f.txt").writeText("v2")
            a.commit("two")
            a.push(null)
            b.pull(null)
            assertEquals("v2", File(workB, "f.txt").readText())
            assertEquals("two", b.log().first().message)
            // Clone normalizes file URIs; just check it points at the origin dir.
            assertTrue(b.remoteUrl()!!.contains(origin.name))
        } finally {
            origin.deleteRecursively(); workA.deleteRecursively(); workB.deleteRecursively()
        }
    }

    @Test fun divergedPullFailsClearly() {
        val origin = bare()
        val workA = createTempDirectory("git-da").toFile()
        val workB = createTempDirectory("git-db").toFile()
        try {
            val a = seededOrigin(origin, workA, "base", "base")
            GitRepo.clone(origin.toURI().toString(), workB, null)
            val b = GitRepo(workB)
            // Both sides commit independently -> diverged.
            File(workA, "f.txt").writeText("a-side")
            a.commit("a")
            a.push(null)
            File(workB, "f.txt").writeText("b-side")
            b.commit("b")
            try {
                b.pull(null)
                fail("diverged pull must not succeed")
            } catch (e: IllegalStateException) {
                assertTrue(e.message!!.contains("分叉"))
            }
        } finally {
            origin.deleteRecursively(); workA.deleteRecursively(); workB.deleteRecursively()
        }
    }

    @Test fun setRemoteAndProviderWiring() {
        val src = createTempDirectory("git-remote-set").toFile()
        try {
            val repo = GitRepo(src)
            repo.init()
            assertEquals(null, repo.remoteUrl())
            repo.setRemote("https://gitee.com/u/r.git")
            assertEquals("https://gitee.com/u/r.git", repo.remoteUrl())
            val cred = CredentialStore.Credential("gitee.com", "u", "t")
            assertTrue(GitRepo.provider(cred) is org.eclipse.jgit.transport.UsernamePasswordCredentialsProvider)
            assertEquals(null, GitRepo.provider(null))
        } finally {
            src.deleteRecursively()
        }
    }

    @Test fun uiWiresRemoteOps() {
        val session = File("src/main/java/dev/webviewide/ui/IdeSession.kt").readText()
        assertTrue(session.contains("fun gitClone(url: String, name: String)"))
        assertTrue(session.contains("fun gitPush()"))
        assertTrue(session.contains("fun gitPull()"))
        assertTrue(session.contains("ProjectStore.cloneProject"))
        val sheet = File("src/main/java/dev/webviewide/ui/GitSheet.kt").readText()
        assertTrue(sheet.contains("远程同步"))
        assertTrue(sheet.contains("推送"))
        assertTrue(sheet.contains("拉取"))
        val panels = File("src/main/java/dev/webviewide/ui/IdePanels.kt").readText()
        assertTrue(panels.contains("从 Git 克隆"))
        val welcome = File("src/main/java/dev/webviewide/ui/Welcome.kt").readText()
        assertTrue(welcome.contains("从 Git 克隆已有仓库"))
    }
}
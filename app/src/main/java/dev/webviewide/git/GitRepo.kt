package dev.webviewide.git

import java.io.File
import org.eclipse.jgit.api.Git
import org.eclipse.jgit.lib.Repository
import org.eclipse.jgit.storage.file.FileRepositoryBuilder

/** One project's repository; the work tree is the project's src/ directory. */
class GitRepo(private val src: File) {
    data class Change(val path: String, val kind: Kind) {
        enum class Kind { ADDED, MODIFIED, REMOVED, UNTRACKED, CONFLICT }
    }

    fun exists(): Boolean = File(src, ".git").exists()

    private fun open(): Repository =
        FileRepositoryBuilder().setGitDir(File(src, ".git")).setWorkTree(src).readEnvironment().build()

    private fun <T> use(block: (Git) -> T): T = open().use { repo -> Git(repo).use(block) }

    /** Creates the repository if missing; safe to call repeatedly. */
    fun init() {
        if (exists()) return
        Git.init().setDirectory(src).setInitialBranch("main").call().use { git ->
            GitEnv.tune(git.repository)
        }
        val ignore = File(src, ".gitignore")
        if (!ignore.exists()) ignore.writeText("node_modules/\n.DS_Store\n")
    }

    /** Working-tree changes vs HEAD, stable order. JGit splits staged (changed/removed)
     *  from unstaged (modified/missing); both belong in the panel. */
    fun status(): List<Change> = use { git ->
        val st = git.status().call()
        val kinds = LinkedHashMap<String, Change.Kind>()
        st.conflicting.forEach { kinds[it] = Change.Kind.CONFLICT }
        st.added.forEach { kinds.putIfAbsent(it, Change.Kind.ADDED) }
        (st.changed + st.modified).forEach { kinds.putIfAbsent(it, Change.Kind.MODIFIED) }
        (st.removed + st.missing).forEach { kinds.putIfAbsent(it, Change.Kind.REMOVED) }
        st.untracked.forEach { kinds.putIfAbsent(it, Change.Kind.UNTRACKED) }
        kinds.entries.sortedBy { it.key }.map { Change(it.key, it.value) }
    }

    /** Stages everything (including deletions) and commits; returns the short hash. */
    fun commit(message: String): String = use { git ->
        git.add().addFilepattern(".").call()
        git.add().addFilepattern(".").setUpdate(true).call()
        val id = git.commit().setMessage(message).call()
        id.name.take(7)
    }
}
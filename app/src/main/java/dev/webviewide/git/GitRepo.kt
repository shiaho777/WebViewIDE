package dev.webviewide.git

import java.io.ByteArrayOutputStream
import java.io.File
import org.eclipse.jgit.api.Git
import org.eclipse.jgit.api.MergeResult
import org.eclipse.jgit.diff.DiffFormatter
import org.eclipse.jgit.lib.Repository
import org.eclipse.jgit.storage.file.FileRepositoryBuilder
import org.eclipse.jgit.transport.CredentialsProvider
import org.eclipse.jgit.transport.UsernamePasswordCredentialsProvider
import org.eclipse.jgit.treewalk.CanonicalTreeParser
import org.eclipse.jgit.treewalk.FileTreeIterator

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

    data class CommitInfo(val hash: String, val message: String, val time: Long)

    /** Newest-first commit list; empty when the repo has no commits yet. */
    fun log(limit: Int = 50): List<CommitInfo> = use { git ->
        if (git.repository.resolve("HEAD") == null) return@use emptyList()
        git.log().setMaxCount(limit).call().map {
            CommitInfo(it.name.take(7), it.shortMessage, it.commitTime * 1000L)
        }
    }

    /** Working tree vs HEAD for one path; untracked files render as all-added. */
    fun diff(path: String): String = use { git ->
        val out = ByteArrayOutputStream()
        DiffFormatter(out).use { fmt ->
            fmt.setRepository(git.repository)
            val head = git.repository.resolve("HEAD^{tree}")
            val old = if (head == null) org.eclipse.jgit.treewalk.EmptyTreeIterator()
            else git.repository.newObjectReader().use { CanonicalTreeParser().apply { reset(it, head) } }
            val entries = fmt.scan(old, FileTreeIterator(git.repository))
            val entry = entries.firstOrNull { it.newPath == path || it.oldPath == path }
                ?: return@use ""
            fmt.format(entry)
        }
        out.toString(Charsets.UTF_8.name())
    }

    /** Restores one file to its HEAD content (discards working-tree edits). */
    fun restore(path: String) {
        use { git ->
            git.checkout().addPath(path).setStartPoint("HEAD").call()
        }
    }

    /** The origin URL, or null when no remote is configured. */
    fun remoteUrl(): String? = use { git ->
        git.repository.config.getString("remote", "origin", "url")?.takeIf { it.isNotBlank() }
    }

    /** Points origin at [url] (creates the remote section when missing). */
    fun setRemote(url: String) {
        use { git ->
            val config = git.repository.config
            config.setString("remote", "origin", "url", url)
            config.setString("remote", "origin", "fetch", "+refs/heads/*:refs/remotes/origin/*")
            config.save()
        }
    }

    /** Pushes the current branch to origin. */
    fun push(provider: CredentialsProvider?): String = use { git ->
        val branch = git.repository.branch
        val cmd = git.push().setRemote("origin").add(branch)
        if (provider != null) cmd.setCredentialsProvider(provider)
        val results = cmd.call()
        val rejected = results.flatMap { it.remoteUpdates }
            .filter { it.status.name.startsWith("REJECTED") }
        if (rejected.isNotEmpty()) {
            error("推送被拒绝：${rejected.first().message ?: "远端有更新的提交，先拉取"}")
        }
        "已推送 $branch 到远端"
    }

    /** Fast-forward-only pull; diverged histories report a clear error. */
    fun pull(provider: CredentialsProvider?): String = use { git ->
        val cmd = git.pull().setRemote("origin").setRemoteBranchName(git.repository.branch)
            .setFastForward(org.eclipse.jgit.api.MergeCommand.FastForwardMode.FF_ONLY)
        if (provider != null) cmd.setCredentialsProvider(provider)
        val result = cmd.call()
        if (!result.isSuccessful) {
            error("拉取失败：本地与远端有分叉或冲突，先提交本地改动再处理")
        }
        "已拉取远端更新"
    }

    companion object {
        fun provider(cred: CredentialStore.Credential?): CredentialsProvider? =
            cred?.let { UsernamePasswordCredentialsProvider(it.user, it.token) }

        /** Clones [url] into [dest] (which must not exist yet). */
        fun clone(url: String, dest: File, provider: CredentialsProvider?) {
            val cmd = Git.cloneRepository().setURI(url).setDirectory(dest)
            if (provider != null) cmd.setCredentialsProvider(provider)
            cmd.call().use { git -> GitEnv.tune(git.repository) }
        }
    }
}
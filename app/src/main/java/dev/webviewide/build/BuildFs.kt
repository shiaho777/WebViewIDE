package dev.webviewide.build

import dev.webviewide.project.ProjectStore
import dev.webviewide.server.SiteFiles
import java.io.File

/**
 * Persists the build runtime's memfs into the real project directory. Writes are
 * confined to [root] (the project srcDir): traversal is rejected, text goes
 * through ProjectStore.write (atomic), binary uses an atomic tmp+rename.
 * node_modules is written here then evicted from JS memory; listUnder already
 * skips it so it never enters the packaged APK.
 */
object BuildFs {
    /** Resolves a relative path inside root, or null if it escapes / is invalid. */
    fun resolve(root: File, relPath: String): File? {
        val normalized = SiteFiles.normalize(relPath) ?: return null
        if (normalized.isEmpty()) return null
        val target = File(root, normalized)
        return if (SiteFiles.isInside(root, target)) target else null
    }

    fun writeText(root: File, relPath: String, text: String): Boolean {
        val target = resolve(root, relPath) ?: return false
        return runCatching { ProjectStore.write(target, text) }.isSuccess
    }

    fun writeBytes(root: File, relPath: String, bytes: ByteArray): Boolean {
        val target = resolve(root, relPath) ?: return false
        return runCatching {
            target.parentFile?.mkdirs()
            val tmp = File(target.parentFile, ".${target.name}.tmp")
            tmp.writeBytes(bytes)
            if (!tmp.renameTo(target)) {
                tmp.copyTo(target, overwrite = true)
                tmp.delete()
            }
        }.isSuccess
    }

    fun readText(root: File, relPath: String): String? {
        val target = resolve(root, relPath) ?: return null
        return if (target.isFile) runCatching { target.readText() }.getOrNull() else null
    }

    fun exists(root: File, relPath: String): Boolean {
        val target = resolve(root, relPath) ?: return false
        return target.isFile
    }
}
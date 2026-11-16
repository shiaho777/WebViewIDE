package dev.webviewide.project

import java.io.File

class ExternalChangeException(message: String) : IllegalStateException(message)

class DraftSaver(
    private val write: (File, String) -> Unit = ProjectStore::write,
) {
    private val lock = Any()
    private var saved = 0L
    private var guardFile: File? = null
    private var guardMtime = 0L
    private var guardSize = -1L

    fun save(file: File, text: String, version: Long): Boolean {
        synchronized(lock) {
            if (version <= saved) return false
            // External-change guard: if the file changed on disk since our
            // last write/load and there is no unsaved draft protecting it,
            // refuse to clobber the external edit.
            val guarded = guardFile
            if (guarded != null && guarded.path == file.path && file.isFile && guardSize > 0 &&
                (file.lastModified() != guardMtime || file.length() != guardSize)
            ) {
                throw ExternalChangeException("文件在编辑器外被改过，已停下避免覆盖。重新打开该文件即可加载最新内容。")
            }
            write(file, text)
            saved = version
            noteDiskState(file)
            return true
        }
    }

    /** Records the on-disk state we consider authoritative (after load/save). */
    fun noteDiskState(file: File) {
        synchronized(lock) {
            guardFile = file
            guardMtime = if (file.isFile) file.lastModified() else 0L
            guardSize = if (file.isFile) file.length() else -1L
        }
    }

    fun discardThrough(version: Long) {
        synchronized(lock) {
            if (version > saved) saved = version
        }
    }

    fun isSaved(version: Long): Boolean = synchronized(lock) { version <= saved }
}

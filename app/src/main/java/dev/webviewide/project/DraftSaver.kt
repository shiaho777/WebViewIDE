package dev.webviewide.project

import java.io.File

class DraftSaver(
    private val write: (File, String) -> Unit = ProjectStore::write,
) {
    private val lock = Any()
    private var saved = 0L

    fun save(file: File, text: String, version: Long): Boolean {
        synchronized(lock) {
            if (version <= saved) return false
            write(file, text)
            saved = version
            return true
        }
    }

    fun discardThrough(version: Long) {
        synchronized(lock) {
            if (version > saved) saved = version
        }
    }

    fun isSaved(version: Long): Boolean = synchronized(lock) { version <= saved }
}

package dev.webviewide.project

import java.io.File

/**
 * Write-ahead journal for the debounced editor save. The full draft is
 * written here synchronously on every edit; the real file write happens
 * 350ms later. If the process dies in between, [recover] replays the
 * journal on next open so no typing is lost.
 *
 * Format: line 1 = absolute target path, line 2 = version, rest = text.
 */
class DraftJournal(private val file: File) {
    data class Entry(val target: File, val version: Long, val text: String)

    fun record(target: File, text: String, version: Long) {
        runCatching {
            file.parentFile?.mkdirs()
            val tmp = File(file.parentFile, ".${file.name}.tmp")
            tmp.writeText("${target.absolutePath}\n$version\n$text")
            if (!tmp.renameTo(file)) {
                tmp.copyTo(file, overwrite = true)
                tmp.delete()
            }
        }
    }

    fun clear() {
        runCatching { file.delete() }
    }

    fun recover(): Entry? {
        if (!file.isFile) return null
        return runCatching {
            val raw = file.readText()
            val firstBreak = raw.indexOf('\n')
            val secondBreak = raw.indexOf('\n', firstBreak + 1)
            if (firstBreak <= 0 || secondBreak < 0) return null
            val target = File(raw.substring(0, firstBreak))
            val version = raw.substring(firstBreak + 1, secondBreak).toLongOrNull() ?: return null
            Entry(target, version, raw.substring(secondBreak + 1))
        }.getOrNull()
    }
}
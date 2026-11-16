package dev.webviewide.project

import java.io.File
import java.io.OutputStream
import java.util.zip.ZipEntry
import java.util.zip.ZipOutputStream

/**
 * Writes a project's source tree into a zip with paths relative to the project
 * root, so the archive can be re-imported anywhere. Pure java.io/zip so it is
 * unit-testable without an Android runtime.
 */
object ProjectZip {
    /** Entry names must be relative, normalised and free of traversal. */
    fun entryName(root: File, file: File): String {
        val rel = file.toRelativeString(root).replace(File.separatorChar, '/')
        require(!rel.startsWith("/") && !rel.split('/').contains("..")) {
            "refusing to archive a path outside the project: $rel"
        }
        return rel
    }

    fun write(root: File, files: List<File>, out: OutputStream) {
        ZipOutputStream(out).use { zip ->
            files.filter { it.isFile }.sortedBy { it.path }.forEach { f ->
                zip.putNextEntry(ZipEntry(entryName(root, f)))
                f.inputStream().use { it.copyTo(zip) }
                zip.closeEntry()
            }
        }
    }
}
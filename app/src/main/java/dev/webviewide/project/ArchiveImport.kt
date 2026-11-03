package dev.webviewide.project

import java.io.File
import java.io.InputStream
import java.util.zip.ZipInputStream

class ImportLimitException(message: String) : IllegalStateException(message)

object ArchiveImport {
    const val MAX_FILES = 8000
    const val MAX_BYTES = 200L * 1024 * 1024

    val skipDirs = setOf(
        "node_modules",
        ".git",
        ".svn",
        ".hg",
        ".gradle",
        ".idea",
        ".cache",
        "coverage",
        ".next",
        ".nuxt",
        ".turbo",
        ".parcel-cache",
        "__MACOSX",
    )

    fun shouldSkipDir(name: String): Boolean = name in skipDirs || name == ".DS_Store"

    fun unzip(stream: InputStream, dest: File): Int {
        dest.mkdirs()
        var files = 0
        var bytes = 0L
        ZipInputStream(stream).use { zip ->
            while (true) {
                val entry = zip.nextEntry ?: break
                val name = entry.name.replace('\\', '/')
                if (name.isBlank() || name.endsWith("/")) {
                    zip.closeEntry()
                    continue
                }
                val parts = name.split('/').filter { it.isNotEmpty() && it != "." }
                if (parts.any { it == ".." }) throw ImportLimitException("压缩包里有不安全的路径")
                if (parts.any { shouldSkipDir(it) }) {
                    zip.closeEntry()
                    continue
                }
                files++
                if (files > MAX_FILES) throw ImportLimitException("文件太多，超过 $MAX_FILES 个")
                val target = parts.fold(dest) { parent, part -> File(parent, part) }
                target.parentFile?.mkdirs()
                target.outputStream().use { out ->
                    val buffer = ByteArray(8192)
                    while (true) {
                        val n = zip.read(buffer)
                        if (n < 0) break
                        bytes += n
                        if (bytes > MAX_BYTES) throw ImportLimitException("体积太大，超过 200 MB")
                        out.write(buffer, 0, n)
                    }
                }
                zip.closeEntry()
            }
        }
        unwrapSingleRoot(dest)
        return files
    }

    fun unwrapSingleRoot(dest: File) {
        val kids = dest.listFiles()?.filter { it.name != ".DS_Store" }.orEmpty()
        if (kids.size != 1 || !kids[0].isDirectory) return
        val inner = kids[0]
        if (shouldSkipDir(inner.name)) return
        inner.listFiles()?.forEach { child ->
            val target = File(dest, child.name)
            if (!child.renameTo(target)) child.copyRecursively(target, overwrite = true)
        }
        inner.deleteRecursively()
    }

    fun copyTree(from: File, dest: File): Int {
        var files = 0
        var bytes = 0L
        fun walk(source: File, target: File) {
            if (source.isDirectory) {
                if (shouldSkipDir(source.name) && source != from) return
                target.mkdirs()
                source.listFiles()?.forEach { child -> walk(child, File(target, child.name)) }
                return
            }
            if (source.name == ".DS_Store" || source.name.startsWith(".")) return
            files++
            if (files > MAX_FILES) throw ImportLimitException("文件太多，超过 $MAX_FILES 个")
            bytes += source.length()
            if (bytes > MAX_BYTES) throw ImportLimitException("体积太大，超过 200 MB")
            target.parentFile?.mkdirs()
            source.copyTo(target, overwrite = true)
        }
        walk(from, dest)
        return files
    }
}

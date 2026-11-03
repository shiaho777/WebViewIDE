package dev.webviewide.project

import android.content.Context
import android.net.Uri
import android.provider.DocumentsContract
import android.provider.OpenableColumns
import java.io.File

object DocumentImport {
    fun displayName(context: Context, uri: Uri): String {
        val columns = arrayOf(OpenableColumns.DISPLAY_NAME, DocumentsContract.Document.COLUMN_DISPLAY_NAME)
        for (column in columns) {
            val name = runCatching {
                context.contentResolver.query(uri, arrayOf(column), null, null, null)?.use { cursor ->
                    if (cursor.moveToFirst()) cursor.getString(0) else null
                }
            }.getOrNull()
            if (!name.isNullOrBlank()) return name
        }
        return uri.lastPathSegment?.substringAfterLast(':')?.substringAfterLast('/') ?: "导入的文件"
    }

    fun importFile(context: Context, uri: Uri): WebProject {
        val name = displayName(context, uri)
        val title = name.substringBeforeLast('.').ifBlank { "导入的文件" }
        return ProjectStore.adopt(context, title) { src ->
            val dest = File(src, safeName(name))
            context.contentResolver.openInputStream(uri)?.use { input ->
                if (name.endsWith(".zip", ignoreCase = true)) {
                    ArchiveImport.unzip(input, src)
                } else {
                    dest.outputStream().use { input.copyTo(it) }
                    wrapLoneFile(src, dest.name)
                }
            } ?: error("没有读到这个文件")
        }
    }

    fun importTree(context: Context, uri: Uri): WebProject {
        val rootId = DocumentsContract.getTreeDocumentId(uri)
        val rootUri = DocumentsContract.buildDocumentUriUsingTree(uri, rootId)
        val title = displayName(context, rootUri).ifBlank { "导入的文件夹" }
        return ProjectStore.adopt(context, title) { src ->
            copyNode(context, uri, rootId, src, intArrayOf(0), longArrayOf(0), isRoot = true)
        }
    }

    fun wrapLoneFile(dir: File, name: String) {
        if (File(dir, "index.html").isFile) return
        val ext = name.substringAfterLast('.', "").lowercase()
        val html = when (ext) {
            "html", "htm" -> return
            "css" -> """
                <!DOCTYPE html>
                <html lang="zh-CN"><head><meta charset="utf-8"><link rel="stylesheet" href="$name"></head>
                <body><p>样式来自 $name</p></body></html>
            """.trimIndent()
            "js", "mjs" -> """
                <!DOCTYPE html>
                <html lang="zh-CN"><head><meta charset="utf-8"></head>
                <body><script src="$name"></script></body></html>
            """.trimIndent()
            "png", "jpg", "jpeg", "gif", "webp", "svg" -> """
                <!DOCTYPE html>
                <html lang="zh-CN"><head><meta charset="utf-8"></head>
                <body><img src="$name" alt=""></body></html>
            """.trimIndent()
            else -> return
        }
        File(dir, "index.html").writeText(html + "\n")
    }

    private fun copyNode(
        context: Context,
        tree: Uri,
        documentId: String,
        dest: File,
        count: IntArray,
        bytes: LongArray,
        isRoot: Boolean,
    ) {
        val docUri = DocumentsContract.buildDocumentUriUsingTree(tree, documentId)
        val name = displayName(context, docUri)
        val mime = mime(context, docUri)
        if (!isRoot && ArchiveImport.shouldSkipDir(name)) return
        if (mime == DocumentsContract.Document.MIME_TYPE_DIR) {
            if (!isRoot) dest.mkdirs()
            val children = DocumentsContract.buildChildDocumentsUriUsingTree(tree, documentId)
            context.contentResolver.query(
                children,
                arrayOf(
                    DocumentsContract.Document.COLUMN_DOCUMENT_ID,
                    DocumentsContract.Document.COLUMN_DISPLAY_NAME,
                ),
                null,
                null,
                null,
            )?.use { cursor ->
                val idCol = cursor.getColumnIndex(DocumentsContract.Document.COLUMN_DOCUMENT_ID)
                val nameCol = cursor.getColumnIndex(DocumentsContract.Document.COLUMN_DISPLAY_NAME)
                while (cursor.moveToNext()) {
                    val childId = cursor.getString(idCol) ?: continue
                    val childName = cursor.getString(nameCol) ?: continue
                    copyNode(context, tree, childId, File(dest, childName), count, bytes, isRoot = false)
                }
            }
            return
        }
        writeFile(context, docUri, dest, name, count, bytes)
    }

    private fun writeFile(
        context: Context,
        uri: Uri,
        dest: File,
        name: String,
        count: IntArray,
        bytes: LongArray,
    ) {
        if (name == ".DS_Store" || name.startsWith(".")) return
        count[0]++
        if (count[0] > ArchiveImport.MAX_FILES) throw ImportLimitException("文件太多，超过 ${ArchiveImport.MAX_FILES} 个")
        dest.parentFile?.mkdirs()
        context.contentResolver.openInputStream(uri)?.use { input ->
            dest.outputStream().use { output ->
                val buffer = ByteArray(8192)
                while (true) {
                    val n = input.read(buffer)
                    if (n < 0) break
                    bytes[0] += n
                    if (bytes[0] > ArchiveImport.MAX_BYTES) throw ImportLimitException("体积太大，超过 200 MB")
                    output.write(buffer, 0, n)
                }
            }
        } ?: error("没有读到 $name")
    }

    private fun mime(context: Context, uri: Uri): String {
        context.contentResolver.query(uri, arrayOf(DocumentsContract.Document.COLUMN_MIME_TYPE), null, null, null)?.use { cursor ->
            if (cursor.moveToFirst()) return cursor.getString(0) ?: ""
        }
        return ""
    }

    private fun safeName(name: String): String {
        val cleaned = name.replace('\\', '/').substringAfterLast('/').replace("..", "")
        return cleaned.ifBlank { "file.txt" }
    }
}

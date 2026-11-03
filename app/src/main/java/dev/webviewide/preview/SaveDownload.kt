package dev.webviewide.preview

import android.content.ContentValues
import android.content.Context
import android.os.Build
import android.os.Environment
import android.provider.MediaStore
import dev.webviewide.server.SiteFiles
import java.io.File
import java.io.InputStream
import java.net.HttpURLConnection
import java.net.URL

object SaveDownload {
    fun save(context: Context, url: String, name: String, mime: String, localRoot: File?) {
        val safeName = name.substringAfterLast('/').ifBlank { "download" }.replace("/", "")
        val path = runCatching { URL(url).path }.getOrNull()
        val local = if (localRoot != null && path != null) {
            val relative = SiteFiles.normalize(path)
            val file = relative?.let { File(localRoot, it) }
            if (file != null && SiteFiles.isInside(localRoot, file) && file.isFile) file else null
        } else {
            null
        }
        if (local != null) {
            local.inputStream().use { write(context, safeName, mime, it) }
            return
        }
        val connection = URL(url).openConnection() as HttpURLConnection
        connection.instanceFollowRedirects = true
        connection.connectTimeout = 15_000
        connection.readTimeout = 30_000
        connection.inputStream.use { write(context, safeName, mime.ifBlank { connection.contentType ?: mime }, it) }
    }

    private fun write(context: Context, name: String, mime: String, input: InputStream) {
        val type = mime.substringBefore(';').ifBlank { "application/octet-stream" }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            val values = ContentValues().apply {
                put(MediaStore.Downloads.DISPLAY_NAME, name)
                put(MediaStore.Downloads.MIME_TYPE, type)
                put(MediaStore.Downloads.IS_PENDING, 1)
            }
            val collection = MediaStore.Downloads.getContentUri(MediaStore.VOLUME_EXTERNAL_PRIMARY)
            val item = context.contentResolver.insert(collection, values) ?: error("没能开始下载")
            context.contentResolver.openOutputStream(item)?.use { output -> input.copyTo(output) }
                ?: error("没能写入下载")
            values.clear()
            values.put(MediaStore.Downloads.IS_PENDING, 0)
            context.contentResolver.update(item, values, null, null)
        } else {
            val dir = context.getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS) ?: context.filesDir
            dir.mkdirs()
            File(dir, name).outputStream().use { output -> input.copyTo(output) }
        }
    }
}

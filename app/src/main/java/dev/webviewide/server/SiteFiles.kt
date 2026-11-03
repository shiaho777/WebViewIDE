package dev.webviewide.server

import java.io.File
import java.net.URLDecoder

sealed interface SiteHit {
    data class FileHit(val file: File, val html: Boolean) : SiteHit
    data object Reload : SiteHit
    data class Error(val code: Int) : SiteHit
}

object SiteFiles {
    const val RELOAD_PATH = "__webviewide/reload"
    private val baseHref = Regex(
        """<base\s+[^>]*href\s*=\s*["']([^"']+)["']""",
        RegexOption.IGNORE_CASE,
    )

    fun basePrefix(html: String): String {
        val href = baseHref.find(html)?.groupValues?.get(1)?.trim().orEmpty()
        if (href.isEmpty() || href == "/" || href == "." || href == "./") return ""
        if (href.startsWith("http://") || href.startsWith("https://")) return ""
        if (!href.startsWith("/")) return ""
        return if (href.endsWith("/")) href else "$href/"
    }

    fun normalize(rawPath: String): String? {
        val pathOnly = rawPath.substringBefore('?').substringBefore('#')
        val decoded = runCatching { URLDecoder.decode(pathOnly, Charsets.UTF_8.name()) }.getOrNull() ?: return null
        val parts = decoded.split('/').filter { it.isNotEmpty() && it != "." }
        val stack = ArrayDeque<String>()
        for (part in parts) {
            if (part == "..") {
                if (stack.isEmpty()) return null
                stack.removeLast()
            } else {
                stack.addLast(part)
            }
        }
        return stack.joinToString("/")
    }

    fun resolve(root: File, rawPath: String, spa: Boolean, entry: String, basePrefix: String): SiteHit {
        val normalized = normalize(rawPath) ?: return SiteHit.Error(400)
        if (normalized == RELOAD_PATH) return SiteHit.Reload
        val prefix = basePrefix.trim('/')
        val relative = when {
            prefix.isEmpty() -> normalized
            normalized == prefix -> ""
            normalized.startsWith("$prefix/") -> normalized.removePrefix("$prefix/")
            else -> normalized
        }
        if (relative.isEmpty() || relative.endsWith("/")) {
            return fileHit(root, join(relative, entry)) ?: SiteHit.Error(404)
        }
        val direct = fileHit(root, relative)
        if (direct != null) return direct
        val asDir = fileHit(root, join(relative, entry))
        if (asDir != null) return asDir
        val leaf = relative.substringAfterLast('/')
        if (spa && !leaf.contains('.')) {
            return fileHit(root, entry) ?: SiteHit.Error(404)
        }
        return SiteHit.Error(404)
    }

    fun mime(name: String): String = when (name.substringAfterLast('.', "").lowercase()) {
        "html", "htm" -> "text/html; charset=utf-8"
        "css" -> "text/css; charset=utf-8"
        "js", "mjs", "cjs" -> "text/javascript; charset=utf-8"
        "json", "map" -> "application/json"
        "svg" -> "image/svg+xml"
        "wasm" -> "application/wasm"
        "png" -> "image/png"
        "jpg", "jpeg" -> "image/jpeg"
        "gif" -> "image/gif"
        "webp" -> "image/webp"
        "ico" -> "image/x-icon"
        "woff" -> "font/woff"
        "woff2" -> "font/woff2"
        "ttf" -> "font/ttf"
        "otf" -> "font/otf"
        "webmanifest" -> "application/manifest+json"
        "txt", "md" -> "text/plain; charset=utf-8"
        "xml" -> "application/xml"
        "pdf" -> "application/pdf"
        "mp4" -> "video/mp4"
        "webm" -> "video/webm"
        "mp3" -> "audio/mpeg"
        "wav" -> "audio/wav"
        else -> "application/octet-stream"
    }

    fun isHtmlMime(mime: String): Boolean = mime.startsWith("text/html")

    fun fileNameFrom(url: String, disposition: String?): String {
        val star = disposition?.substringAfter("filename*=", "")?.substringBefore(';')?.trim().orEmpty()
        if (star.isNotEmpty()) {
            val encoded = star.substringAfter("''", star).trim('"')
            val decoded = runCatching { URLDecoder.decode(encoded, Charsets.UTF_8.name()) }.getOrNull()
            if (!decoded.isNullOrBlank()) return decoded.substringAfterLast('/')
        }
        val plain = disposition?.substringAfter("filename=", "")?.substringBefore(';')?.trim()?.trim('"').orEmpty()
        if (plain.isNotEmpty()) return plain.substringAfterLast('/')
        val path = url.substringBefore('?').substringAfterLast('/')
        return path.ifBlank { "download" }
    }

    private fun join(dir: String, name: String): String {
        val cleanDir = dir.trim('/')
        val cleanName = name.trim('/')
        return if (cleanDir.isEmpty()) cleanName else "$cleanDir/$cleanName"
    }

    private fun fileHit(root: File, relative: String): SiteHit.FileHit? {
        if (relative.isBlank()) return null
        val target = File(root, relative)
        if (!isInside(root, target) || !target.isFile) return null
        return SiteHit.FileHit(target, isHtmlMime(mime(target.name)))
    }

    fun isInside(root: File, target: File): Boolean {
        val base = root.canonicalFile
        val file = target.canonicalFile
        val rootPath = base.path
        val filePath = file.path
        return filePath == rootPath || filePath.startsWith(rootPath + File.separator)
    }
}

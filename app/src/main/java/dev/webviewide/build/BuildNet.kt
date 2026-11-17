package dev.webviewide.build

import java.io.File
import java.net.HttpURLConnection
import java.net.URL
import java.security.MessageDigest

/**
 * Network bridge for the build runtime. The in-WebView JS cannot fetch the npm
 * registry directly (CORS / 404 without CORS headers), so Kotlin performs the
 * HTTP on an IO thread and hands bytes back as base64 with a sha512 computed
 * during download. Tarballs are cached permanently by integrity; metadata gets
 * a short TTL + ETag revalidation. Only registry domains are allowed.
 */
object BuildNet {
    private val ALLOWED_HOSTS = setOf(
        "registry.npmjs.org",
        "registry.npmmirror.com",
        "cdn.jsdelivr.net",
    )

    const val META_TTL_MS = 5 * 60 * 1000L

    data class Result(val status: Int, val body: ByteArray, val sha512: String, val etag: String)

    fun isAllowed(url: String): Boolean {
        val host = runCatching { URL(url).host.lowercase() }.getOrNull() ?: return false
        return host in ALLOWED_HOSTS
    }

    fun sha512Hex(bytes: ByteArray): String =
        MessageDigest.getInstance("SHA-512").digest(bytes).joinToString("") { "%02x".format(it) }

    fun cacheKey(url: String): String =
        MessageDigest.getInstance("SHA-256").digest(url.toByteArray(Charsets.UTF_8))
            .joinToString("") { "%02x".format(it) }.take(32)

    private fun cacheDir(base: File) = File(base, "netcache").apply { mkdirs() }

    /** Permanent tarball cache keyed by integrity (sha512 hex). */
    fun tarballCacheFile(base: File, integritySha512: String): File =
        File(cacheDir(base), "tb-$integritySha512")

    fun readTarballCache(base: File, integritySha512: String): ByteArray? {
        val f = tarballCacheFile(base, integritySha512)
        if (!f.isFile) return null
        val bytes = f.readBytes()
        return if (sha512Hex(bytes) == integritySha512) bytes else null
    }

    fun writeTarballCache(base: File, integritySha512: String, bytes: ByteArray) {
        if (sha512Hex(bytes) != integritySha512) return
        val f = tarballCacheFile(base, integritySha512)
        val tmp = File(f.parentFile, ".${f.name}.tmp")
        tmp.writeBytes(bytes)
        if (!tmp.renameTo(f)) { tmp.copyTo(f, overwrite = true); tmp.delete() }
    }

    private fun metaFile(base: File, url: String) = File(cacheDir(base), "meta-${cacheKey(url)}")

    /** Short-TTL metadata cache; returns null when absent or expired. */
    fun readMetaCache(base: File, url: String, now: Long = System.currentTimeMillis()): Pair<ByteArray, String>? {
        val f = metaFile(base, url)
        if (!f.isFile) return null
        val etagFile = File(f.parentFile, f.name + ".etag")
        val tsFile = File(f.parentFile, f.name + ".ts")
        val ts = tsFile.takeIf { it.isFile }?.readText()?.toLongOrNull() ?: return null
        if (now - ts > META_TTL_MS) return null
        val etag = etagFile.takeIf { it.isFile }?.readText().orEmpty()
        return f.readBytes() to etag
    }

    fun writeMetaCache(base: File, url: String, bytes: ByteArray, etag: String, now: Long = System.currentTimeMillis()) {
        val f = metaFile(base, url)
        f.writeBytes(bytes)
        File(f.parentFile, f.name + ".etag").writeText(etag)
        File(f.parentFile, f.name + ".ts").writeText(now.toString())
    }

    /** Blocking fetch; call on an IO thread. [etag] enables 304 revalidation. */
    fun fetch(url: String, etag: String = ""): Result {
        require(isAllowed(url)) { "domain not allowed: $url" }
        val conn = URL(url).openConnection() as HttpURLConnection
        conn.instanceFollowRedirects = true
        conn.connectTimeout = 15_000
        conn.readTimeout = 60_000
        conn.requestMethod = "GET"
        if (etag.isNotBlank()) conn.setRequestProperty("If-None-Match", etag)
        return try {
            val status = conn.responseCode
            val respEtag = conn.getHeaderField("ETag").orEmpty()
            val stream = if (status in 200..299) conn.inputStream else conn.errorStream
            val bytes = stream?.use { it.readBytes() } ?: ByteArray(0)
            Result(status, bytes, sha512Hex(bytes), respEtag)
        } finally {
            conn.disconnect()
        }
    }
}
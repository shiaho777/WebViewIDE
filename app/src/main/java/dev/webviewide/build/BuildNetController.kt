package dev.webviewide.build

import android.util.Base64
import java.io.File
import java.util.concurrent.Executors

/**
 * Orchestrates build-runtime "net" requests on a small IO pool: tarball cache by
 * integrity, metadata short-TTL + ETag revalidation, then replies over the
 * bridge as base64 + sha512. Concurrency capped to keep memory/network bounded.
 */
class BuildNetController(
    private val baseDir: File,
    private val send: (String) -> Unit,
) {
    private val pool = Executors.newFixedThreadPool(4)

    fun handle(id: Long, url: String, integrity: String) {
        pool.execute {
            val result = runCatching { resolve(url, integrity) }
            val reply = result.fold(
                onSuccess = { r ->
                    BuildBridge.netResponse(
                        id, r.status,
                        Base64.encodeToString(r.body, Base64.NO_WRAP),
                        r.sha512, r.etag,
                    )
                },
                onFailure = { BuildBridge.netResponse(id, 0, "", "", "") },
            )
            send(reply)
        }
    }

    private fun resolve(url: String, integrity: String): BuildNet.Result {
        if (integrity.isNotBlank()) {
            BuildNet.readTarballCache(baseDir, integrity)?.let {
                return BuildNet.Result(200, it, integrity, "")
            }
        }
        val cached = BuildNet.readMetaCache(baseDir, url)
        val fetched = BuildNet.fetch(url, cached?.second.orEmpty())
        if (fetched.status == 304 && cached != null) {
            return BuildNet.Result(200, cached.first, BuildNet.sha512Hex(cached.first), cached.second)
        }
        if (fetched.status in 200..299) {
            if (integrity.isNotBlank()) {
                BuildNet.writeTarballCache(baseDir, integrity, fetched.body)
            } else {
                BuildNet.writeMetaCache(baseDir, url, fetched.body, fetched.etag)
            }
        }
        return fetched
    }

    fun shutdown() {
        pool.shutdown()
    }
}
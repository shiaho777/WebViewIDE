package dev.webviewide.build

import android.util.Base64
import java.io.File
import java.util.concurrent.Executors

/**
 * Orchestrates the esbuild build stage on an IO pool: lazily downloads the pinned
 * esbuild wasm into filesDir/esbuild/<ver>/ (cached), serves source reads/listings
 * from the project srcDir, and writes dist bytes back confined to the project.
 */
class BuildController(
    private val filesDir: File,
    private val projectRoot: () -> File?,
    private val send: (String) -> Unit,
) {
    private val pool = Executors.newSingleThreadExecutor()

    companion object {
        const val ESBUILD_VERSION = "0.25.0"
        const val WASM_URL = "https://cdn.jsdelivr.net/npm/esbuild-wasm@$ESBUILD_VERSION/esbuild.wasm"
    }

    fun wasmFile(): File = File(filesDir, "esbuild/$ESBUILD_VERSION/esbuild.wasm")

    // https URL served by BuildRuntime's WebViewAssetLoader (same-origin fetch).
    private fun wasmHttpsUrl(): String =
        "https://appassets.androidplatform.net/files/esbuild/$ESBUILD_VERSION/esbuild.wasm"

    private fun ensureWasm(): String? {
        val f = wasmFile()
        if (f.isFile && f.length() > 1_000_000) return wasmHttpsUrl()
        return runCatching {
            val result = BuildNet.fetch(WASM_URL)
            if (result.status !in 200..299) return null
            f.parentFile?.mkdirs()
            val tmp = File(f.parentFile, ".esbuild.wasm.tmp")
            tmp.writeBytes(result.body)
            if (!tmp.renameTo(f)) { tmp.copyTo(f, overwrite = true); tmp.delete() }
            wasmHttpsUrl()
        }.getOrNull()
    }

    fun startBuild(id: Long) {
        pool.execute {
            val url = ensureWasm()
            if (url == null) {
                send(dev.webviewide.project.encodeJson(mapOf("id" to id, "type" to "error", "payload" to mapOf("message" to "esbuild wasm 下载失败"))))
                return@execute
            }
            send(BuildBridge.wasmUrl(id, url))
        }
    }

    fun readSource(id: Long, path: String) {
        pool.execute {
            val root = projectRoot()
            val target = root?.let { BuildFs.resolve(it, path) }
            val bytes = target?.takeIf { it.isFile }?.readBytes()
            val b64 = if (bytes != null) Base64.encodeToString(bytes, Base64.NO_WRAP) else ""
            send(BuildBridge.readSourceResponse(id, b64, bytes != null))
        }
    }

    fun listSource(id: Long) {
        pool.execute {
            val root = projectRoot()
            val paths = root?.let { r ->
                r.walkTopDown()
                    .filter { it.isFile }
                    .map { it.relativeTo(r).path.replace(File.separatorChar, '/') }
                    .filter { !it.startsWith(".") }
                    .toList()
            } ?: emptyList()
            send(BuildBridge.listSourceResponse(id, paths))
        }
    }

    fun writeDist(id: Long, path: String, b64: String) {
        pool.execute {
            val root = projectRoot()
            val ok = root != null && runCatching {
                BuildFs.writeBytes(root, path, Base64.decode(b64, Base64.NO_WRAP))
            }.getOrDefault(false)
            send(BuildBridge.writeDistResponse(id, ok))
        }
    }

    fun shutdown() {
        pool.shutdown()
    }
}
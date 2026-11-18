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
        const val TS_VERSION = "5.8.3"
        // ES2020 + DOM reference closure (order matters: refs come after parents,
        // but triple-slash refs are order-independent for declaration merging).
        val TS_LIBS = listOf(
            "lib.es2020.d.ts", "lib.es2019.d.ts", "lib.es2018.d.ts", "lib.es2017.d.ts",
            "lib.es2016.d.ts", "lib.es2015.d.ts", "lib.es5.d.ts",
            "lib.decorators.d.ts", "lib.decorators.legacy.d.ts",
            "lib.es2015.core.d.ts", "lib.es2015.collection.d.ts", "lib.es2015.iterable.d.ts",
            "lib.es2015.symbol.d.ts", "lib.es2015.generator.d.ts", "lib.es2015.promise.d.ts",
            "lib.es2015.proxy.d.ts", "lib.es2015.reflect.d.ts", "lib.es2015.symbol.wellknown.d.ts",
            "lib.es2016.array.include.d.ts", "lib.es2016.intl.d.ts",
            "lib.es2017.arraybuffer.d.ts", "lib.es2017.date.d.ts", "lib.es2017.intl.d.ts",
            "lib.es2017.object.d.ts", "lib.es2017.sharedmemory.d.ts", "lib.es2017.string.d.ts",
            "lib.es2017.typedarrays.d.ts",
            "lib.es2018.asynciterable.d.ts", "lib.es2018.asyncgenerator.d.ts", "lib.es2018.promise.d.ts",
            "lib.es2018.regexp.d.ts", "lib.es2018.intl.d.ts",
            "lib.es2019.array.d.ts", "lib.es2019.object.d.ts", "lib.es2019.string.d.ts",
            "lib.es2019.symbol.d.ts", "lib.es2019.intl.d.ts",
            "lib.es2020.bigint.d.ts", "lib.es2020.intl.d.ts", "lib.es2020.date.d.ts",
            "lib.es2020.number.d.ts", "lib.es2020.promise.d.ts", "lib.es2020.sharedmemory.d.ts",
            "lib.es2020.string.d.ts", "lib.es2020.symbol.wellknown.d.ts",
            "lib.dom.d.ts", "lib.dom.iterable.d.ts", "lib.dom.asynciterable.d.ts",
        )
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

    private fun tsDir(): File = File(filesDir, "typescript/$TS_VERSION")

    /** Lazily fetches tsc + the lib closure, concatenates libs.d.ts; returns the
     *  https base URL the build page loads typescript.js / libs.d.ts from. */
    private fun ensureTypeScript(): String? {
        val dir = tsDir()
        val js = File(dir, "typescript.js")
        val libs = File(dir, "libs.d.ts")
        if (js.isFile && js.length() > 1_000_000 && libs.isFile && libs.length() > 500_000) {
            return "https://appassets.androidplatform.net/files/typescript/$TS_VERSION/"
        }
        return runCatching {
            dir.mkdirs()
            if (!js.isFile || js.length() <= 1_000_000) {
                val r = BuildNet.fetch("https://cdn.jsdelivr.net/npm/typescript@$TS_VERSION/lib/typescript.js")
                if (r.status !in 200..299) return null
                js.writeBytes(r.body)
            }
            val merged = StringBuilder()
            for (name in TS_LIBS) {
                val cached = File(dir, name)
                if (!cached.isFile) {
                    val r = BuildNet.fetch("https://cdn.jsdelivr.net/npm/typescript@$TS_VERSION/lib/$name")
                    if (r.status !in 200..299) return null
                    cached.writeBytes(r.body)
                }
                merged.append(cached.readText()).append('\n')
            }
            libs.writeText(merged.toString())
            "https://appassets.androidplatform.net/files/typescript/$TS_VERSION/"
        }.getOrNull()
    }

    fun startTypecheck(id: Long) {
        pool.execute {
            val base = ensureTypeScript()
            if (base == null) {
                send(dev.webviewide.project.encodeJson(mapOf("id" to id, "type" to "error", "payload" to mapOf("message" to "TypeScript 下载失败（需要网络）"))))
                send(dev.webviewide.project.encodeJson(mapOf("id" to id, "type" to "tcdone", "payload" to mapOf("ok" to false, "summary" to "TypeScript 下载失败"))))
                return@execute
            }
            send(BuildBridge.tsUrl(id, base))
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
package dev.webviewide.build

import dev.webviewide.project.encodeJson
import dev.webviewide.project.int
import dev.webviewide.project.jsonObject
import dev.webviewide.project.jsonString
import dev.webviewide.project.obj
import dev.webviewide.project.parseJson
import dev.webviewide.project.string

/**
 * JSON protocol between Kotlin and the hidden build-runtime WebView that runs
 * the npm/esbuild pipeline. Same shape as the editor bridge ({id,type,payload})
 * but a distinct channel so build traffic never mixes with editing.
 *
 * Down: {id,type,payload} via evaluateJavascript("__wviBuildReceive(json)").
 * Up:   {id,type,payload} via @JavascriptInterface WviBuild.post(json).
 *
 * Pure-JVM JsonLite keeps it unit-testable without Android org.json stubs.
 */
object BuildBridge {
    // ---- down: commands ----
    fun install(id: Long): String = message(id, "install", emptyMap())
    fun build(id: Long): String = message(id, "build", emptyMap())
    fun cancel(id: Long): String = message(id, "cancel", emptyMap())

    /** Response to an up "net" request. [bodyB64] empty on failure with [status]. */
    fun netResponse(id: Long, status: Int, bodyB64: String, sha512: String, etag: String): String =
        message(id, "netResponse", mapOf("status" to status, "body" to bodyB64, "sha512" to sha512, "etag" to etag))

    /** Response to an up "fsRead". */
    fun fsReadResponse(id: Long, text: String?, exists: Boolean): String =
        message(id, "fsReadResponse", mapOf("text" to (text ?: ""), "exists" to exists))

    /** Ack for an up "fsWrite". */
    fun fsWriteResponse(id: Long, ok: Boolean, error: String): String =
        message(id, "fsWriteResponse", mapOf("ok" to ok, "error" to error))

    private fun message(id: Long, type: String, payload: Map<String, Any?>): String =
        encodeJson(mapOf("id" to id, "type" to type, "payload" to payload))

    fun jsCall(messageJson: String): String = "window.__wviBuildReceive(${jsonString(messageJson)})"
}

sealed interface BuildEvent {
    data object Ready : BuildEvent
    data class Log(val level: String, val text: String) : BuildEvent
    data class Progress(val fraction: Float, val label: String) : BuildEvent
    data class Net(val url: String, val method: String) : BuildEvent
    data class FsWrite(val path: String, val text: String?, val b64: String?) : BuildEvent
    data class FsRead(val path: String) : BuildEvent
    data class Done(val ok: Boolean, val summary: String) : BuildEvent
    data class Error(val message: String) : BuildEvent
}

object BuildEvents {
    /** Parses an up-message; null for malformed or unknown input. */
    fun parse(json: String): Pair<Long, BuildEvent>? {
        val root = runCatching { parseJson(json).jsonObject() }.getOrNull() ?: return null
        val id = (root["id"] as? Number)?.toLong() ?: 0L
        val p = root.obj("payload")
        val event = when (root.string("type")) {
            "ready" -> BuildEvent.Ready
            "log" -> BuildEvent.Log(p.string("level", "info"), p.string("text"))
            "progress" -> BuildEvent.Progress(
                fraction = (p["fraction"] as? Number)?.toFloat() ?: 0f,
                label = p.string("label"),
            )
            "net" -> BuildEvent.Net(p.string("url"), p.string("method", "GET"))
            "fsWrite" -> BuildEvent.FsWrite(
                path = p.string("path"),
                text = p["text"] as? String,
                b64 = p["b64"] as? String,
            )
            "fsRead" -> BuildEvent.FsRead(p.string("path"))
            "done" -> BuildEvent.Done(p["ok"] as? Boolean ?: false, p.string("summary"))
            "error" -> BuildEvent.Error(p.string("message"))
            else -> return null
        }
        return id to event
    }
}
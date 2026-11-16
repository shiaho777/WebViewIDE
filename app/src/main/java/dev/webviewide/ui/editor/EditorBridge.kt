package dev.webviewide.ui.editor

import dev.webviewide.project.SourceKind
import dev.webviewide.project.encodeJson
import dev.webviewide.project.int
import dev.webviewide.project.jsonObject
import dev.webviewide.project.jsonString
import dev.webviewide.project.obj
import dev.webviewide.project.parseJson
import dev.webviewide.project.string

/**
 * JSON message protocol between the Kotlin document buffer (single source of
 * truth) and the CodeMirror 6 view inside the editor WebView.
 *
 * Down: {id, type, payload} via evaluateJavascript("__wviReceive(json)").
 * Up:   {id, type, payload} via @JavascriptInterface WviBridge.post(json).
 *
 * Uses the project's JsonLite (pure JVM) so the protocol is unit-testable
 * without Android's org.json stubs.
 */
object EditorBridge {
    fun kindKey(kind: SourceKind): String = when (kind) {
        SourceKind.HTML -> "html"
        SourceKind.CSS -> "css"
        SourceKind.JS -> "js"
        SourceKind.JSON -> "json"
        SourceKind.PLAIN -> "plain"
    }

    fun setDoc(id: Long, text: String, kind: SourceKind): String =
        message(id, "setDoc", mapOf("text" to text, "kind" to kindKey(kind)))

    fun goto(id: Long, pos: Int): String =
        message(id, "goto", mapOf("pos" to pos))

    fun find(id: Long, query: String, forward: Boolean): String =
        message(id, "find", mapOf("query" to query, "dir" to if (forward) "next" else "prev"))

    fun replace(id: Long, query: String, text: String, all: Boolean): String =
        message(id, if (all) "replaceAll" else "replace", mapOf("query" to query, "text" to text))

    fun insert(id: Long, text: String): String =
        message(id, "insert", mapOf("text" to text))

    fun simple(id: Long, type: String): String = message(id, type, emptyMap())

    fun theme(id: Long, colors: Map<String, String>): String = message(id, "theme", colors)

    private fun message(id: Long, type: String, payload: Map<String, Any?>): String =
        encodeJson(mapOf("id" to id, "type" to type, "payload" to payload))

    /** Wraps a protocol message into the JS call executed on the editor WebView. */
    fun jsCall(messageJson: String): String = "window.__wviReceive(${jsonString(messageJson)})"
}

sealed interface EditorEvent {
    data class Change(val text: String) : EditorEvent
    data class Cursor(val pos: Int, val line: Int, val col: Int) : EditorEvent
    data class FindResult(val found: Boolean, val pos: Int, val done: Boolean, val changed: Boolean) : EditorEvent
    data object Ready : EditorEvent
    data class Error(val message: String) : EditorEvent
}

object EditorEvents {
    /** Parses an up-message; returns null for malformed or unknown input. */
    fun parse(json: String): EditorEvent? {
        val root = runCatching { parseJson(json).jsonObject() }.getOrNull() ?: return null
        val payload = root.obj("payload")
        return when (root.string("type")) {
            "ready" -> EditorEvent.Ready
            "change" -> EditorEvent.Change(payload.string("text"))
            "cursor" -> EditorEvent.Cursor(
                pos = payload.int("pos", 0),
                line = payload.int("line", 1),
                col = payload.int("col", 1),
            )
            "findResult" -> EditorEvent.FindResult(
                found = payload["found"] as? Boolean ?: false,
                pos = payload.int("pos", 0),
                done = payload["done"] as? Boolean ?: false,
                changed = payload["changed"] as? Boolean ?: false,
            )
            "error" -> EditorEvent.Error(payload.string("message"))
            else -> null
        }
    }
}
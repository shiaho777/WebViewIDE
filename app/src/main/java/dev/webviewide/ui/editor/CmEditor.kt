package dev.webviewide.ui.editor

import android.annotation.SuppressLint
import android.webkit.JavascriptInterface
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.expandVertically
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.shrinkVertically
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.Close
import androidx.compose.material.icons.outlined.Description
import androidx.compose.material.icons.outlined.FindReplace
import androidx.compose.material.icons.outlined.KeyboardArrowDown
import androidx.compose.material.icons.outlined.KeyboardArrowUp
import androidx.compose.material.icons.outlined.Redo
import androidx.compose.material.icons.outlined.Search
import androidx.compose.material.icons.outlined.Undo
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.unit.dp
import androidx.compose.ui.viewinterop.AndroidView
import dev.webviewide.project.SourceKind
import dev.webviewide.ui.theme.AppMotion

/**
 * Professional editor face: CodeMirror 6 in a WebView. The Kotlin-side draft
 * (IdeSession) remains the single source of truth — this view reports changes
 * over [EditorBridge] and never writes files itself.
 */
@SuppressLint("SetJavaScriptEnabled")
@Composable
fun CmCodeEditor(
    path: String,
    initial: String,
    kind: SourceKind,
    onText: (String) -> Unit,
    gotoLine: Int = 0,
    onGotoConsumed: () -> Unit = {},
) {
    val scheme = MaterialTheme.colorScheme
    val palette = remember(scheme) { scheme.editorPalette() }
    var ready by remember(path) { mutableStateOf(false) }
    var finding by remember(path) { mutableStateOf(false) }
    var replacing by remember(path) { mutableStateOf(false) }
    var query by remember(path) { mutableStateOf("") }
    var replacement by remember(path) { mutableStateOf("") }
    var cursor by remember(path) { mutableStateOf("行 1 · 列 1") }
    var findStatus by remember(path) { mutableStateOf("") }
    val id = remember(path) { java.util.concurrent.atomic.AtomicLong(0) }
    val webRef = remember(path) { arrayOfNulls<WebView>(1) }

    fun send(message: String) {
        val web = webRef[0] ?: return
        web.post { web.evaluateJavascript(EditorBridge.jsCall(message), null) }
    }

    fun jumpToLine(line: Int) {
        if (line <= 0) return
        val offset = initial.lineStartOffset(line)
        send(EditorBridge.goto(id.incrementAndGet(), offset))
        onGotoConsumed()
    }

    androidx.compose.runtime.LaunchedEffect(gotoLine, ready, path) {
        if (ready && gotoLine > 0) jumpToLine(gotoLine)
    }

    Column(Modifier.fillMaxSize().imePadding()) {
        Surface(color = MaterialTheme.colorScheme.surfaceContainerLow) {
            Row(
                Modifier.fillMaxWidth().padding(horizontal = 8.dp, vertical = 2.dp),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Icon(
                    Icons.Outlined.Description,
                    contentDescription = null,
                    modifier = Modifier.size(16.dp),
                    tint = MaterialTheme.colorScheme.primary,
                )
                Text(
                    cursor,
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    modifier = Modifier.padding(start = 8.dp).weight(1f),
                )
                IconButton(onClick = { send(EditorBridge.simple(id.incrementAndGet(), "undo")) }) {
                    Icon(Icons.Outlined.Undo, contentDescription = "撤销", modifier = Modifier.size(20.dp))
                }
                IconButton(onClick = { send(EditorBridge.simple(id.incrementAndGet(), "redo")) }) {
                    Icon(Icons.Outlined.Redo, contentDescription = "重做", modifier = Modifier.size(20.dp))
                }
                IconButton(onClick = {
                    finding = !finding
                    if (!finding) replacing = false
                }) {
                    Icon(
                        if (finding) Icons.Outlined.Close else Icons.Outlined.Search,
                        contentDescription = "查找",
                        modifier = Modifier.size(20.dp),
                    )
                }
                IconButton(onClick = {
                    replacing = !replacing
                    if (replacing) finding = true
                }) {
                    Icon(Icons.Outlined.FindReplace, contentDescription = "替换", modifier = Modifier.size(20.dp))
                }
            }
        }
        AnimatedVisibility(
            visible = finding,
            enter = expandVertically(animationSpec = AppMotion.size) + fadeIn(animationSpec = AppMotion.effects()),
            exit = shrinkVertically(animationSpec = AppMotion.size) + fadeOut(animationSpec = AppMotion.effectsFast()),
        ) {
            Column(Modifier.fillMaxWidth().padding(horizontal = 12.dp, vertical = 6.dp)) {
                OutlinedTextField(
                    value = query,
                    onValueChange = { query = it },
                    modifier = Modifier.fillMaxWidth(),
                    singleLine = true,
                    shape = MaterialTheme.shapes.medium,
                    label = { Text(if (findStatus.isEmpty()) "查找" else "查找 · $findStatus") },
                    trailingIcon = {
                        Row {
                            IconButton(onClick = { send(EditorBridge.find(id.incrementAndGet(), query, false)) }) {
                                Icon(Icons.Outlined.KeyboardArrowUp, contentDescription = "上一个")
                            }
                            IconButton(onClick = { send(EditorBridge.find(id.incrementAndGet(), query, true)) }) {
                                Icon(Icons.Outlined.KeyboardArrowDown, contentDescription = "下一个")
                            }
                        }
                    },
                )
                if (replacing) {
                    Row(
                        Modifier.fillMaxWidth().padding(top = 6.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                    ) {
                        OutlinedTextField(
                            value = replacement,
                            onValueChange = { replacement = it },
                            modifier = Modifier.weight(1f),
                            singleLine = true,
                            shape = MaterialTheme.shapes.medium,
                            label = { Text("替换为") },
                        )
                        TextButton(onClick = {
                            send(EditorBridge.replace(id.incrementAndGet(), query, replacement, false))
                        }) { Text("替换") }
                        TextButton(onClick = {
                            send(EditorBridge.replace(id.incrementAndGet(), query, replacement, true))
                        }) { Text("全部") }
                    }
                }
            }
        }
        Box(Modifier.weight(1f).fillMaxSize()) {
            AndroidView(
                modifier = Modifier.fillMaxSize(),
                factory = { context ->
                    WebView(context).apply {
                        settings.javaScriptEnabled = true
                        settings.domStorageEnabled = false
                        settings.allowFileAccess = false
                        settings.allowContentAccess = false
                        settings.textZoom = 100
                        settings.setSupportZoom(false)
                        settings.builtInZoomControls = false
                        setBackgroundColor(palette["bg"]!!.toColorInt())
                        addJavascriptInterface(object {
                            @JavascriptInterface
                            fun post(json: String) {
                                val event = EditorEvents.parse(json) ?: return
                                this@apply.post {
                                    when (event) {
                                        is EditorEvent.Ready -> {
                                            ready = true
                                            evaluateJavascript(
                                                EditorBridge.jsCall(EditorBridge.setDoc(id.incrementAndGet(), initial, kind)),
                                                null,
                                            )
                                            evaluateJavascript(
                                                EditorBridge.jsCall(EditorBridge.theme(id.incrementAndGet(), palette)),
                                                null,
                                            )
                                            if (gotoLine > 0) {
                                                evaluateJavascript(
                                                    EditorBridge.jsCall(
                                                        EditorBridge.goto(id.incrementAndGet(), initial.lineStartOffset(gotoLine)),
                                                    ),
                                                    null,
                                                )
                                                onGotoConsumed()
                                            }
                                        }
                                        is EditorEvent.Change -> onText(event.text)
                                        is EditorEvent.Cursor -> cursor = "行 ${event.line} · 列 ${event.col}"
                                        is EditorEvent.FindResult -> findStatus = when {
                                            event.done -> if (event.changed) "已全部替换" else "没有可替换的匹配"
                                            event.found -> "已定位"
                                            else -> "没找到"
                                        }
                                        is EditorEvent.Error -> Unit
                                    }
                                }
                            }
                        }, "WviBridge")
                        webViewClient = WebViewClient()
                        webRef[0] = this
                        loadUrl("file:///android_asset/editor/index.html")
                    }
                },
            )
        }
        SymbolBar(kind = kind, enabled = ready) { text ->
            send(EditorBridge.insert(id.incrementAndGet(), text))
        }
    }
    DisposableEffect(path) {
        onDispose {
            webRef[0]?.let { web ->
                web.removeJavascriptInterface("WviBridge")
                web.destroy()
            }
            webRef[0] = null
        }
    }
}

@Composable
private fun SymbolBar(kind: SourceKind, enabled: Boolean, onInsert: (String) -> Unit) {
    val symbols = remember(kind) {
        val common = listOf(
            "Tab" to "\t", "(" to "(", ")" to ")", "{" to "{", "}" to "}", "[" to "[", "]" to "]",
            "<" to "<", ">" to ">", "\"" to "\"", "'" to "'", "=" to "=", ";" to ";", ":" to ":",
            "/" to "/", "\\" to "\\",
        )
        val extra = when (kind) {
            SourceKind.HTML -> listOf("</", "/>", "!--", "div", "span", "class=", "style=")
            SourceKind.CSS -> listOf("#", ".", "@media", "!important", "px", "rem", "%")
            SourceKind.JS -> listOf("=>", "===", "&&", "||", "const ", "let ", "function ", "return ", "`")
            SourceKind.JSON -> listOf(",", "true", "false", "null")
            SourceKind.PLAIN -> emptyList()
        }
        common + extra.map { it.trim() to it }
    }
    Surface(color = MaterialTheme.colorScheme.surfaceContainer) {
        Row(
            Modifier.fillMaxWidth().horizontalScroll(rememberScrollState()).padding(horizontal = 6.dp, vertical = 4.dp),
            horizontalArrangement = Arrangement.spacedBy(4.dp),
        ) {
            symbols.forEach { (label, text) ->
                Surface(
                    onClick = { onInsert(text) },
                    enabled = enabled,
                    shape = MaterialTheme.shapes.small,
                    color = MaterialTheme.colorScheme.secondaryContainer,
                    contentColor = MaterialTheme.colorScheme.onSecondaryContainer,
                ) {
                    Text(
                        label,
                        style = MaterialTheme.typography.labelMedium,
                        maxLines = 1,
                        modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp),
                    )
                }
            }
        }
    }
}

internal fun String.lineStartOffset(line: Int): Int {
    if (line <= 1) return 0
    var seen = 1
    forEachIndexed { index, ch ->
        if (ch == '\n') {
            seen++
            if (seen == line) return (index + 1).coerceAtMost(length)
        }
    }
    return length
}

private fun blend(foreground: Color, background: Color, alpha: Float): Color = Color(
    red = foreground.red * alpha + background.red * (1 - alpha),
    green = foreground.green * alpha + background.green * (1 - alpha),
    blue = foreground.blue * alpha + background.blue * (1 - alpha),
    alpha = 1f,
)

private fun String.toColorInt(): Int = android.graphics.Color.parseColor(this)

private fun Color.hex(): String = "#%06X".format(0xFFFFFF and toArgb())

private fun androidx.compose.material3.ColorScheme.editorPalette(): Map<String, String> = mapOf(
    "bg" to surface.hex(),
    "fg" to onSurface.hex(),
    "gutter" to surfaceContainerLow.hex(),
    "gutterFg" to onSurfaceVariant.hex(),
    "activeLine" to surfaceContainerHigh.hex(),
    "selection" to blend(primary, surface, 0.25f).hex(),
    "cursor" to primary.hex(),
    "keyword" to primary.hex(),
    "string" to tertiary.hex(),
    "number" to secondary.hex(),
    "comment" to onSurfaceVariant.hex(),
    "tag" to primary.hex(),
    "attr" to secondary.hex(),
)


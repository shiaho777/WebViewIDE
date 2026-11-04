package dev.webviewide.ui.editor

import android.graphics.BitmapFactory
import androidx.compose.foundation.Image
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.expandVertically
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.shrinkVertically
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.Close
import androidx.compose.material.icons.outlined.Description
import androidx.compose.material.icons.outlined.KeyboardArrowDown
import androidx.compose.material.icons.outlined.KeyboardArrowUp
import androidx.compose.material.icons.outlined.Redo
import androidx.compose.material.icons.outlined.Search
import androidx.compose.material.icons.outlined.Undo
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.TextRange
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.input.TextFieldValue
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import dev.webviewide.project.SourceKind
import dev.webviewide.project.Tone
import dev.webviewide.project.tokenize
import dev.webviewide.ui.theme.AppMotion
import dev.webviewide.ui.theme.CodeTextStyle
import java.io.File
import kotlinx.coroutines.launch

@Composable
fun CodeEditor(
    path: String,
    initial: String,
    kind: SourceKind,
    onText: (String) -> Unit,
) {
    val scope = rememberCoroutineScope()
    val vertical = rememberScrollState()
    val horizontal = rememberScrollState()
    var value by remember(path) { mutableStateOf(TextFieldValue(initial)) }
    val history = remember(path) { ArrayDeque<TextFieldValue>() }
    val redo = remember(path) { ArrayDeque<TextFieldValue>() }
    var query by remember(path) { mutableStateOf("") }
    var finding by remember(path) { mutableStateOf(false) }
    val linePx = with(androidx.compose.ui.platform.LocalDensity.current) { CodeTextStyle.lineHeight.toPx() }
    val scheme = MaterialTheme.colorScheme
    val palette = remember(scheme) {
        mapOf(
            Tone.COMMENT to scheme.onSurfaceVariant,
            Tone.KEYWORD to scheme.primary,
            Tone.STRING to scheme.tertiary,
            Tone.NUMBER to scheme.secondary,
            Tone.TAG to scheme.primary,
            Tone.ATTR to scheme.secondary,
        )
    }
    val lines = value.text.count { it == '\n' } + 1
    val gutter = lines.toString().length.coerceAtLeast(2)

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
                Spacer(Modifier.weight(1f))
                IconButton(onClick = {
                    val previous = history.removeLastOrNull() ?: return@IconButton
                    redo.addLast(value)
                    value = previous
                    onText(previous.text)
                }) { Icon(Icons.Outlined.Undo, contentDescription = "撤销", modifier = Modifier.size(20.dp)) }
                IconButton(onClick = {
                    val next = redo.removeLastOrNull() ?: return@IconButton
                    history.addLast(value)
                    value = next
                    onText(next.text)
                }) { Icon(Icons.Outlined.Redo, contentDescription = "重做", modifier = Modifier.size(20.dp)) }
                IconButton(onClick = { finding = !finding }) {
                    Icon(
                        if (finding) Icons.Outlined.Close else Icons.Outlined.Search,
                        contentDescription = "查找",
                        modifier = Modifier.size(20.dp),
                    )
                }
            }
        }
        AnimatedVisibility(
            visible = finding,
            enter = expandVertically(animationSpec = AppMotion.size) + fadeIn(animationSpec = AppMotion.effects()),
            exit = shrinkVertically(animationSpec = AppMotion.size) + fadeOut(animationSpec = AppMotion.effectsFast()),
        ) {
            OutlinedTextField(
                value = query,
                onValueChange = { query = it },
                modifier = Modifier.fillMaxWidth().padding(horizontal = 12.dp, vertical = 6.dp),
                singleLine = true,
                shape = MaterialTheme.shapes.medium,
                label = { Text("查找") },
                trailingIcon = {
                    Row {
                        IconButton(onClick = {
                            find(value, query, false)?.let { found ->
                                value = found
                                scope.launch { vertical.scrollTo(lineOffset(found.text, found.selection.start, linePx)) }
                            }
                        }) { Icon(Icons.Outlined.KeyboardArrowUp, contentDescription = "上一个") }
                        IconButton(onClick = {
                            find(value, query, true)?.let { found ->
                                value = found
                                scope.launch { vertical.scrollTo(lineOffset(found.text, found.selection.start, linePx)) }
                            }
                        }) { Icon(Icons.Outlined.KeyboardArrowDown, contentDescription = "下一个") }
                    }
                },
            )
        }
        Box(Modifier.weight(1f).fillMaxSize().horizontalScroll(horizontal)) {
            Row(Modifier.verticalScroll(vertical).padding(bottom = 48.dp)) {
                Text(
                    (1..lines).joinToString("\n"),
                    modifier = Modifier.width((gutter * 10 + 16).dp).padding(start = 8.dp, end = 8.dp),
                    style = CodeTextStyle,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    softWrap = false,
                    textAlign = TextAlign.End,
                )
                BasicTextField(
                    value = value,
                    onValueChange = { next ->
                        if (next.text != value.text) {
                            history.addLast(value)
                            while (history.size > 80) history.removeFirst()
                            redo.clear()
                            onText(next.text)
                        }
                        value = next
                    },
                    textStyle = CodeTextStyle.copy(color = MaterialTheme.colorScheme.onSurface),
                    cursorBrush = SolidColor(MaterialTheme.colorScheme.primary),
                    keyboardOptions = KeyboardOptions.Default,
                    visualTransformation = if (value.text.length > 150_000) {
                        VisualTransformation.None
                    } else {
                        VisualTransformation { text ->
                            androidx.compose.ui.text.input.TransformedText(
                                highlight(text.text, kind, palette),
                                androidx.compose.ui.text.input.OffsetMapping.Identity,
                            )
                        }
                    },
                    modifier = Modifier.padding(end = 16.dp),
                )
            }
        }
    }
}

@Composable
fun ImageFace(file: File) {
    val bitmap = remember(file.path, file.lastModified()) { decodePreview(file) }
    if (bitmap == null) {
        Text("这张图打不开", modifier = Modifier.padding(16.dp))
    } else {
        Image(
            bitmap.asImageBitmap(),
            contentDescription = file.name,
            modifier = Modifier.fillMaxSize().padding(16.dp),
            contentScale = ContentScale.Fit,
        )
    }
}

private fun decodePreview(file: File): android.graphics.Bitmap? {
    val bounds = BitmapFactory.Options().apply { inJustDecodeBounds = true }
    BitmapFactory.decodeFile(file.path, bounds)
    var sample = 1
    while (bounds.outWidth / sample > 2000 || bounds.outHeight / sample > 2000) sample *= 2
    return BitmapFactory.decodeFile(file.path, BitmapFactory.Options().apply { inSampleSize = sample })
}

private fun highlight(
    code: String,
    kind: SourceKind,
    palette: Map<Tone, androidx.compose.ui.graphics.Color>,
) = buildAnnotatedString {
    for (tok in tokenize(code, kind)) {
        val color = palette[tok.tone]
        if (color != null && tok.tone != Tone.PLAIN) pushStyle(SpanStyle(color = color))
        append(code.substring(tok.start, tok.end.coerceAtMost(code.length)))
        if (color != null && tok.tone != Tone.PLAIN) pop()
    }
}

private fun find(value: TextFieldValue, query: String, forward: Boolean): TextFieldValue? {
    if (query.isEmpty()) return null
    val text = value.text
    val index = if (forward) {
        text.indexOf(query, value.selection.end.coerceAtMost(text.length), ignoreCase = true)
            .let { if (it >= 0) it else text.indexOf(query, ignoreCase = true) }
    } else {
        val from = (value.selection.start - 1).coerceAtLeast(0)
        text.lastIndexOf(query, from, ignoreCase = true)
            .let { if (it >= 0) it else text.lastIndexOf(query, ignoreCase = true) }
    }
    if (index < 0) return null
    return value.copy(selection = TextRange(index, index + query.length))
}

private fun lineOffset(text: String, index: Int, linePx: Float): Int {
    val line = text.take(index.coerceAtLeast(0)).count { it == '\n' }
    return (line * linePx).toInt()
}

package dev.webviewide.project

enum class Tone { PLAIN, COMMENT, KEYWORD, STRING, NUMBER, TAG, ATTR }

data class Tok(val start: Int, val end: Int, val tone: Tone)

private val jsKeywords = setOf(
    "const", "let", "var", "function", "return", "if", "else", "for", "while", "class",
    "extends", "new", "this", "import", "export", "from", "async", "await", "try", "catch",
    "finally", "throw", "switch", "case", "break", "continue", "default", "typeof",
    "instanceof", "of", "in", "true", "false", "null", "undefined", "yield",
)

private val cssKeywords = setOf(
    "color", "background", "display", "margin", "padding", "font", "font-size", "width",
    "height", "border", "flex", "grid", "position", "content", "align-items", "justify-content",
    "gap", "overflow", "opacity", "transform", "transition", "animation", "z-index",
)

fun tokenize(code: String, kind: SourceKind): List<Tok> = when (kind) {
    SourceKind.PLAIN -> listOf(Tok(0, code.length, Tone.PLAIN))
    SourceKind.JS -> scanJs(code, 0, code.length)
    SourceKind.CSS -> scanCss(code, 0, code.length)
    SourceKind.JSON -> scanJson(code)
    SourceKind.HTML -> scanHtml(code)
}

private fun scanHtml(code: String): List<Tok> {
    val out = mutableListOf<Tok>()
    var i = 0
    while (i < code.length) {
        if (code.startsWith("<!--", i)) {
            val end = code.indexOf("-->", i + 4).let { if (it < 0) code.length else it + 3 }
            out += Tok(i, end, Tone.COMMENT)
            i = end
            continue
        }
        if (code[i] == '<') {
            val close = code.indexOf('>', i + 1).let { if (it < 0) code.length else it + 1 }
            val raw = code.substring(i, close)
            val name = tagName(raw)
            out += scanTag(code, i, close)
            i = close
            when (name) {
                "script" -> {
                    if (raw.contains("src=", ignoreCase = true)) continue
                    val end = indexOfClose(code, i, "script")
                    out += scanJs(code, i, end)
                    i = end
                }
                "style" -> {
                    val end = indexOfClose(code, i, "style")
                    out += scanCss(code, i, end)
                    i = end
                }
            }
            continue
        }
        val next = code.indexOf('<', i).let { if (it < 0) code.length else it }
        out += Tok(i, next, Tone.PLAIN)
        i = next
    }
    return merge(out)
}

private fun tagName(raw: String): String {
    val body = raw.trim('<', '>', '/', ' ', '\n', '\t').substringBefore(' ').substringBefore('\n')
    return body.substringBefore('/').lowercase()
}

private fun indexOfClose(code: String, from: Int, name: String): Int {
    val needle = "</$name"
    var i = from
    while (i < code.length) {
        val found = code.indexOf(needle, i, ignoreCase = true)
        if (found < 0) return code.length
        val after = found + needle.length
        if (after >= code.length || code[after].isWhitespace() || code[after] == '>') return found
        i = found + 1
    }
    return code.length
}

private fun scanTag(code: String, start: Int, end: Int): List<Tok> {
    val out = mutableListOf<Tok>()
    var i = start
    var quote = '\u0000'
    var inName = true
    var wordStart = -1
    fun flushWord(at: Int, tone: Tone) {
        if (wordStart >= 0 && wordStart < at) out += Tok(wordStart, at, tone)
        wordStart = -1
    }
    while (i < end) {
        val ch = code[i]
        if (quote != '\u0000') {
            if (ch == quote && code[i - 1] != '\\') {
                out += Tok(wordStart, i + 1, Tone.STRING)
                wordStart = -1
                quote = '\u0000'
            }
            i++
            continue
        }
        when {
            ch == '"' || ch == '\'' -> {
                flushWord(i, if (inName) Tone.TAG else Tone.ATTR)
                quote = ch
                wordStart = i
                inName = false
            }
            ch == '<' || ch == '>' || ch == '/' -> {
                flushWord(i, if (inName) Tone.TAG else Tone.ATTR)
                out += Tok(i, i + 1, Tone.TAG)
                if (ch == ' ') inName = false
            }
            ch.isWhitespace() || ch == '=' -> {
                flushWord(i, if (inName) Tone.TAG else Tone.ATTR)
                out += Tok(i, i + 1, Tone.PLAIN)
                inName = false
            }
            wordStart < 0 -> wordStart = i
        }
        i++
    }
    flushWord(end, if (inName) Tone.TAG else Tone.ATTR)
    return out
}

private fun scanJs(code: String, start: Int, end: Int): List<Tok> {
    val out = mutableListOf<Tok>()
    var i = start
    while (i < end) {
        val ch = code[i]
        when {
            ch == '/' && i + 1 < end && code[i + 1] == '/' -> {
                var j = i + 2
                while (j < end && code[j] != '\n') j++
                out += Tok(i, j, Tone.COMMENT)
                i = j
            }
            ch == '/' && i + 1 < end && code[i + 1] == '*' -> {
                val close = code.indexOf("*/", i + 2).let { if (it < 0 || it >= end) end else it + 2 }
                out += Tok(i, close, Tone.COMMENT)
                i = close
            }
            ch == '"' || ch == '\'' || ch == '`' -> {
                val j = endString(code, i, end, ch)
                out += Tok(i, j, Tone.STRING)
                i = j
            }
            ch.isDigit() -> {
                var j = i + 1
                while (j < end && (code[j].isDigit() || code[j] == '.')) j++
                out += Tok(i, j, Tone.NUMBER)
                i = j
            }
            ch.isLetter() || ch == '_' || ch == '$' -> {
                var j = i + 1
                while (j < end && (code[j].isLetterOrDigit() || code[j] == '_' || code[j] == '$')) j++
                val word = code.substring(i, j)
                out += Tok(i, j, if (word in jsKeywords) Tone.KEYWORD else Tone.PLAIN)
                i = j
            }
            else -> {
                out += Tok(i, i + 1, Tone.PLAIN)
                i++
            }
        }
    }
    return out
}

private fun scanCss(code: String, start: Int, end: Int): List<Tok> {
    val out = mutableListOf<Tok>()
    var i = start
    while (i < end) {
        when {
            code.startsWith("/*", i) -> {
                val close = code.indexOf("*/", i + 2).let { if (it < 0 || it >= end) end else it + 2 }
                out += Tok(i, close, Tone.COMMENT)
                i = close
            }
            code[i] == '"' || code[i] == '\'' -> {
                val j = endString(code, i, end, code[i])
                out += Tok(i, j, Tone.STRING)
                i = j
            }
            code[i] == '#' && i + 1 < end && code[i + 1].isHex() -> {
                var j = i + 1
                while (j < end && code[j].isHex()) j++
                out += Tok(i, j, Tone.NUMBER)
                i = j
            }
            code[i].isDigit() -> {
                var j = i + 1
                while (j < end && (code[j].isDigit() || code[j] == '.' || code[j] == '%')) j++
                out += Tok(i, j, Tone.NUMBER)
                i = j
            }
            code[i].isLetter() || code[i] == '-' || code[i] == '@' -> {
                var j = i + 1
                while (j < end && (code[j].isLetterOrDigit() || code[j] == '-' || code[j] == '_')) j++
                val word = code.substring(i, j).lowercase()
                out += Tok(i, j, if (word in cssKeywords || word.startsWith('@')) Tone.KEYWORD else Tone.PLAIN)
                i = j
            }
            else -> {
                out += Tok(i, i + 1, Tone.PLAIN)
                i++
            }
        }
    }
    return out
}

private fun scanJson(code: String): List<Tok> {
    val out = mutableListOf<Tok>()
    var i = 0
    while (i < code.length) {
        val ch = code[i]
        when {
            ch == '"' -> {
                val j = endString(code, i, code.length, '"')
                out += Tok(i, j, Tone.STRING)
                i = j
            }
            ch == '-' || ch.isDigit() -> {
                var j = i + 1
                while (j < code.length && (code[j].isDigit() || code[j] in ".eE+-")) j++
                out += Tok(i, j, Tone.NUMBER)
                i = j
            }
            code.startsWith("true", i) || code.startsWith("false", i) || code.startsWith("null", i) -> {
                val word = when {
                    code.startsWith("true", i) -> "true"
                    code.startsWith("false", i) -> "false"
                    else -> "null"
                }
                out += Tok(i, i + word.length, Tone.KEYWORD)
                i += word.length
            }
            else -> {
                out += Tok(i, i + 1, Tone.PLAIN)
                i++
            }
        }
    }
    return out
}

private fun endString(code: String, start: Int, end: Int, quote: Char): Int {
    var i = start + 1
    while (i < end) {
        when (code[i]) {
            '\\' -> i += 2
            quote -> return i + 1
            else -> i++
        }
    }
    return end
}

private fun Char.isHex(): Boolean = this in '0'..'9' || this in 'a'..'f' || this in 'A'..'F'

private fun merge(tokens: List<Tok>): List<Tok> {
    if (tokens.isEmpty()) return tokens
    val out = mutableListOf<Tok>()
    for (tok in tokens) {
        if (tok.start >= tok.end) continue
        val last = out.lastOrNull()
        if (last != null && last.tone == tok.tone && last.end == tok.start) {
            out[out.lastIndex] = last.copy(end = tok.end)
        } else {
            out += tok
        }
    }
    return out
}

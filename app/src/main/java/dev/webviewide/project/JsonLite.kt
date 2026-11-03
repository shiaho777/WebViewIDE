package dev.webviewide.project

class JsonLiteException(message: String) : IllegalArgumentException(message)

fun parseJson(text: String): Any? {
    val parser = JsonParser(text)
    val value = parser.parseValue()
    parser.skipWs()
    if (!parser.eof()) throw JsonLiteException("JSON 后面还有多余内容")
    return value
}

fun encodeJson(value: Any?): String = buildString { writeJson(value) }

private fun StringBuilder.writeJson(value: Any?) {
    when (value) {
        null -> append("null")
        is String -> append(jsonString(value))
        is Boolean -> append(if (value) "true" else "false")
        is Int -> append(value)
        is Long -> append(value)
        is Double -> {
            if (value.isNaN() || value.isInfinite()) throw JsonLiteException("不能写成 JSON 的数字")
            if (value % 1.0 == 0.0 && value <= Long.MAX_VALUE && value >= Long.MIN_VALUE) {
                append(value.toLong())
            } else {
                append(value)
            }
        }
        is Float -> writeJson(value.toDouble())
        is List<*> -> {
            append('[')
            value.forEachIndexed { index, item ->
                if (index > 0) append(',')
                writeJson(item)
            }
            append(']')
        }
        is Map<*, *> -> {
            append('{')
            var first = true
            value.forEach { (key, item) ->
                if (key !is String) throw JsonLiteException("JSON 对象的键必须是字符串")
                if (!first) append(',')
                first = false
                append(jsonString(key))
                append(':')
                writeJson(item)
            }
            append('}')
        }
        else -> throw JsonLiteException("不能写成 JSON：${value::class.java.simpleName}")
    }
}

fun jsonString(value: String): String = buildString {
    append('"')
    for (ch in value) {
        when (ch) {
            '\\' -> append("\\\\")
            '"' -> append("\\\"")
            '\n' -> append("\\n")
            '\r' -> append("\\r")
            '\t' -> append("\\t")
            else -> if (ch.code < 0x20) append("\\u%04x".format(ch.code)) else append(ch)
        }
    }
    append('"')
}

private class JsonParser(private val text: String) {
    private var i = 0

    fun eof(): Boolean = i >= text.length

    fun skipWs() {
        while (i < text.length && text[i].isWhitespace()) i++
    }

    fun parseValue(): Any? {
        skipWs()
        if (eof()) throw JsonLiteException("JSON 是空的")
        return when (val ch = text[i]) {
            '{' -> parseObject()
            '[' -> parseArray()
            '"' -> parseString()
            't' -> literal("true", true)
            'f' -> literal("false", false)
            'n' -> literal("null", null)
            else -> if (ch == '-' || ch.isDigit()) parseNumber() else throw JsonLiteException("读不懂这里的 JSON")
        }
    }

    private fun parseObject(): Map<String, Any?> {
        expect('{')
        val map = linkedMapOf<String, Any?>()
        skipWs()
        if (peek('}')) {
            i++
            return map
        }
        while (true) {
            skipWs()
            if (eof() || text[i] != '"') throw JsonLiteException("JSON 对象缺少键")
            val key = parseString()
            skipWs()
            expect(':')
            map[key] = parseValue()
            skipWs()
            when {
                peek(',') -> i++
                peek('}') -> {
                    i++
                    return map
                }
                else -> throw JsonLiteException("JSON 对象没有收好")
            }
        }
    }

    private fun parseArray(): List<Any?> {
        expect('[')
        val list = mutableListOf<Any?>()
        skipWs()
        if (peek(']')) {
            i++
            return list
        }
        while (true) {
            list += parseValue()
            skipWs()
            when {
                peek(',') -> i++
                peek(']') -> {
                    i++
                    return list
                }
                else -> throw JsonLiteException("JSON 数组没有收好")
            }
        }
    }

    private fun parseString(): String {
        expect('"')
        val out = StringBuilder()
        while (i < text.length) {
            when (val ch = text[i++]) {
                '"' -> return out.toString()
                '\\' -> {
                    if (i >= text.length) throw JsonLiteException("字符串转义被截断")
                    when (val esc = text[i++]) {
                        '"', '\\', '/' -> out.append(esc)
                        'b' -> out.append('\b')
                        'f' -> out.append('\u000c')
                        'n' -> out.append('\n')
                        'r' -> out.append('\r')
                        't' -> out.append('\t')
                        'u' -> {
                            if (i + 4 > text.length) throw JsonLiteException("\\u 转义被截断")
                            val hex = text.substring(i, i + 4)
                            out.append(hex.toInt(16).toChar())
                            i += 4
                        }
                        else -> throw JsonLiteException("不认识的转义")
                    }
                }
                else -> out.append(ch)
            }
        }
        throw JsonLiteException("字符串没有结束")
    }

    private fun parseNumber(): Number {
        val start = i
        if (peek('-')) i++
        if (i >= text.length || !text[i].isDigit()) throw JsonLiteException("数字不完整")
        if (text[i] == '0') {
            i++
        } else {
            while (i < text.length && text[i].isDigit()) i++
        }
        var decimal = false
        if (i < text.length && text[i] == '.') {
            decimal = true
            i++
            if (i >= text.length || !text[i].isDigit()) throw JsonLiteException("小数不完整")
            while (i < text.length && text[i].isDigit()) i++
        }
        if (i < text.length && (text[i] == 'e' || text[i] == 'E')) {
            decimal = true
            i++
            if (i < text.length && (text[i] == '+' || text[i] == '-')) i++
            if (i >= text.length || !text[i].isDigit()) throw JsonLiteException("指数不完整")
            while (i < text.length && text[i].isDigit()) i++
        }
        val raw = text.substring(start, i)
        if (!decimal) {
            raw.toLongOrNull()?.let { return it }
        }
        return raw.toDouble()
    }

    private fun literal(word: String, value: Any?): Any? {
        if (!text.startsWith(word, i)) throw JsonLiteException("读不懂这里的 JSON")
        i += word.length
        return value
    }

    private fun expect(ch: Char) {
        if (i >= text.length || text[i] != ch) throw JsonLiteException("期望 $ch")
        i++
    }

    private fun peek(ch: Char): Boolean = i < text.length && text[i] == ch
}

@Suppress("UNCHECKED_CAST")
fun Any?.jsonObject(): Map<String, Any?> = this as? Map<String, Any?> ?: emptyMap()

fun Map<String, Any?>.string(key: String, default: String = ""): String = this[key] as? String ?: default

fun Map<String, Any?>.boolean(key: String, default: Boolean): Boolean = this[key] as? Boolean ?: default

fun Map<String, Any?>.int(key: String, default: Int): Int = when (val value = this[key]) {
    is Int -> value
    is Long -> value.toInt()
    is Double -> value.toInt()
    else -> default
}

fun Map<String, Any?>.obj(key: String): Map<String, Any?> = this[key].jsonObject()

fun Map<String, Any?>.strings(key: String): List<String> =
    (this[key] as? List<*>)?.mapNotNull { it as? String }.orEmpty()

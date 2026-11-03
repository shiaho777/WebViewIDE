package dev.webviewide.project

object ProjectKinds {
    const val STATIC = "static"
    const val VUE = "vue"
    const val REACT = "react"
    const val NEXT = "next"
    const val NUXT = "nuxt"
    const val SVELTE = "svelte"
    const val ANGULAR = "angular"
    const val PREACT = "preact"
    const val SOLID = "solid"
    const val DOCS = "docs"
    const val SOURCE = "source"

    fun label(kind: String): String = when (kind) {
        VUE -> "Vue"
        REACT -> "React"
        NEXT -> "Next"
        NUXT -> "Nuxt"
        SVELTE -> "Svelte"
        ANGULAR -> "Angular"
        PREACT -> "Preact"
        SOLID -> "Solid"
        DOCS -> "文档站"
        SOURCE -> "源码"
        else -> "静态网页"
    }
}

object ProjectIds {
    fun packageSegment(id: String): String {
        val body = id.lowercase().filter { it in 'a'..'z' || it in '0'..'9' }.ifEmpty { "app" }.take(40)
        return if (body.first().isDigit()) "p$body" else body
    }

    fun freshId(existing: Set<String>, name: String): String {
        val base = packageSegment(name.filter { it.isLetterOrDigit() || it == ' ' || it == '-' }.replace(' ', '-'))
        var id = base
        var n = 2
        while (id in existing) {
            id = "$base$n"
            n++
        }
        return id
    }

    fun validPackageName(name: String): Boolean {
        val parts = name.trim().split('.')
        if (parts.size < 2) return false
        return parts.all { part ->
            part.isNotEmpty() && part.first().isLetter() && part.all { it.isLetterOrDigit() || it == '_' }
        }
    }

    fun profileName(id: String): String {
        val clean = id.filter { it.isLetterOrDigit() || it == '_' }
        return "p${clean.ifEmpty { "app" }}".take(32)
    }
}

data class Detection(
    val kind: String,
    val serveRoot: String,
    val entryFile: String,
    val spaFallback: Boolean,
    val runnable: Boolean,
    val summary: String,
)

data class TreeRow(
    val rel: String,
    val name: String,
    val depth: Int,
    val directory: Boolean,
    val open: Boolean,
)

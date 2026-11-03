package dev.webviewide.project

import java.io.File

object FileTreeIndex {
    fun rows(root: File, expanded: Set<String>): List<TreeRow> {
        if (!root.isDirectory) return emptyList()
        val out = mutableListOf<TreeRow>()
        fun walk(dir: File, rel: String, depth: Int) {
            val children = dir.listFiles()
                ?.filter { !ArchiveImport.shouldSkipDir(it.name) && it.name != ".DS_Store" }
                ?.sortedWith(compareBy({ !it.isDirectory }, { it.name.lowercase() }))
                .orEmpty()
            for (child in children) {
                val childRel = if (rel.isEmpty()) child.name else "$rel/${child.name}"
                val directory = child.isDirectory
                val open = directory && childRel in expanded
                out += TreeRow(childRel, child.name, depth, directory, open)
                if (open) walk(child, childRel, depth + 1)
            }
        }
        walk(root, "", 0)
        return out
    }
}

fun sourceKindFor(name: String): SourceKind = when (name.substringAfterLast('.', "").lowercase()) {
    "html", "htm", "xml", "svg", "vue" -> SourceKind.HTML
    "css" -> SourceKind.CSS
    "js", "mjs", "cjs", "jsx", "ts", "tsx" -> SourceKind.JS
    "json", "webmanifest" -> SourceKind.JSON
    else -> SourceKind.PLAIN
}

fun isRasterImage(name: String): Boolean = name.substringAfterLast('.', "").lowercase() in setOf(
    "png", "jpg", "jpeg", "gif", "webp", "bmp",
)

enum class SourceKind { HTML, CSS, JS, JSON, PLAIN }

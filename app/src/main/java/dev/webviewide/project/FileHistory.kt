package dev.webviewide.project

import java.io.File
import java.security.MessageDigest

/**
 * Local per-file version history: full-text snapshots under
 * filesDir/history/<projectId>/<pathhash>/<timestamp>, with an index.json per
 * file. No Git, no diffing — small web files are cheap to store whole.
 * Rolling cap of [MAX_VERSIONS] per file keeps storage bounded.
 */
object FileHistory {
    const val MAX_VERSIONS = 20

    data class Entry(val ts: Long, val rel: String)

    private fun root(base: File, projectId: String) = File(base, "history/$projectId").apply { mkdirs() }

    fun hashPath(rel: String): String =
        MessageDigest.getInstance("SHA-256").digest(rel.toByteArray(Charsets.UTF_8))
            .joinToString("") { "%02x".format(it) }.take(16)

    private fun dirFor(base: File, projectId: String, rel: String) =
        File(root(base, projectId), hashPath(rel)).apply { mkdirs() }

    /** Records a snapshot; skips no-op saves identical to the newest version. */
    fun record(base: File, projectId: String, rel: String, text: String, ts: Long = System.currentTimeMillis()) {
        val dir = dirFor(base, projectId, rel)
        val entries = list(base, projectId, rel)
        if (entries.isNotEmpty()) {
            val newest = File(dir, entries.first().ts.toString())
            if (newest.isFile && newest.readText() == text) return
        }
        ProjectStore.write(File(dir, ts.toString()), text)
        val updated = (listOf(Entry(ts, rel)) + entries).take(MAX_VERSIONS)
        // Prune snapshots that fell out of the capped index.
        dir.listFiles()?.forEach { f ->
            val t = f.name.toLongOrNull()
            if (t != null && updated.none { it.ts == t }) f.delete()
        }
        writeIndex(dir, updated)
    }

    fun list(base: File, projectId: String, rel: String): List<Entry> {
        val dir = File(root(base, projectId), hashPath(rel))
        val index = File(dir, "index.json")
        if (!index.isFile) return emptyList()
        val rows = runCatching {
            @Suppress("UNCHECKED_CAST")
            (parseJson(index.readText()) as? List<Map<String, Any?>>).orEmpty()
        }.getOrNull() ?: return emptyList()
        return rows.mapNotNull { m ->
            val ts = (m["ts"] as? Number)?.toLong() ?: return@mapNotNull null
            Entry(ts, m.string("rel", rel))
        }.sortedByDescending { it.ts }
    }

    fun read(base: File, projectId: String, rel: String, ts: Long): String? {
        val f = File(dirFor(base, projectId, rel), ts.toString())
        return if (f.isFile) f.readText() else null
    }

    private fun writeIndex(dir: File, entries: List<Entry>) {
        val rows = entries.map { mapOf("ts" to it.ts, "rel" to it.rel) }
        ProjectStore.write(File(dir, "index.json"), encodeJson(rows))
    }
}
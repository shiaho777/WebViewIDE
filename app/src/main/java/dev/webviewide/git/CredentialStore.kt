package dev.webviewide.git

import dev.webviewide.project.encodeJson
import dev.webviewide.project.jsonObject
import dev.webviewide.project.parseJson
import dev.webviewide.project.string
import java.io.File

/**
 * Per-host HTTPS credentials (Gitee/GitHub/GitLab...). Tokens are sealed before
 * they touch disk; [seal]/[unseal] are injected so JVM tests run without Keystore.
 */
class CredentialStore(
    private val dir: File,
    private val seal: (String) -> String,
    private val unseal: (String) -> String,
) {
    data class Credential(val host: String, val user: String, val token: String)

    private val index = File(dir, "credentials.json")

    fun hosts(): List<String> = readRaw().keys.sorted()

    /** Null when absent or unreadable; a broken entry is dropped, never crashes. */
    fun get(host: String): Credential? {
        val entry = readRaw()[normalizeHost(host)] ?: return null
        return try {
            Credential(normalizeHost(host), entry.string("user"), unseal(entry.string("token")))
        } catch (_: Exception) {
            remove(host)
            null
        }
    }

    fun put(host: String, user: String, token: String) {
        val map = readRaw().toMutableMap()
        map[normalizeHost(host)] = mapOf("user" to user, "token" to seal(token))
        write(map)
    }

    fun remove(host: String) {
        val map = readRaw().toMutableMap()
        map.remove(normalizeHost(host))
        write(map)
    }

    private fun readRaw(): Map<String, Map<String, Any?>> {
        if (!index.exists()) return emptyMap()
        return try {
            parseJson(index.readText()).jsonObject().mapValues { it.value.jsonObject() }
        } catch (_: Exception) {
            emptyMap()
        }
    }

    private fun write(map: Map<String, Map<String, Any?>>) {
        if (!dir.exists()) dir.mkdirs()
        index.writeText(encodeJson(map))
    }

    companion object {
        /** "https://Gitee.com/" -> "gitee.com"; keeps an explicit port. */
        fun normalizeHost(input: String): String =
            input.trim().lowercase()
                .removePrefix("https://").removePrefix("http://").removePrefix("git://")
                .substringBefore('/')
    }
}
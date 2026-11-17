package dev.webviewide.build

import java.io.File
import kotlin.io.path.createTempDirectory
import org.junit.Assert.assertArrayEquals
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test

class BuildNetTest {
    @Test fun whitelistAllowsOnlyRegistryDomains() {
        assertTrue(BuildNet.isAllowed("https://registry.npmjs.org/react"))
        assertTrue(BuildNet.isAllowed("https://registry.npmmirror.com/react"))
        assertTrue(BuildNet.isAllowed("https://cdn.jsdelivr.net/npm/esbuild-wasm/x.wasm"))
        assertFalse(BuildNet.isAllowed("https://evil.example.com/x"))
        assertFalse(BuildNet.isAllowed("https://registry.npmjs.org.evil.com/x"))
        assertFalse(BuildNet.isAllowed("not a url"))
        assertFalse(BuildNet.isAllowed("file:///etc/passwd"))
    }

    @Test fun sha512MatchesKnownVector() {
        // sha512("abc")
        val expect = "ddaf35a193617abacc417349ae20413112e6fa4e89a97ea20a9eeee64b55d39a" +
            "2192992a274fc1a836ba3c23a3feebbd454d4423643ce80e2a9ac94fa54ca49f"
        assertEquals(expect, BuildNet.sha512Hex("abc".toByteArray()))
    }

    @Test fun tarballCacheRoundTripAndRejectsCorrupt() {
        val base = createTempDirectory("net").toFile()
        try {
            val bytes = "tarball-bytes".toByteArray()
            val integrity = BuildNet.sha512Hex(bytes)
            assertNull(BuildNet.readTarballCache(base, integrity))
            BuildNet.writeTarballCache(base, integrity, bytes)
            assertArrayEquals(bytes, BuildNet.readTarballCache(base, integrity))
            // Corrupt the cached file -> digest mismatch -> rejected.
            BuildNet.tarballCacheFile(base, integrity).writeBytes("tampered".toByteArray())
            assertNull(BuildNet.readTarballCache(base, integrity))
            // Writing with wrong integrity is a no-op.
            BuildNet.writeTarballCache(base, "deadbeef", bytes)
            assertFalse(BuildNet.tarballCacheFile(base, "deadbeef").exists())
        } finally {
            base.deleteRecursively()
        }
    }

    @Test fun metaCacheTtlAndEtag() {
        val base = createTempDirectory("net2").toFile()
        try {
            val url = "https://registry.npmjs.org/react"
            val body = """{"versions":{}}""".toByteArray()
            assertNull(BuildNet.readMetaCache(base, url, now = 1000))
            BuildNet.writeMetaCache(base, url, body, "etag-1", now = 1000)
            val hit = BuildNet.readMetaCache(base, url, now = 1000 + BuildNet.META_TTL_MS - 1)
            assertArrayEquals(body, hit?.first)
            assertEquals("etag-1", hit?.second)
            // Expired.
            assertNull(BuildNet.readMetaCache(base, url, now = 1000 + BuildNet.META_TTL_MS + 1))
        } finally {
            base.deleteRecursively()
        }
    }

    @Test fun fetchRejectsDisallowedDomain() {
        val refused = runCatching { BuildNet.fetch("https://evil.example.com/x") }
        assertTrue(refused.isFailure)
    }
}
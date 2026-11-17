package dev.webviewide.build

import java.io.File
import kotlin.io.path.createTempDirectory
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test

class BuildFsTest {
    @Test fun writesAreConfinedToRoot() {
        val root = createTempDirectory("fs").toFile()
        try {
            assertTrue(BuildFs.writeText(root, "node_modules/a/index.js", "x"))
            assertTrue(BuildFs.exists(root, "node_modules/a/index.js"))
            assertEquals("x", BuildFs.readText(root, "node_modules/a/index.js"))
            // Traversal rejected.
            assertFalse(BuildFs.writeText(root, "../escape.js", "x"))
            assertFalse(BuildFs.writeText(root, "a/../../escape.js", "x"))
            assertNull(BuildFs.resolve(root, "../escape.js"))
            assertFalse(File(root.parentFile, "escape.js").exists())
        } finally {
            root.deleteRecursively()
        }
    }

    @Test fun binaryWriteIsAtomicAndReadable() {
        val root = createTempDirectory("fs2").toFile()
        try {
            val bytes = byteArrayOf(0, 1, 2, 3, 255.toByte())
            assertTrue(BuildFs.writeBytes(root, "dist/app.wasm", bytes))
            val target = File(root, "dist/app.wasm")
            assertTrue(target.isFile)
            assertEquals(bytes.toList(), target.readBytes().toList())
            // No leftover tmp file.
            assertFalse(File(root, "dist/.app.wasm.tmp").exists())
        } finally {
            root.deleteRecursively()
        }
    }

    @Test fun readMissingReturnsNull() {
        val root = createTempDirectory("fs3").toFile()
        try {
            assertNull(BuildFs.readText(root, "nope.js"))
            assertFalse(BuildFs.exists(root, "nope.js"))
        } finally {
            root.deleteRecursively()
        }
    }

    @Test fun emptyPathRejected() {
        val root = createTempDirectory("fs4").toFile()
        try {
            assertNull(BuildFs.resolve(root, ""))
            assertFalse(BuildFs.writeText(root, "", "x"))
        } finally {
            root.deleteRecursively()
        }
    }
}
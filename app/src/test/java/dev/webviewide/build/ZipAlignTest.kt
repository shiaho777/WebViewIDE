package dev.webviewide.build

import java.io.File
import java.util.zip.CRC32
import java.util.zip.ZipEntry
import java.util.zip.ZipFile
import java.util.zip.ZipOutputStream
import kotlin.io.path.createTempDirectory
import org.junit.Assert.assertArrayEquals
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class ZipAlignTest {
    @Test fun storedEntriesEndUpAlignedAndIntact() {
        val dir = createTempDirectory("align").toFile()
        try {
            val input = File(dir, "in.zip")
            // Sizes chosen so unaligned data offsets hit every remainder mod 4.
            val payloads = (0..11).associate { i ->
                "entry-$i.bin" to ByteArray(100 + i * 7) { (it % 251).toByte() }
            }
            ZipOutputStream(input.outputStream()).use { zip ->
                payloads.forEach { (name, data) ->
                    val e = ZipEntry(name)
                    e.method = ZipEntry.STORED
                    e.size = data.size.toLong()
                    e.compressedSize = data.size.toLong()
                    e.crc = CRC32().apply { update(data) }.value
                    zip.putNextEntry(e)
                    zip.write(data)
                    zip.closeEntry()
                }
                val deflated = ZipEntry("text.txt")
                zip.putNextEntry(deflated)
                zip.write("hello ".repeat(500).toByteArray())
                zip.closeEntry()
            }
            val output = File(dir, "out.zip")
            ZipAlign.align(input, output)
            assertTrue(ZipAlign.verify(output, 4))
            ZipFile(output).use { zip ->
                payloads.forEach { (name, data) ->
                    val e = zip.getEntry(name)
                    assertEquals(ZipEntry.STORED, e.method)
                    assertArrayEquals(data, zip.getInputStream(e).use { it.readBytes() })
                }
                assertEquals(
                    "hello ".repeat(500),
                    zip.getInputStream(zip.getEntry("text.txt")).use { String(it.readBytes()) },
                )
            }
            // Idempotent: aligning an aligned file keeps it aligned.
            val again = File(dir, "again.zip")
            ZipAlign.align(output, again)
            assertTrue(ZipAlign.verify(again, 4))
        } finally {
            dir.deleteRecursively()
        }
    }

    @Test fun verifyRejectsMisalignedStoredData() {
        val dir = createTempDirectory("misalign").toFile()
        try {
            val input = File(dir, "in.zip")
            ZipOutputStream(input.outputStream()).use { zip ->
                // First entry name length 1 => data offset 30+1=31, not aligned.
                val data = ByteArray(64) { it.toByte() }
                val e = ZipEntry("a")
                e.method = ZipEntry.STORED
                e.size = data.size.toLong()
                e.compressedSize = data.size.toLong()
                e.crc = CRC32().apply { update(data) }.value
                zip.putNextEntry(e)
                zip.write(data)
                zip.closeEntry()
            }
            assertTrue(!ZipAlign.verify(input, 4))
        } finally {
            dir.deleteRecursively()
        }
    }
}
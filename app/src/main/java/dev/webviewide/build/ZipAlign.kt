package dev.webviewide.build

import java.io.File
import java.io.RandomAccessFile
import java.util.zip.ZipEntry
import java.util.zip.ZipFile
import java.util.zip.ZipOutputStream

/**
 * zipalign-equivalent 4-byte alignment for STORED (uncompressed) entries,
 * pure JVM so it runs on-device without NDK or external binaries.
 *
 * Runs BEFORE signing: padding lives in each entry's extra field, which is
 * covered by the v2/v3 signature, so aligning first and signing second keeps
 * the signature valid. Deflated entries are copied as-is (zipalign only
 * aligns uncompressed data).
 */
object ZipAlign {
    private const val PAD_ID = 0xd935 // Android's alignment padding header id

    private class CountingStream(private val delegate: java.io.OutputStream) : java.io.OutputStream() {
        var count: Long = 0
            private set

        override fun write(b: Int) {
            delegate.write(b)
            count++
        }

        override fun write(b: ByteArray, off: Int, len: Int) {
            delegate.write(b, off, len)
            count += len
        }

        override fun flush() = delegate.flush()
        override fun close() = delegate.close()
    }

    fun align(input: File, output: File, alignment: Int = 4) {
        require(alignment > 0 && alignment and (alignment - 1) == 0) { "alignment must be a power of two" }
        ZipFile(input).use { zip ->
            val counting = CountingStream(output.outputStream().buffered())
            ZipOutputStream(counting).use { out ->
                for (entry in zip.entries()) {
                    val copy = ZipEntry(entry.name)
                    copy.time = entry.time
                    entry.comment?.let { copy.comment = it }
                    if (entry.method == ZipEntry.STORED) {
                        val data = zip.getInputStream(entry).use { it.readBytes() }
                        copy.method = ZipEntry.STORED
                        copy.size = data.size.toLong()
                        copy.compressedSize = data.size.toLong()
                        copy.crc = entry.crc
                        // Predict the local-header offset: bytes written so far
                        // plus the fixed header and name length.
                        val nameBytes = entry.name.toByteArray(Charsets.UTF_8)
                        val baseExtra = stripPadding(entry.extra)
                        val dataOffset = counting.count + 30 + nameBytes.size + baseExtra.size
                        val pad = ((alignment - (dataOffset % alignment)) % alignment).toInt()
                        copy.extra = baseExtra + padding(pad)
                        out.putNextEntry(copy)
                        out.write(data)
                    } else {
                        copy.method = ZipEntry.DEFLATED
                        entry.extra?.let { copy.extra = stripPadding(it) }
                        out.putNextEntry(copy)
                        zip.getInputStream(entry).use { it.copyTo(out) }
                    }
                    out.closeEntry()
                }
            }
        }
    }

    /** Verifies every STORED entry's data starts at a multiple of [alignment]. */
    fun verify(file: File, alignment: Int = 4): Boolean {
        RandomAccessFile(file, "r").use { raf ->
            ZipFile(file).use { zip ->
                for (entry in zip.entries()) {
                    if (entry.method != ZipEntry.STORED) continue
                    val offset = localDataOffset(raf, entry) ?: return false
                    if (offset % alignment != 0L) return false
                }
            }
        }
        return true
    }

    private fun localDataOffset(raf: RandomAccessFile, entry: ZipEntry): Long? {
        // ZipEntry doesn't expose the local header offset; scan central directory.
        val size = raf.length()
        // Find End Of Central Directory (comment up to 65535 bytes).
        val tailStart = maxOf(0L, size - 22 - 65535)
        val tail = ByteArray((size - tailStart).toInt())
        raf.seek(tailStart)
        raf.readFully(tail)
        var eocd = -1
        for (i in tail.size - 22 downTo 0) {
            if (tail[i] == 0x50.toByte() && tail[i + 1] == 0x4b.toByte() &&
                tail[i + 2] == 0x05.toByte() && tail[i + 3] == 0x06.toByte()
            ) {
                eocd = i
                break
            }
        }
        if (eocd < 0) return null
        fun u16(at: Int): Int = (tail[at].toInt() and 0xff) or ((tail[at + 1].toInt() and 0xff) shl 8)
        fun u32(at: Int): Long = (tail[at].toInt() and 0xff).toLong() or
            ((tail[at + 1].toInt() and 0xff).toLong() shl 8) or
            ((tail[at + 2].toInt() and 0xff).toLong() shl 16) or
            ((tail[at + 3].toInt() and 0xff).toLong() shl 24)
        var cd = u32(eocd + 16)
        val count = u16(eocd + 10)
        val header = ByteArray(46)
        repeat(count) {
            raf.seek(cd)
            raf.readFully(header)
            if (header[0] != 0x50.toByte() || header[1] != 0x4b.toByte()) return null
            fun h16(at: Int): Int = (header[at].toInt() and 0xff) or ((header[at + 1].toInt() and 0xff) shl 8)
            fun h32(at: Int): Long = (header[at].toInt() and 0xff).toLong() or
                ((header[at + 1].toInt() and 0xff).toLong() shl 8) or
                ((header[at + 2].toInt() and 0xff).toLong() shl 16) or
                ((header[at + 3].toInt() and 0xff).toLong() shl 24)
            val nameLen = h16(28)
            val extraLen = h16(30)
            val commentLen = h16(32)
            val nameBytes = ByteArray(nameLen)
            raf.readFully(nameBytes)
            val name = String(nameBytes, Charsets.UTF_8)
            if (name == entry.name) {
                val local = h32(42)
                raf.seek(local)
                val lh = ByteArray(30)
                raf.readFully(lh)
                val lName = (lh[26].toInt() and 0xff) or ((lh[27].toInt() and 0xff) shl 8)
                val lExtra = (lh[28].toInt() and 0xff) or ((lh[29].toInt() and 0xff) shl 8)
                return local + 30 + lName + lExtra
            }
            cd += 46 + nameLen + extraLen + commentLen
        }
        return null
    }

    private fun stripPadding(extra: ByteArray?): ByteArray {
        if (extra == null || extra.isEmpty()) return ByteArray(0)
        val out = java.io.ByteArrayOutputStream()
        var i = 0
        while (i + 4 <= extra.size) {
            val id = (extra[i].toInt() and 0xff) or ((extra[i + 1].toInt() and 0xff) shl 8)
            val len = (extra[i + 2].toInt() and 0xff) or ((extra[i + 3].toInt() and 0xff) shl 8)
            if (i + 4 + len > extra.size) break
            if (id != PAD_ID) out.write(extra, i, 4 + len)
            i += 4 + len
        }
        return out.toByteArray()
    }

    private fun padding(pad: Int): ByteArray {
        // A padding block is id(2)+len(2)+zeros, so expressible sizes are 0 or >=4.
        // For pad in 1..3 combine a 4-byte empty block with a (pad+4)-byte block:
        // total = pad + 8 ≡ pad (mod 4), keeping the data offset aligned.
        return when {
            pad == 0 -> ByteArray(0)
            pad < 4 -> block(0) + block(pad)
            else -> block(pad - 4)
        }
    }

    private fun block(payload: Int): ByteArray {
        val out = ByteArray(4 + payload)
        out[0] = (PAD_ID and 0xff).toByte()
        out[1] = ((PAD_ID shr 8) and 0xff).toByte()
        out[2] = (payload and 0xff).toByte()
        out[3] = ((payload shr 8) and 0xff).toByte()
        return out
    }
}
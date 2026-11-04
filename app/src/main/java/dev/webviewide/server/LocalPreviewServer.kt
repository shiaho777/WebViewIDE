package dev.webviewide.server

import java.io.ByteArrayOutputStream
import java.io.File
import java.io.IOException
import java.io.OutputStream
import java.net.Inet4Address
import java.net.InetAddress
import java.net.InetSocketAddress
import java.net.NetworkInterface
import java.net.ServerSocket
import java.net.Socket
import java.util.concurrent.CopyOnWriteArrayList
import java.util.concurrent.Executors
import java.util.concurrent.atomic.AtomicBoolean
import java.util.concurrent.atomic.AtomicInteger

class LocalPreviewServer {
    @Volatile var root: File = File(".")
    @Volatile var spaFallback: Boolean = false
    @Volatile var liveReload: Boolean = true
    @Volatile var entryFile: String = "index.html"
    @Volatile var basePrefix: String = ""

    private val running = AtomicBoolean(false)
    private val generation = AtomicInteger()
    private val streams = CopyOnWriteArrayList<OutputStream>()
    private var socket: ServerSocket? = null
    private var pool = newPool()

    @Synchronized
    fun start(preferredPort: Int, bindAll: Boolean): Int {
        stop()
        pool = newPool()
        val bound = bind(preferredPort, bindAll)
        socket = bound
        running.set(true)
        pool.execute {
            while (running.get()) {
                val client = try {
                    bound.accept()
                } catch (_: IOException) {
                    break
                }
                pool.execute { handle(client) }
            }
        }
        return bound.localPort
    }

    @Synchronized
    fun stop() {
        running.set(false)
        try {
            socket?.close()
        } catch (_: IOException) {
        }
        socket = null
        for (stream in streams) {
            runCatching { stream.close() }
        }
        streams.clear()
        pool.shutdownNow()
    }

    fun reload() {
        val payload = "data: ${generation.incrementAndGet()}\n\n".toByteArray()
        val dead = mutableListOf<OutputStream>()
        for (stream in streams) {
            try {
                stream.write(payload)
                stream.flush()
            } catch (_: IOException) {
                dead += stream
            }
        }
        streams.removeAll(dead.toSet())
    }

    private fun handle(client: Socket) {
        var keep = false
        try {
            client.soTimeout = 8_000
            val head = readHead(client)
            val request = head.lineSequence().firstOrNull().orEmpty()
            val parts = request.split(' ')
            if (parts.size < 2) {
                send(client, 400, "Bad Request", emptyList(), "打不开这个地址".toByteArray())
                return
            }
            val method = parts[0]
            if (method != "GET" && method != "HEAD") {
                send(client, 405, "Method Not Allowed", listOf("Allow" to "GET, HEAD"), ByteArray(0))
                return
            }
            when (val hit = SiteFiles.resolve(root, parts[1], spaFallback, entryFile, basePrefix)) {
                SiteHit.Reload -> {
                    keep = true
                    serveEvents(client)
                }
                is SiteHit.Error -> send(client, hit.code, if (hit.code == 400) "Bad Request" else "Not Found", emptyList(), ByteArray(0), headOnly = method == "HEAD")
                is SiteHit.FileHit -> serveFile(client, hit, method == "HEAD", rangeHeader(head))
            }
        } catch (_: IOException) {
        } finally {
            if (!keep) runCatching { client.close() }
        }
    }

    private fun serveFile(client: Socket, hit: SiteHit.FileHit, headOnly: Boolean, range: LongRange?) {
        var bytes = hit.file.readBytes()
        if (hit.html && liveReload && !bytes.decodeToString().contains("data-webviewide=\"reload\"")) {
            // Work on the decoded text: a character index is not a byte index
            // for UTF-8 pages, and slicing the byte array by character position
            // corrupts any non-ASCII document.
            val text = bytes.decodeToString()
            val at = text.lowercase().lastIndexOf("</body>")
            val injected = if (at >= 0) {
                text.substring(0, at) + RELOAD_SCRIPT + text.substring(at)
            } else {
                text + RELOAD_SCRIPT
            }
            bytes = injected.toByteArray(Charsets.UTF_8)
        }
        val mime = SiteFiles.mime(hit.file.name)
        val total = bytes.size.toLong()
        if (range != null && !hit.html) {
            val start = range.first.coerceAtLeast(0)
            val end = range.last.coerceAtMost(total - 1)
            if (start <= end && start < total) {
                val slice = bytes.copyOfRange(start.toInt(), (end + 1).toInt())
                send(
                    client,
                    206,
                    "Partial Content",
                    listOf(
                        "Content-Type" to mime,
                        "Content-Length" to slice.size.toString(),
                        "Content-Range" to "bytes $start-$end/$total",
                        "Accept-Ranges" to "bytes",
                        "Cache-Control" to "no-store",
                    ),
                    if (headOnly) null else slice,
                )
                return
            }
        }
        send(
            client,
            200,
            "OK",
            listOf(
                "Content-Type" to mime,
                "Content-Length" to bytes.size.toString(),
                "Accept-Ranges" to "bytes",
                "Cache-Control" to "no-store",
            ),
            if (headOnly) null else bytes,
        )
    }

    private fun serveEvents(client: Socket) {
        client.soTimeout = 0
        val out = client.getOutputStream()
        val header = "HTTP/1.1 200 OK\r\nContent-Type: text/event-stream\r\nCache-Control: no-store\r\nConnection: keep-alive\r\n\r\n: ok\n\n"
        out.write(header.toByteArray(Charsets.ISO_8859_1))
        out.flush()
        streams += out
    }

    private fun send(
        client: Socket,
        status: Int,
        reason: String,
        headers: List<Pair<String, String>>,
        body: ByteArray?,
        headOnly: Boolean = false,
    ) {
        val head = buildString {
            append("HTTP/1.1 $status $reason\r\n")
            headers.forEach { append(it.first).append(": ").append(it.second).append("\r\n") }
            append("Connection: close\r\n\r\n")
        }
        val out = client.getOutputStream()
        out.write(head.toByteArray(Charsets.ISO_8859_1))
        if (!headOnly && body != null) out.write(body)
        out.flush()
    }

    private fun readHead(client: Socket): String {
        val input = client.getInputStream()
        val buf = ByteArrayOutputStream()
        while (buf.size() < 16_384) {
            val b = input.read()
            if (b < 0) break
            buf.write(b)
            val arr = buf.toByteArray()
            val n = arr.size
            if (n >= 4 && arr[n - 4] == '\r'.code.toByte() && arr[n - 3] == '\n'.code.toByte() &&
                arr[n - 2] == '\r'.code.toByte() && arr[n - 1] == '\n'.code.toByte()
            ) {
                break
            }
        }
        return buf.toString(Charsets.ISO_8859_1)
    }

    private fun rangeHeader(head: String): LongRange? {
        val line = head.lineSequence().firstOrNull { it.startsWith("Range:", ignoreCase = true) } ?: return null
        val value = line.substringAfter(':').trim()
        if (!value.startsWith("bytes=")) return null
        val span = value.removePrefix("bytes=").substringBefore(',')
        val start = span.substringBefore('-').toLongOrNull() ?: return null
        val endRaw = span.substringAfter('-', "")
        val end = if (endRaw.isEmpty()) Long.MAX_VALUE else endRaw.toLongOrNull() ?: return null
        return start..end
    }

    private fun bind(preferred: Int, bindAll: Boolean): ServerSocket {
        val host = InetAddress.getByName(if (bindAll) "0.0.0.0" else "127.0.0.1")
        var port = preferred.coerceIn(1024, 65535)
        repeat(30) {
            try {
                return ServerSocket().apply {
                    reuseAddress = true
                    bind(InetSocketAddress(host, port))
                }
            } catch (_: IOException) {
                port = if (port >= 65535) 1024 else port + 1
            }
        }
        return ServerSocket().apply { bind(InetSocketAddress(host, 0)) }
    }

    private fun newPool() = Executors.newCachedThreadPool { runnable ->
        Thread(runnable, "preview-http").apply { isDaemon = true }
    }

    companion object {
        private val RELOAD_SCRIPT =
            """<script data-webviewide="reload">(function(){try{var es=new EventSource("/__webviewide/reload");es.onmessage=function(){location.reload()}}catch(e){}})();</script>"""

        fun lanAddress(): String? = runCatching {
            NetworkInterface.getNetworkInterfaces().toList()
                .flatMap { nic -> nic.inetAddresses.toList() }
                .firstOrNull { it is Inet4Address && it.isSiteLocalAddress && !it.isLoopbackAddress }
                ?.hostAddress
        }.getOrNull()
    }
}

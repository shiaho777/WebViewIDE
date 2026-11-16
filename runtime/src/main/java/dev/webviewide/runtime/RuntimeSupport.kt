package dev.webviewide.runtime

import java.net.URLDecoder

/** Pure navigation/security helpers, kept Android-free so they can be unit-tested. */
internal object RuntimeNavigation {
    const val ASSET_HOST = "appassets.androidplatform.net"

    /** Main-frame navigations away from the asset host belong to other apps. */
    fun shouldOpenExternally(scheme: String?, host: String?, isForMainFrame: Boolean): Boolean {
        if (!isForMainFrame) return false
        return host != ASSET_HOST
    }
}

internal object RuntimePaths {
    fun clean(raw: String): String? {
        val decoded = runCatching { URLDecoder.decode(raw, Charsets.UTF_8.name()) }.getOrNull() ?: return null
        val parts = decoded.replace('\\', '/').split('/').filter { it.isNotEmpty() && it != "." }
        val stack = ArrayDeque<String>()
        for (part in parts) {
            if (part == ".." || part.contains('\u0000')) {
                if (part == ".." && stack.isNotEmpty()) stack.removeLast() else return null
            } else {
                stack.addLast(part)
            }
        }
        return stack.joinToString("/")
    }
}

internal object RuntimeErrors {
    fun page(failedUrl: String): String {
        val safe = failedUrl
            .replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace("\"", "&quot;")
        return """
            <!DOCTYPE html><html lang="zh-CN"><head><meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
            body{font-family:sans-serif;display:flex;min-height:90vh;align-items:center;justify-content:center;margin:0;background:#fafafa;color:#333}
            .card{text-align:center;padding:24px;max-width:320px}
            h1{font-size:20px}p{font-size:14px;color:#777;word-break:break-all}
            button{margin-top:16px;padding:10px 28px;font-size:15px;border:0;border-radius:20px;background:#185fa5;color:#fff}
            </style></head>
            <body><div class="card"><h1>页面加载失败</h1><p>$safe</p>
            <p>请检查网络后重试。</p>
            <button onclick="location.replace('https://${RuntimeNavigation.ASSET_HOST}/www/')">重新加载</button>
            </div></body></html>
        """.trimIndent()
    }
}
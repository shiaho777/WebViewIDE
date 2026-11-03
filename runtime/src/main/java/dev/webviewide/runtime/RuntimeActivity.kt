package dev.webviewide.runtime

import android.Manifest
import android.app.Activity
import android.app.AlertDialog
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.view.View
import android.view.ViewGroup
import android.webkit.CookieManager
import android.webkit.GeolocationPermissions
import android.webkit.JsPromptResult
import android.webkit.JsResult
import android.webkit.PermissionRequest
import android.webkit.ValueCallback
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.EditText
import android.widget.FrameLayout
import android.widget.Toast
import androidx.webkit.WebSettingsCompat
import androidx.webkit.WebViewAssetLoader
import androidx.webkit.WebViewFeature
import java.io.ByteArrayOutputStream
import java.io.File
import java.io.InputStream
import java.net.URLDecoder
import kotlin.concurrent.thread
import org.json.JSONObject

class RuntimeActivity : Activity() {
    private var web: WebView? = null
    private var root: FrameLayout? = null
    private var customView: View? = null
    private var customCallback: WebChromeClient.CustomViewCallback? = null
    private var pendingFile: ValueCallback<Array<Uri>>? = null
    private var pendingPermission: ((Boolean) -> Unit)? = null
    private var pageConfig = JSONObject()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val config = readConfig()
        pageConfig = config.web
        val loader = WebViewAssetLoader.Builder()
            .addPathHandler("/www/", WwwHandler(this, config.entry, config.spa))
            .build()
        val frame = FrameLayout(this)
        val view = WebView(this)
        view.layoutParams = FrameLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.MATCH_PARENT,
        )
        applySettings(view, pageConfig)
        view.webChromeClient = RuntimeChrome()
        view.webViewClient = object : WebViewClient() {
            override fun shouldInterceptRequest(
                view: WebView,
                request: WebResourceRequest,
            ): WebResourceResponse? = loader.shouldInterceptRequest(request.url)
        }
        view.setDownloadListener { url, _, disposition, mime, _ ->
            if (!pageConfig.optBoolean("downloads", true)) return@setDownloadListener
            saveDownload(url, fileName(url, disposition), mime)
        }
        view.setBackgroundColor(android.graphics.Color.WHITE)
        frame.addView(view)
        root = frame
        web = view
        setContentView(frame)
        val address = "https://appassets.androidplatform.net/www/" + Uri.encode(config.entry, "/")
        view.loadUrl(address)
    }

    @Deprecated("Activity result API is not on the runtime classpath")
    @Suppress("DEPRECATION")
    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode != REQ_FILE) return
        val callback = pendingFile
        pendingFile = null
        callback?.onReceiveValue(WebChromeClient.FileChooserParams.parseResult(resultCode, data))
    }

    @Deprecated("Permission API is not on the runtime classpath")
    @Suppress("DEPRECATION")
    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<out String>,
        grantResults: IntArray,
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        if (requestCode != REQ_PERM) return
        val done = pendingPermission
        pendingPermission = null
        val granted = grantResults.isNotEmpty() && grantResults.all { it == PackageManager.PERMISSION_GRANTED }
        done?.invoke(granted)
    }

    @Deprecated("Use the system back callback")
    @Suppress("DEPRECATION")
    override fun onBackPressed() {
        if (customView != null) {
            customCallback?.onCustomViewHidden()
            return
        }
        val view = web
        if (view != null && view.canGoBack()) view.goBack() else super.onBackPressed()
    }

    override fun onDestroy() {
        pendingFile?.onReceiveValue(null)
        pendingFile = null
        pendingPermission?.invoke(false)
        pendingPermission = null
        web?.destroy()
        web = null
        super.onDestroy()
    }

    private fun ensure(permissions: Array<String>, done: (Boolean) -> Unit) {
        val missing = permissions.filter {
            checkSelfPermission(it) != PackageManager.PERMISSION_GRANTED
        }
        if (missing.isEmpty()) {
            done(true)
            return
        }
        pendingPermission?.invoke(false)
        pendingPermission = done
        @Suppress("DEPRECATION")
        requestPermissions(missing.toTypedArray(), REQ_PERM)
    }

    private fun saveDownload(url: String, name: String, mime: String) {
        thread {
            val saved = runCatching {
                val bytes = if (url.startsWith("https://appassets.androidplatform.net/www/")) {
                    val rel = url.removePrefix("https://appassets.androidplatform.net/www/").substringBefore('?')
                    val clean = cleanPath(rel) ?: error("路径不对")
                    assets.open("www/$clean").use { readLimited(it) }
                } else if (url.startsWith("http://") || url.startsWith("https://")) {
                    java.net.URL(url).openStream().use { readLimited(it) }
                } else {
                    error("这个地址不能下载")
                }
                val dir = getExternalFilesDir(android.os.Environment.DIRECTORY_DOWNLOADS) ?: filesDir
                val out = File(dir, name)
                out.writeBytes(bytes)
                out.name
            }
            runOnUiThread {
                val message = saved.fold({ "已保存 $it" }, { it.message ?: "下载失败" })
                Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun readConfig(): PageConfig {
        val raw = runCatching {
            assets.open("webcfg.json").bufferedReader().use { it.readText() }
        }.getOrNull()
        val json = raw?.let { runCatching { JSONObject(it) }.getOrNull() } ?: JSONObject()
        val entry = cleanPath(json.optString("entryFile", "index.html")) ?: "index.html"
        return PageConfig(
            entry = entry.ifBlank { "index.html" },
            spa = json.optBoolean("spaFallback", false),
            web = json.optJSONObject("webview") ?: JSONObject(),
        )
    }

    private inner class RuntimeChrome : WebChromeClient() {
        override fun onJsAlert(view: WebView, url: String?, message: String?, result: JsResult): Boolean {
            if (!pageConfig.optBoolean("jsDialogs", true)) {
                result.cancel()
                return true
            }
            AlertDialog.Builder(this@RuntimeActivity)
                .setMessage(message)
                .setPositiveButton("好") { _, _ -> result.confirm() }
                .setOnCancelListener { result.cancel() }
                .show()
            return true
        }

        override fun onJsConfirm(view: WebView, url: String?, message: String?, result: JsResult): Boolean {
            if (!pageConfig.optBoolean("jsDialogs", true)) {
                result.cancel()
                return true
            }
            AlertDialog.Builder(this@RuntimeActivity)
                .setMessage(message)
                .setPositiveButton("好") { _, _ -> result.confirm() }
                .setNegativeButton("取消") { _, _ -> result.cancel() }
                .setOnCancelListener { result.cancel() }
                .show()
            return true
        }

        override fun onJsPrompt(
            view: WebView,
            url: String?,
            message: String?,
            defaultValue: String?,
            result: JsPromptResult,
        ): Boolean {
            if (!pageConfig.optBoolean("jsDialogs", true)) {
                result.cancel()
                return true
            }
            val input = EditText(this@RuntimeActivity).apply { setText(defaultValue.orEmpty()) }
            AlertDialog.Builder(this@RuntimeActivity)
                .setMessage(message)
                .setView(input)
                .setPositiveButton("好") { _, _ -> result.confirm(input.text?.toString().orEmpty()) }
                .setNegativeButton("取消") { _, _ -> result.cancel() }
                .setOnCancelListener { result.cancel() }
                .show()
            return true
        }

        override fun onShowFileChooser(
            webView: WebView?,
            filePathCallback: ValueCallback<Array<Uri>>?,
            fileChooserParams: FileChooserParams?,
        ): Boolean {
            if (!pageConfig.optBoolean("fileChooser", true)) {
                filePathCallback?.onReceiveValue(null)
                return true
            }
            pendingFile?.onReceiveValue(null)
            pendingFile = filePathCallback
            val intent = fileChooserParams?.createIntent()
                ?: Intent(Intent.ACTION_GET_CONTENT).addCategory(Intent.CATEGORY_OPENABLE).setType("*/*")
            @Suppress("DEPRECATION")
            runCatching { startActivityForResult(intent, REQ_FILE) }
                .onFailure {
                    pendingFile?.onReceiveValue(null)
                    pendingFile = null
                }
            return true
        }

        override fun onGeolocationPermissionsShowPrompt(origin: String?, callback: GeolocationPermissions.Callback?) {
            if (!pageConfig.optBoolean("geolocation", true) || origin == null || callback == null) {
                callback?.invoke(origin, false, false)
                return
            }
            ensure(arrayOf(Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION)) {
                callback.invoke(origin, it, false)
            }
        }

        override fun onPermissionRequest(request: PermissionRequest) {
            if (!pageConfig.optBoolean("cameraMic", true)) {
                request.deny()
                return
            }
            val needed = buildList {
                if (PermissionRequest.RESOURCE_VIDEO_CAPTURE in request.resources) add(Manifest.permission.CAMERA)
                if (PermissionRequest.RESOURCE_AUDIO_CAPTURE in request.resources) add(Manifest.permission.RECORD_AUDIO)
            }
            if (needed.isEmpty()) {
                request.grant(request.resources)
                return
            }
            ensure(needed.toTypedArray()) { granted ->
                if (granted) request.grant(request.resources) else request.deny()
            }
        }

        override fun onShowCustomView(view: View?, callback: CustomViewCallback?) {
            if (!pageConfig.optBoolean("fullscreen", true) || view == null) {
                callback?.onCustomViewHidden()
                return
            }
            customCallback?.onCustomViewHidden()
            customView = view
            customCallback = callback
            view.layoutParams = FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT,
            )
            root?.addView(view)
        }

        override fun onHideCustomView() {
            customView?.let { (it.parent as? ViewGroup)?.removeView(it) }
            customView = null
            customCallback = null
        }

        override fun onCreateWindow(
            view: WebView,
            isDialog: Boolean,
            isUserGesture: Boolean,
            resultMsg: android.os.Message,
        ): Boolean {
            if (!pageConfig.optBoolean("multipleWindows", true)) return false
            val transport = resultMsg.obj as? WebView.WebViewTransport ?: return false
            val popup = WebView(view.context)
            popup.webViewClient = object : WebViewClient() {
                override fun shouldOverrideUrlLoading(popupView: WebView, request: WebResourceRequest): Boolean {
                    view.loadUrl(request.url.toString())
                    popup.destroy()
                    return true
                }
            }
            transport.webView = popup
            resultMsg.sendToTarget()
            return true
        }
    }

    private class WwwHandler(
        private val context: android.content.Context,
        private val entry: String,
        private val spa: Boolean,
    ) : WebViewAssetLoader.PathHandler {
        override fun handle(path: String): WebResourceResponse? {
            // `/www/` is stripped before this runs. Pages are stored at assets/www/.
            val clean = cleanPath(path.substringBefore('?')) ?: return null
            if (clean.isEmpty()) return open(entry)
            open(clean)?.let { return it }
            if (!clean.substringAfterLast('/').contains('.')) {
                open("$clean/$entry")?.let { return it }
                if (spa) return open(entry)
            }
            return null
        }

        private fun open(relative: String): WebResourceResponse? {
            val clean = cleanPath(relative) ?: return null
            if (clean.isEmpty()) return null
            val stream = runCatching { context.assets.open("www/$clean") }.getOrNull() ?: return null
            val mime = mimeOf(clean.substringAfterLast('/'))
            val textual = mime.startsWith("text/") || mime == "application/javascript" ||
                mime == "application/json" || mime == "application/xml" || mime == "image/svg+xml" ||
                mime == "application/manifest+json"
            return WebResourceResponse(mime, if (textual) "utf-8" else null, stream)
        }
    }

    private data class PageConfig(val entry: String, val spa: Boolean, val web: JSONObject)

    companion object {
        private const val REQ_FILE = 41
        private const val REQ_PERM = 42
        private const val DESKTOP_UA =
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
        private const val DEFAULT_UA = 0x70_01

        private fun applySettings(web: WebView, config: JSONObject) {
            val settings = web.settings
            settings.javaScriptEnabled = config.optBoolean("javaScript", true)
            settings.domStorageEnabled = config.optBoolean("domStorage", true)
            @Suppress("DEPRECATION")
            settings.databaseEnabled = config.optBoolean("database", true)
            val zoom = config.optBoolean("zoom", true)
            settings.setSupportZoom(zoom)
            settings.builtInZoomControls = zoom
            settings.displayZoomControls = zoom && config.optBoolean("displayZoomControls", false)
            settings.useWideViewPort = config.optBoolean("wideViewport", true)
            settings.loadWithOverviewMode = config.optBoolean("overviewMode", true)
            settings.mediaPlaybackRequiresUserGesture = config.optBoolean("mediaGestureRequired", false)
            settings.textZoom = config.optInt("textZoom", 100).coerceIn(50, 200)
            settings.allowFileAccess = config.optBoolean("allowFileAccess", false)
            settings.allowContentAccess = config.optBoolean("allowContentAccess", true)
            settings.javaScriptCanOpenWindowsAutomatically = config.optBoolean("javascriptCanOpenWindows", true)
            settings.setSupportMultipleWindows(config.optBoolean("multipleWindows", true))
            settings.blockNetworkLoads = config.optBoolean("blockNetwork", false)
            settings.loadsImagesAutomatically = true
            settings.cacheMode = when (config.optString("cacheMode", "default")) {
                "no-cache" -> WebSettings.LOAD_NO_CACHE
                "cache-else-network" -> WebSettings.LOAD_CACHE_ELSE_NETWORK
                "cache-only" -> WebSettings.LOAD_CACHE_ONLY
                else -> WebSettings.LOAD_DEFAULT
            }
            settings.mixedContentMode = when (config.optString("mixedContent", "compatibility")) {
                "always" -> WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
                "never" -> WebSettings.MIXED_CONTENT_NEVER_ALLOW
                else -> WebSettings.MIXED_CONTENT_COMPATIBILITY_MODE
            }
            if (web.getTag(DEFAULT_UA) == null) web.setTag(DEFAULT_UA, settings.userAgentString)
            val fallback = web.getTag(DEFAULT_UA) as? String
            settings.userAgentString = when (config.optString("userAgent", "mobile")) {
                "desktop" -> DESKTOP_UA
                "custom" -> config.optString("customUserAgent").ifBlank { fallback }
                else -> fallback
            }
            val fileFromFile = config.optBoolean("allowFileFromFile", false)
            setHiddenBool(settings, "setAllowFileAccessFromFileURLs", fileFromFile)
            setHiddenBool(settings, "setAllowUniversalAccessFromFileURLs", fileFromFile)
            val safe = config.optBoolean("safeBrowsing", true)
            if (WebViewFeature.isFeatureSupported(WebViewFeature.SAFE_BROWSING_ENABLE)) {
                WebSettingsCompat.setSafeBrowsingEnabled(settings, safe)
            } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                settings.safeBrowsingEnabled = safe
            }
            val dark = config.optBoolean("forceDark", false)
            if (WebViewFeature.isFeatureSupported(WebViewFeature.ALGORITHMIC_DARKENING)) {
                WebSettingsCompat.setAlgorithmicDarkeningAllowed(settings, dark)
            } else if (WebViewFeature.isFeatureSupported(WebViewFeature.FORCE_DARK)) {
                @Suppress("DEPRECATION")
                WebSettingsCompat.setForceDark(
                    settings,
                    if (dark) WebSettingsCompat.FORCE_DARK_ON else WebSettingsCompat.FORCE_DARK_OFF,
                )
            }
            CookieManager.getInstance().setAcceptCookie(true)
            CookieManager.getInstance().setAcceptThirdPartyCookies(web, config.optBoolean("thirdPartyCookies", true))
            WebView.setWebContentsDebuggingEnabled(config.optBoolean("remoteDebugging", true))
        }

        private fun setHiddenBool(settings: WebSettings, name: String, value: Boolean) {
            runCatching {
                val method = WebSettings::class.java.getMethod(name, Boolean::class.javaPrimitiveType)
                method.invoke(settings, value)
            }
        }

        private fun cleanPath(raw: String): String? {
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

        private fun mimeOf(name: String): String = when (name.substringAfterLast('.', "").lowercase()) {
            "html", "htm" -> "text/html"
            "css" -> "text/css"
            "js", "mjs", "cjs" -> "text/javascript"
            "json", "map" -> "application/json"
            "svg" -> "image/svg+xml"
            "wasm" -> "application/wasm"
            "png" -> "image/png"
            "jpg", "jpeg" -> "image/jpeg"
            "gif" -> "image/gif"
            "webp" -> "image/webp"
            "ico" -> "image/x-icon"
            "woff" -> "font/woff"
            "woff2" -> "font/woff2"
            "ttf" -> "font/ttf"
            "webmanifest" -> "application/manifest+json"
            "xml" -> "application/xml"
            "txt", "md" -> "text/plain"
            else -> "application/octet-stream"
        }

        private fun fileName(url: String, disposition: String?): String {
            val plain = disposition?.substringAfter("filename=", "")?.substringBefore(';')?.trim()?.trim('"').orEmpty()
            val raw = plain.ifBlank { url.substringBefore('?').substringAfterLast('/') }.ifBlank { "download" }
            val clean = raw.substringAfterLast('/').filter { it.isLetterOrDigit() || it == '.' || it == '_' || it == '-' }
            return clean.ifBlank { "download" }
        }

        private fun readLimited(input: InputStream): ByteArray {
            val out = ByteArrayOutputStream()
            val buffer = ByteArray(8192)
            var total = 0
            while (true) {
                val n = input.read(buffer)
                if (n < 0) break
                total += n
                if (total > 32 * 1024 * 1024) error("文件太大")
                out.write(buffer, 0, n)
            }
            return out.toByteArray()
        }
    }
}

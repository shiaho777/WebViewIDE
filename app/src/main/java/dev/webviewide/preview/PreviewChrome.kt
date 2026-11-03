package dev.webviewide.preview

import android.Manifest
import android.app.AlertDialog
import android.content.Context
import android.net.Uri
import android.webkit.ConsoleMessage
import android.webkit.GeolocationPermissions
import android.webkit.JsPromptResult
import android.webkit.JsResult
import android.webkit.PermissionRequest
import android.webkit.ValueCallback
import android.webkit.WebChromeClient
import android.webkit.WebView
import android.widget.EditText
import android.widget.FrameLayout
import dev.webviewide.project.WebViewConfig

class PreviewHostState {
    var onConsole: (String) -> Unit = {}
    var onProgress: (Int) -> Unit = {}
    var requestPermissions: (Array<String>, (Boolean) -> Unit) -> Unit = { _, done -> done(false) }
    var chooseFile: (ValueCallback<Array<Uri>>?, WebChromeClient.FileChooserParams?) -> Unit =
        { callback, _ -> callback?.onReceiveValue(null) }
    var onFullscreen: (android.view.View?, WebChromeClient.CustomViewCallback?) -> Unit = { _, callback ->
        callback?.onCustomViewHidden()
    }
    var download: (String, String, String, Long) -> Unit = { _, _, _, _ -> }
    var fileCallback: ValueCallback<Array<Uri>>? = null
    var permissionDone: ((Boolean) -> Unit)? = null
}

class PreviewChrome(
    private val context: Context,
    private val config: () -> WebViewConfig,
    private val host: PreviewHostState,
) : WebChromeClient() {
    override fun onConsoleMessage(message: ConsoleMessage): Boolean {
        host.onConsole("${message.messageLevel().name.lowercase()} ${message.sourceId()}:${message.lineNumber()}  ${message.message()}")
        return true
    }

    override fun onProgressChanged(view: WebView?, newProgress: Int) {
        host.onProgress(newProgress)
    }

    override fun onJsAlert(view: WebView, url: String?, message: String?, result: JsResult): Boolean {
        if (!config().jsDialogs) {
            result.cancel()
            return true
        }
        AlertDialog.Builder(context)
            .setMessage(message)
            .setPositiveButton("好") { _, _ -> result.confirm() }
            .setOnCancelListener { result.cancel() }
            .show()
        return true
    }

    override fun onJsConfirm(view: WebView, url: String?, message: String?, result: JsResult): Boolean {
        if (!config().jsDialogs) {
            result.cancel()
            return true
        }
        AlertDialog.Builder(context)
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
        if (!config().jsDialogs) {
            result.cancel()
            return true
        }
        val input = EditText(context).apply { setText(defaultValue.orEmpty()) }
        AlertDialog.Builder(context)
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
        if (!config().fileChooser) {
            filePathCallback?.onReceiveValue(null)
            return true
        }
        host.chooseFile(filePathCallback, fileChooserParams)
        return true
    }

    override fun onGeolocationPermissionsShowPrompt(origin: String?, callback: GeolocationPermissions.Callback?) {
        if (!config().geolocation || origin == null || callback == null) {
            callback?.invoke(origin, false, false)
            return
        }
        host.requestPermissions(
            arrayOf(Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION),
        ) { granted -> callback.invoke(origin, granted, false) }
    }

    override fun onPermissionRequest(request: PermissionRequest) {
        if (!config().cameraMic) {
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
        host.requestPermissions(needed.toTypedArray()) { granted ->
            if (granted) request.grant(request.resources) else request.deny()
        }
    }

    override fun onShowCustomView(view: android.view.View?, callback: CustomViewCallback?) {
        if (!config().fullscreen || view == null) {
            callback?.onCustomViewHidden()
            return
        }
        view.layoutParams = FrameLayout.LayoutParams(
            FrameLayout.LayoutParams.MATCH_PARENT,
            FrameLayout.LayoutParams.MATCH_PARENT,
        )
        host.onFullscreen(view, callback)
    }

    override fun onHideCustomView() {
        host.onFullscreen(null, null)
    }

    override fun onCreateWindow(view: WebView, isDialog: Boolean, isUserGesture: Boolean, resultMsg: android.os.Message): Boolean {
        if (!config().multipleWindows) return false
        val transport = resultMsg.obj as? WebView.WebViewTransport ?: return false
        val popup = WebView(view.context)
        popup.webViewClient = object : android.webkit.WebViewClient() {
            override fun shouldOverrideUrlLoading(popupView: WebView, request: android.webkit.WebResourceRequest): Boolean {
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

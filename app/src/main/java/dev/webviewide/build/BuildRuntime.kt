package dev.webviewide.build

import android.annotation.SuppressLint
import android.webkit.JavascriptInterface
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.webkit.WebViewAssetLoader
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.viewinterop.AndroidView

/**
 * Hidden WebView that runs the npm/esbuild build pipeline (JS + WASM). Kept
 * separate from the editor/preview WebViews so a build OOM or crash never takes
 * down editing. Mirrors CmEditor lifecycle: destroy on dispose, rebuild on
 * renderer death.
 *
 * [onEvent] receives parsed up-messages on the main thread. Commands are sent
 * via the returned [BuildHandle].
 */
class BuildHandle internal constructor(private val web: WebView) {
    fun send(messageJson: String) {
        web.post { web.evaluateJavascript(BuildBridge.jsCall(messageJson), null) }
    }
}

@SuppressLint("SetJavaScriptEnabled")
@Composable
fun BuildRuntime(
    onEvent: (Long, BuildEvent) -> Unit,
    onHandle: (BuildHandle?) -> Unit,
    modifier: Modifier = Modifier,
) {
    var epoch by remember { mutableIntStateOf(0) }
    var ready by remember { mutableStateOf(false) }
    val webRef = remember { arrayOfNulls<WebView>(1) }

    androidx.compose.runtime.key(epoch) {
        AndroidView(
            modifier = modifier,
            factory = { context ->
                WebView(context).apply {
                    settings.javaScriptEnabled = true
                    settings.domStorageEnabled = true
                    // Loads only our own bundle + cached esbuild wasm from the app's
                    // files dir (no untrusted content), so file access is safe here.
                    settings.allowFileAccess = true
                    settings.allowContentAccess = false
                    settings.textZoom = 100
                    addJavascriptInterface(object {
                        @JavascriptInterface
                        fun post(json: String) {
                            val parsed = BuildEvents.parse(json) ?: return
                            this@apply.post {
                                if (parsed.second is BuildEvent.Ready) ready = true
                                onEvent(parsed.first, parsed.second)
                            }
                        }
                    }, "WviBuild")
                    // Serve our bundle + cached wasm over https so esbuild's
                    // fetch(wasmURL) is same-origin (file:// is CORS-blocked).
                    val loader = WebViewAssetLoader.Builder()
                        .addPathHandler("/assets/", WebViewAssetLoader.AssetsPathHandler(context))
                        .addPathHandler("/files/", WebViewAssetLoader.InternalStoragePathHandler(context, context.filesDir))
                        .build()
                    webViewClient = object : WebViewClient() {
                        override fun shouldInterceptRequest(view: WebView?, request: WebResourceRequest?): WebResourceResponse? =
                            request?.url?.let { loader.shouldInterceptRequest(it) }
                        override fun onRenderProcessGone(view: WebView?, detail: android.webkit.RenderProcessGoneDetail?): Boolean {
                            webRef[0] = null
                            ready = false
                            onHandle(null)
                            onEvent(0, BuildEvent.Error("构建运行时崩溃，正在重建"))
                            epoch += 1
                            return true
                        }
                    }
                    webRef[0] = this
                    onHandle(BuildHandle(this))
                    loadUrl("https://appassets.androidplatform.net/assets/builder/index.html")
                }
            },
        )
    }
    DisposableEffect(epoch) {
        onDispose {
            webRef[0]?.let { web ->
                web.removeJavascriptInterface("WviBuild")
                web.destroy()
            }
            webRef[0] = null
            onHandle(null)
        }
    }
}
package dev.webviewide.preview

import android.content.Intent
import android.graphics.Bitmap
import android.webkit.WebResourceRequest
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.compose.BackHandler
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilterChip
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.SideEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import androidx.webkit.ProfileStore
import androidx.webkit.WebViewCompat
import androidx.webkit.WebViewFeature
import dev.webviewide.project.WebViewConfig
import java.io.File
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

private const val STAMP = 0x70_02

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun WebPreview(
    url: String?,
    config: WebViewConfig,
    profile: String?,
    reloadKey: Int,
    localRoot: File?,
    modifier: Modifier = Modifier,
    onStatus: (String) -> Unit = {},
    onWebView: (WebView?) -> Unit = {},
) {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    val host = remember { PreviewHostState() }
    val webRef = remember { mutableStateOf<WebView?>(null) }
    var progress by remember { mutableIntStateOf(0) }
    var canGoBack by remember { mutableStateOf(false) }
    var console by remember { mutableStateOf(listOf<String>()) }
    var showConsole by remember { mutableStateOf(false) }
    var viewport by remember { mutableIntStateOf(0) }
    var fullscreen by remember { mutableStateOf<android.view.View?>(null) }
    var fullscreenCallback by remember { mutableStateOf<android.webkit.WebChromeClient.CustomViewCallback?>(null) }
    val configRef = remember { mutableStateOf(config) }
    configRef.value = config

    val fileLauncher = rememberLauncherForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
        val callback = host.fileCallback
        host.fileCallback = null
        callback?.onReceiveValue(android.webkit.WebChromeClient.FileChooserParams.parseResult(result.resultCode, result.data))
    }
    val permissionLauncher = rememberLauncherForActivityResult(ActivityResultContracts.RequestMultiplePermissions()) { granted ->
        val done = host.permissionDone
        host.permissionDone = null
        done?.invoke(granted.isNotEmpty() && granted.values.all { it })
    }
    SideEffect {
        host.onConsole = { line -> console = (console + line).takeLast(200) }
        host.onProgress = { progress = it }
        host.requestPermissions = { permissions, done ->
            host.permissionDone = done
            permissionLauncher.launch(permissions)
        }
        host.chooseFile = { callback, params ->
            host.fileCallback?.onReceiveValue(null)
            host.fileCallback = callback
            val intent = params?.createIntent() ?: Intent(Intent.ACTION_GET_CONTENT).setType("*/*")
            runCatching { fileLauncher.launch(intent) }
                .onFailure {
                    host.fileCallback?.onReceiveValue(null)
                    host.fileCallback = null
                }
        }
        host.onFullscreen = { view, callback ->
            if (view == null) {
                fullscreenCallback?.onCustomViewHidden()
                fullscreen = null
                fullscreenCallback = null
            } else {
                fullscreen = view
                fullscreenCallback = callback
            }
        }
        host.download = { address, name, mime, _ ->
            scope.launch {
                val saved = withContext(Dispatchers.IO) {
                    runCatching { SaveDownload.save(context.applicationContext, address, name, mime, localRoot) }
                }
                onStatus(saved.fold({ "已保存 $name" }, { it.message ?: "下载失败" }))
            }
        }
    }

    BackHandler(enabled = fullscreen != null || canGoBack) {
        if (fullscreen != null) {
            fullscreenCallback?.onCustomViewHidden()
            fullscreen = null
            fullscreenCallback = null
        } else {
            webRef.value?.goBack()
        }
    }

    Column(modifier) {
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp), modifier = Modifier.padding(horizontal = 12.dp, vertical = 4.dp)) {
            listOf(0 to "满宽", 320 to "320", 390 to "390", 768 to "768").forEach { (width, label) ->
                FilterChip(selected = viewport == width, onClick = { viewport = width }, label = { Text(label) })
            }
            TextButton(onClick = { showConsole = true }) { Text("控制台") }
        }
        if (progress in 1..99) LinearProgressIndicator(progress = { progress / 100f }, modifier = Modifier.fillMaxWidth())
        if (url.isNullOrBlank()) {
            Text("预览还没准备好", modifier = Modifier.padding(16.dp))
        } else {
            Box(Modifier.weight(1f).fillMaxWidth(), contentAlignment = Alignment.TopCenter) {
            AndroidView(
                modifier = if (viewport == 0) Modifier.fillMaxSize() else Modifier.width(viewport.dp).fillMaxHeight(),
                factory = { viewContext ->
                    WebView(viewContext).apply {
                        if (!profile.isNullOrBlank() && WebViewFeature.isFeatureSupported(WebViewFeature.MULTI_PROFILE)) {
                            runCatching {
                                ProfileStore.getInstance().getOrCreateProfile(profile)
                                WebViewCompat.setProfile(this, profile)
                            }
                        }
                        applyWebSettings(this, configRef.value)
                        webChromeClient = PreviewChrome(context, { configRef.value }, host)
                        webViewClient = object : WebViewClient() {
                            override fun onPageStarted(view: WebView?, address: String?, favicon: Bitmap?) {
                                progress = 8
                            }
                            override fun onPageFinished(view: WebView?, address: String?) {
                                progress = 100
                                canGoBack = view?.canGoBack() == true
                            }
                            override fun doUpdateVisitedHistory(view: WebView?, address: String?, isReload: Boolean) {
                                canGoBack = view?.canGoBack() == true
                            }
                            override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean = false
                        }
                        setDownloadListener { address, _, disposition, mime, length ->
                            if (!configRef.value.downloads) return@setDownloadListener
                            host.download(address, dev.webviewide.server.SiteFiles.fileNameFrom(address, disposition), mime, length)
                        }
                        webRef.value = this
                        onWebView(this)
                    }
                },
                update = { web ->
                    applyWebSettings(web, config)
                    val stamp = "$url#$reloadKey#${config.encode()}"
                    if (web.getTag(STAMP) != stamp) {
                        web.setTag(STAMP, stamp)
                        web.loadUrl(url)
                    }
                },
                onRelease = {
                    webRef.value = null
                    onWebView(null)
                    it.destroy()
                },
            )
            }
        }
    }

    if (showConsole) {
        ModalBottomSheet(onDismissRequest = { showConsole = false }) {
            Row(Modifier.fillMaxWidth().padding(horizontal = 16.dp), horizontalArrangement = Arrangement.SpaceBetween) {
                Text("控制台")
                TextButton(onClick = { console = emptyList() }) { Text("清空") }
            }
            LazyColumn(Modifier.heightIn(min = 120.dp, max = 420.dp).padding(horizontal = 16.dp, vertical = 8.dp)) {
                if (console.isEmpty()) item { Text("还没有输出") }
                items(console) { line -> Text(line) }
            }
        }
    }

    if (fullscreen != null) {
        Dialog(
            onDismissRequest = {
                fullscreenCallback?.onCustomViewHidden()
                fullscreen = null
                fullscreenCallback = null
            },
            properties = DialogProperties(usePlatformDefaultWidth = false),
        ) {
            AndroidView(factory = { fullscreen!! }, modifier = Modifier.fillMaxSize())
        }
    }

    DisposableEffect(Unit) {
        onDispose {
            host.fileCallback?.onReceiveValue(null)
            host.fileCallback = null
            host.permissionDone?.invoke(false)
            host.permissionDone = null
        }
    }
}

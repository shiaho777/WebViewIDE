package dev.webviewide.preview

import android.content.Intent
import android.graphics.Bitmap
import android.webkit.WebResourceRequest
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.compose.BackHandler
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.AspectRatio
import androidx.compose.material.icons.outlined.Check
import androidx.compose.material.icons.outlined.ExpandMore
import androidx.compose.material.icons.outlined.Language
import androidx.compose.material.icons.outlined.Terminal
import androidx.compose.material.icons.outlined.TouchApp
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.FilledTonalButton
import androidx.compose.material3.FilledTonalIconButton
import androidx.compose.material3.Icon
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.SegmentedButton
import androidx.compose.material3.SegmentedButtonDefaults
import androidx.compose.material3.SingleChoiceSegmentedButtonRow
import androidx.compose.material3.Surface
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
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.unit.dp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import androidx.webkit.ProfileStore
import androidx.webkit.WebViewCompat
import androidx.webkit.WebViewFeature
import dev.webviewide.R
import dev.webviewide.project.WebViewConfig
import dev.webviewide.ui.theme.AppMotion
import java.io.File
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

private val viewports = listOf(0 to "满宽", 320 to "320", 390 to "390", 768 to "768")

@Composable
private fun ConsoleRow(entry: ConsoleEntry, onOpenSource: (String, Int) -> Unit) {
    val color = when (entry.level) {
        "error" -> MaterialTheme.colorScheme.error
        "warning" -> MaterialTheme.colorScheme.tertiary
        else -> MaterialTheme.colorScheme.onSurface
    }
    val file = entry.source.substringAfterLast('/').substringBefore('?')
    val remote = entry.source.startsWith("http://") || entry.source.startsWith("https://")
    val local = !remote || entry.source.contains("127.0.0.1") || entry.source.contains("localhost")
    val jumpable = entry.line > 0 && file.isNotBlank() && local
    Row(
        Modifier
            .fillMaxWidth()
            .then(
                if (jumpable) {
                    Modifier.clickable { onOpenSource(file, entry.line) }
                } else {
                    Modifier
                },
            )
            .padding(vertical = 2.dp),
        horizontalArrangement = Arrangement.spacedBy(6.dp),
    ) {
        Text(
            entry.level.uppercase().take(4),
            style = MaterialTheme.typography.labelSmall.copy(fontFamily = FontFamily.Monospace),
            color = color,
        )
        Text(
            buildString {
                append(entry.message)
                if (file.isNotBlank() && entry.line > 0) append("  ($file:${entry.line})")
            },
            style = MaterialTheme.typography.bodySmall.copy(fontFamily = FontFamily.Monospace),
            color = color,
            modifier = Modifier.weight(1f),
        )
    }
}

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
    onOpenSource: (String, Int) -> Unit = { _, _ -> },
) {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    val host = remember { PreviewHostState() }
    val webRef = remember { mutableStateOf<WebView?>(null) }
    var progress by remember { mutableIntStateOf(0) }
    var canGoBack by remember { mutableStateOf(false) }
    var console by remember { mutableStateOf(listOf<ConsoleEntry>()) }
    var showConsole by remember { mutableStateOf(false) }
    val errorCount = console.count { it.level == "error" }
    var inspecting by remember { mutableStateOf(false) }
    var domInfo by remember { mutableStateOf<DomInspector.ElementInfo?>(null) }
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
        host.onConsole = { entry -> console = (console + entry).takeLast(500) }
        host.onDomPick = { info -> domInfo = info }
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
        // In a narrow split pane the labelled buttons overflow; fall back to
        // icon-only controls (console keeps an error badge).
        androidx.compose.foundation.layout.BoxWithConstraints(
            Modifier.fillMaxWidth().padding(horizontal = 12.dp, vertical = 6.dp),
        ) {
        val compact = maxWidth < 300.dp
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Box {
                var widthMenu by remember { mutableStateOf(false) }
                if (compact) {
                    FilledTonalIconButton(onClick = { widthMenu = true }) {
                        Icon(Icons.Outlined.AspectRatio, contentDescription = "预览宽度")
                    }
                } else {
                FilledTonalButton(
                    onClick = { widthMenu = true },
                    contentPadding = PaddingValues(horizontal = 16.dp),
                ) {
                    Text(viewports.firstOrNull { it.first == viewport }?.second ?: "满宽", maxLines = 1, softWrap = false)
                    Icon(Icons.Outlined.ExpandMore, contentDescription = null, modifier = Modifier.padding(start = 4.dp))
                }
                }
                DropdownMenu(expanded = widthMenu, onDismissRequest = { widthMenu = false }) {
                    viewports.forEach { (width, label) ->
                        DropdownMenuItem(
                            text = { Text(label) },
                            leadingIcon = {
                                if (width == viewport) {
                                    Icon(Icons.Outlined.Check, contentDescription = null)
                                }
                            },
                            onClick = {
                                viewport = width
                                widthMenu = false
                            },
                        )
                    }
                }
            }
            Spacer(Modifier.weight(1f))
            FilledTonalIconButton(onClick = {
                inspecting = !inspecting
                val web = webRef.value
                if (inspecting) {
                    domInfo = null
                    web?.evaluateJavascript(DomInspector.enableScript, null)
                } else {
                    web?.evaluateJavascript(DomInspector.disableScript, null)
                }
            }) {
                Icon(
                    Icons.Outlined.TouchApp,
                    contentDescription = "检查元素",
                    tint = if (inspecting) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
            if (compact) {
                androidx.compose.material3.BadgedBox(
                    badge = {
                        if (errorCount > 0) {
                            androidx.compose.material3.Badge { Text(errorCount.toString()) }
                        }
                    },
                ) {
                    FilledTonalIconButton(onClick = { showConsole = !showConsole }) {
                        Icon(Icons.Outlined.Terminal, contentDescription = "控制台")
                    }
                }
            } else {
                FilledTonalButton(onClick = { showConsole = !showConsole }) {
                    Icon(Icons.Outlined.Terminal, contentDescription = null, modifier = Modifier.size(18.dp))
                    Spacer(Modifier.width(6.dp))
                    Text(
                        if (errorCount > 0) "控制台 · $errorCount 个错误" else "控制台",
                        maxLines = 1,
                        softWrap = false,
                    )
                }
            }
        }
        }
        AnimatedVisibility(
            visible = progress in 1..99,
            enter = fadeIn(animationSpec = AppMotion.effects()),
            exit = fadeOut(animationSpec = AppMotion.effectsFast()),
        ) {
            LinearProgressIndicator(progress = { progress / 100f }, modifier = Modifier.fillMaxWidth())
        }
        if (url.isNullOrBlank()) {
            Column(
                Modifier.weight(1f).fillMaxWidth().padding(32.dp),
                verticalArrangement = Arrangement.Center,
                horizontalAlignment = Alignment.CenterHorizontally,
            ) {
                Icon(
                    Icons.Outlined.Language,
                    contentDescription = null,
                    modifier = Modifier.size(40.dp),
                    tint = MaterialTheme.colorScheme.onSurfaceVariant,
                )
                Text(
                    "预览还没准备好",
                    modifier = Modifier.padding(top = 12.dp),
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
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
                    if (web.getTag(R.id.preview_load_stamp) != stamp) {
                        web.setTag(R.id.preview_load_stamp, stamp)
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
        AnimatedVisibility(
            visible = showConsole,
            enter = fadeIn(animationSpec = AppMotion.effects()),
            exit = fadeOut(animationSpec = AppMotion.effectsFast()),
        ) {
            Surface(
                modifier = Modifier.fillMaxWidth().heightIn(min = 120.dp, max = 220.dp),
                color = MaterialTheme.colorScheme.surfaceContainerHighest,
            ) {
                Column {
                    Row(
                        Modifier.fillMaxWidth().padding(start = 12.dp, end = 4.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        Text("控制台", style = MaterialTheme.typography.titleSmall)
                        Row {
                            TextButton(onClick = { console = emptyList() }) { Text("清空") }
                            TextButton(onClick = { showConsole = false }) { Text("收起") }
                        }
                    }
                    LazyColumn(Modifier.weight(1f, fill = false).padding(horizontal = 12.dp).padding(bottom = 8.dp)) {
                        if (console.isEmpty()) {
                            item {
                                Text(
                                    "还没有输出",
                                    style = MaterialTheme.typography.bodySmall,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                                )
                            }
                        }
                        items(console) { entry ->
                            ConsoleRow(entry, onOpenSource)
                        }
                    }
                }
            }
        }
        AnimatedVisibility(
            visible = domInfo != null,
            enter = fadeIn(animationSpec = AppMotion.effects()),
            exit = fadeOut(animationSpec = AppMotion.effectsFast()),
        ) {
            Surface(
                modifier = Modifier.fillMaxWidth().heightIn(max = 220.dp),
                color = MaterialTheme.colorScheme.surfaceContainerHighest,
            ) {
                Column(Modifier.padding(12.dp)) {
                    Row(
                        Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        Text("元素", style = MaterialTheme.typography.titleSmall)
                        TextButton(onClick = { domInfo = null }) { Text("关闭") }
                    }
                    Text(
                        domInfo?.let { DomInspector.format(it) } ?: "",
                        style = MaterialTheme.typography.bodySmall,
                        fontFamily = FontFamily.Monospace,
                    )
                }
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

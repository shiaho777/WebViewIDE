package dev.webviewide.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.Add
import androidx.compose.material.icons.outlined.Delete
import androidx.compose.material.icons.outlined.Description
import androidx.compose.material.icons.outlined.Edit
import androidx.compose.material.icons.outlined.Folder
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilterChip
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.ListItem
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.ModalDrawerSheet
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Slider
import androidx.compose.material3.Switch
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableLongStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import dev.webviewide.project.FileTreeIndex
import dev.webviewide.project.WebProject
import dev.webviewide.project.WebViewConfig
import java.io.File
import kotlin.math.roundToInt

private val templates = listOf(
    "blank" to "空白页",
    "multipage" to "多页面",
    "vue" to "Vue",
    "react" to "React",
)

internal enum class NameAsk { NewFile, RenameFile, DeleteFile }

@OptIn(ExperimentalMaterial3Api::class)
@Composable
internal fun FileDrawer(
    session: IdeSession,
    onFile: () -> Unit,
    onNew: () -> Unit,
    onRename: () -> Unit,
    onDelete: () -> Unit,
) {
    val project = session.project
    ModalDrawerSheet {
        Row(
            Modifier.fillMaxWidth().padding(start = 16.dp, end = 4.dp, top = 12.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Column(Modifier.weight(1f)) {
                Text(project?.name ?: "文件", style = MaterialTheme.typography.titleMedium, maxLines = 1)
                Text("文件", style = MaterialTheme.typography.labelMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
            IconButton(onClick = onNew) { Icon(Icons.Outlined.Add, contentDescription = "新建文件") }
            IconButton(onClick = onRename, enabled = session.current != null) {
                Icon(Icons.Outlined.Edit, contentDescription = "改名")
            }
            IconButton(onClick = onDelete, enabled = session.current != null) {
                Icon(Icons.Outlined.Delete, contentDescription = "删除")
            }
        }
        if (project == null) return@ModalDrawerSheet
        val rows = remember(project.id, session.treeTick, session.expanded) {
            FileTreeIndex.rows(project.srcDir, session.expanded)
        }
        LazyColumn(Modifier.fillMaxWidth()) {
            items(rows, key = { it.rel }) { row ->
                ListItem(
                    modifier = Modifier
                        .padding(start = (row.depth * 12).dp)
                        .clickable {
                            if (row.directory) {
                                session.expanded = if (row.open) session.expanded - row.rel else session.expanded + row.rel
                            } else {
                                session.select(File(project.srcDir, row.rel))
                                onFile()
                            }
                        },
                    leadingContent = {
                        Icon(
                            if (row.directory) Icons.Outlined.Folder else Icons.Outlined.Description,
                            contentDescription = null,
                        )
                    },
                    headlineContent = { Text(row.name, maxLines = 1) },
                )
            }
        }
    }
}

@Composable
internal fun NameDialog(
    ask: NameAsk,
    currentName: String,
    onDismiss: () -> Unit,
    onConfirm: (String) -> Unit,
) {
    var value by remember(ask, currentName) { mutableStateOf(if (ask == NameAsk.RenameFile) currentName else "") }
    val title = when (ask) {
        NameAsk.NewFile -> "新建文件"
        NameAsk.RenameFile -> "改名"
        NameAsk.DeleteFile -> "删除这个文件？"
    }
    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text(title) },
        text = {
            if (ask == NameAsk.DeleteFile) {
                Text("「$currentName」会从项目里去掉。")
            } else {
                OutlinedTextField(
                    value = value,
                    onValueChange = { value = it },
                    singleLine = true,
                    label = { Text(if (ask == NameAsk.NewFile) "路径，例如 css/extra.css" else "新名字") },
                )
            }
        },
        confirmButton = {
            TextButton(
                onClick = { onConfirm(value.trim()) },
                enabled = ask == NameAsk.DeleteFile || value.isNotBlank(),
            ) { Text(if (ask == NameAsk.DeleteFile) "删除" else "好") }
        },
        dismissButton = { TextButton(onClick = onDismiss) { Text("取消") } },
    )
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
internal fun ProjectSheet(
    session: IdeSession,
    onImportFile: () -> Unit,
    onImportTree: () -> Unit,
    onDismiss: () -> Unit,
) {
    val current = session.project
    var newName by remember { mutableStateOf("") }
    var template by remember { mutableStateOf("blank") }
    var confirmDelete by remember { mutableStateOf(false) }
    val projects = remember(current?.id, current?.name, session.treeTick) { session.projects() }
    ModalBottomSheet(onDismissRequest = onDismiss) {
        Column(Modifier.fillMaxWidth().imePadding().padding(horizontal = 20.dp).padding(bottom = 28.dp)) {
            Text("项目", style = MaterialTheme.typography.titleLarge)
            OutlinedTextField(
                value = newName,
                onValueChange = { newName = it },
                modifier = Modifier.fillMaxWidth().padding(top = 12.dp),
                singleLine = true,
                label = { Text("给它起个名字") },
            )
            Row(
                Modifier.fillMaxWidth().horizontalScroll(rememberScrollState()).padding(top = 8.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp),
            ) {
                templates.forEach { (id, label) ->
                    FilterChip(selected = template == id, onClick = { template = id }, label = { Text(label) })
                }
            }
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                TextButton(onClick = {
                    session.create(template, newName.ifBlank { "未命名" })
                    newName = ""
                    onDismiss()
                }) { Text("新建") }
                TextButton(onClick = { onDismiss(); onImportFile() }) { Text("导入文件") }
                TextButton(onClick = { onDismiss(); onImportTree() }) { Text("导入文件夹") }
            }
            Text(
                "手机上不跑 npm。Vue、React 这类工程要先在电脑上构建，再把 dist 或 build 导入。",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
            LazyColumn(Modifier.fillMaxWidth().heightIn(max = 280.dp).padding(top = 8.dp)) {
                items(projects, key = { it.id }) { item ->
                    ListItem(
                        modifier = Modifier.clickable {
                            session.openProject(item.id)
                            onDismiss()
                        },
                        headlineContent = { Text(item.name, maxLines = 1) },
                        supportingContent = { Text(item.summary, maxLines = 2) },
                        trailingContent = {
                            if (item.id == current?.id) Text("当前", style = MaterialTheme.typography.labelMedium)
                        },
                    )
                }
            }
            if (current != null) {
                HorizontalDivider(Modifier.padding(vertical = 8.dp))
                Row {
                    TextButton(onClick = { session.duplicate(); onDismiss() }) { Text("复制项目") }
                    TextButton(onClick = { confirmDelete = true }) { Text("删除项目") }
                }
            }
        }
    }
    if (confirmDelete && current != null) {
        AlertDialog(
            onDismissRequest = { confirmDelete = false },
            title = { Text("删除「${current.name}」？") },
            text = { Text("里面的文件会一起去掉。") },
            confirmButton = {
                TextButton(onClick = {
                    confirmDelete = false
                    session.delete()
                    onDismiss()
                }) { Text("删除") }
            },
            dismissButton = { TextButton(onClick = { confirmDelete = false }) { Text("取消") } },
        )
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
internal fun SettingsSheet(
    project: WebProject,
    url: String?,
    lanUrl: String?,
    onProject: (WebProject, Boolean) -> Unit,
    onCopy: () -> Unit,
    onClear: () -> Unit,
    onDismiss: () -> Unit,
) {
    var portText by remember(project.id, project.serverPort) { mutableStateOf(project.serverPort.toString()) }
    val config = project.webview
    ModalBottomSheet(onDismissRequest = onDismiss) {
        Column(
            Modifier
                .fillMaxWidth()
                .imePadding()
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 20.dp)
                .padding(bottom = 28.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp),
        ) {
            Text("WebView 和服务", style = MaterialTheme.typography.titleLarge)
            Text(url ?: "预览还没起来", style = MaterialTheme.typography.bodyMedium)
            lanUrl?.let { Text(it, style = MaterialTheme.typography.bodySmall) }
            Row(verticalAlignment = Alignment.CenterVertically) {
                OutlinedTextField(
                    value = portText,
                    onValueChange = { portText = it.filter { ch -> ch.isDigit() }.take(5) },
                    modifier = Modifier.weight(1f),
                    singleLine = true,
                    label = { Text("端口") },
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                )
                TextButton(onClick = {
                    val port = portText.toIntOrNull()?.coerceIn(1024, 65535) ?: return@TextButton
                    onProject(project.copy(serverPort = port), true)
                }) { Text("使用") }
            }
            ToggleRow("局域网也能打开", project.lan) { onProject(project.copy(lan = it), true) }
            ToggleRow("改完马上刷新", project.liveReload) { onProject(project.copy(liveReload = it), true) }
            Row {
                TextButton(onClick = onCopy, enabled = url != null || lanUrl != null) { Text("复制地址") }
                TextButton(onClick = onClear) { Text("清掉缓存") }
            }
            Text("页面能力", style = MaterialTheme.typography.titleMedium)
            webFlags.forEach { flag ->
                ToggleRow(flag.label, flag.read(config)) { checked ->
                    onProject(project.copy(webview = flag.write(config, checked)), false)
                }
            }
            Text("混合内容", style = MaterialTheme.typography.titleSmall)
            ChipRow(
                options = listOf(
                    WebViewConfig.MIXED_NEVER to "不允许",
                    WebViewConfig.MIXED_COMPAT to "兼容",
                    WebViewConfig.MIXED_ALWAYS to "允许",
                ),
                selected = config.mixedContent,
            ) { onProject(project.copy(webview = config.copy(mixedContent = it)), false) }
            Text("缓存", style = MaterialTheme.typography.titleSmall)
            ChipRow(
                options = listOf(
                    WebViewConfig.CACHE_DEFAULT to "默认",
                    WebViewConfig.CACHE_NO to "不用缓存",
                    WebViewConfig.CACHE_ELSE_NETWORK to "缓存优先",
                    WebViewConfig.CACHE_ONLY to "只用缓存",
                ),
                selected = config.cacheMode,
            ) { onProject(project.copy(webview = config.copy(cacheMode = it)), false) }
            Text("浏览器标识", style = MaterialTheme.typography.titleSmall)
            ChipRow(
                options = listOf(
                    WebViewConfig.UA_MOBILE to "手机",
                    WebViewConfig.UA_DESKTOP to "桌面",
                    WebViewConfig.UA_CUSTOM to "自定义",
                ),
                selected = config.userAgent,
            ) { onProject(project.copy(webview = config.copy(userAgent = it)), false) }
            if (config.userAgent == WebViewConfig.UA_CUSTOM) {
                OutlinedTextField(
                    value = config.customUserAgent,
                    onValueChange = { onProject(project.copy(webview = config.copy(customUserAgent = it)), false) },
                    modifier = Modifier.fillMaxWidth(),
                    label = { Text("自定义标识") },
                    singleLine = true,
                )
            }
            Text("文字大小 ${config.textZoom}", style = MaterialTheme.typography.titleSmall)
            var zoom by remember(project.id, config.textZoom) { mutableFloatStateOf(config.textZoom.toFloat()) }
            Slider(
                value = zoom,
                onValueChange = { zoom = it },
                onValueChangeFinished = {
                    onProject(project.copy(webview = config.copy(textZoom = zoom.roundToInt().coerceIn(50, 200))), false)
                },
                valueRange = 50f..200f,
            )
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
internal fun PackageSheet(
    project: WebProject,
    onProject: (WebProject) -> Unit,
    onPickIcon: () -> Unit,
    onPack: () -> Unit,
    onDismiss: () -> Unit,
) {
    var name by remember(project.id) { mutableStateOf(project.name) }
    var packageName by remember(project.id) { mutableStateOf(project.resolvedPackageName()) }
    var versionName by remember(project.id) { mutableStateOf(project.versionName) }
    var versionCode by remember(project.id) { mutableStateOf(project.versionCode.toString()) }
    var orientation by remember(project.id) { mutableStateOf(project.orientation) }
    var abis by remember(project.id) { mutableStateOf(project.abis) }
    var iconColor by remember(project.id, project.iconBgColor) { mutableLongStateOf(project.iconBgColor) }
    fun edited(): WebProject = project.copy(
        name = name.ifBlank { project.name },
        packageName = packageName.ifBlank { project.resolvedPackageName() },
        versionName = versionName.ifBlank { "1.0.0" },
        versionCode = versionCode.toIntOrNull()?.coerceAtLeast(1) ?: project.versionCode,
        orientation = orientation,
        abis = abis.ifEmpty { project.abis },
        iconBgColor = iconColor,
    )
    ModalBottomSheet(onDismissRequest = {
        onProject(edited())
        onDismiss()
    }) {
        Column(
            Modifier
                .fillMaxWidth()
                .imePadding()
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 20.dp)
                .padding(bottom = 28.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp),
        ) {
            Text("打包", style = MaterialTheme.typography.titleLarge)
            if (!project.runnable) {
                Text(project.summary, color = MaterialTheme.colorScheme.error)
            } else {
                Text(
                    "打进去的是现在能预览的那一层。",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
            OutlinedTextField(name, { name = it }, Modifier.fillMaxWidth(), singleLine = true, label = { Text("应用名") })
            OutlinedTextField(packageName, { packageName = it }, Modifier.fillMaxWidth(), singleLine = true, label = { Text("包名") })
            OutlinedTextField(versionName, { versionName = it }, Modifier.fillMaxWidth(), singleLine = true, label = { Text("版本名") })
            OutlinedTextField(
                versionCode,
                { versionCode = it.filter { ch -> ch.isDigit() }.take(6) },
                Modifier.fillMaxWidth(),
                singleLine = true,
                label = { Text("版本号") },
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
            )
            Text("方向", style = MaterialTheme.typography.titleSmall)
            ChipRow(
                options = listOf("AUTO" to "自动", "PORTRAIT" to "竖屏", "LANDSCAPE" to "横屏"),
                selected = orientation,
            ) { orientation = it }
            Text("架构", style = MaterialTheme.typography.titleSmall)
            Row(
                Modifier.horizontalScroll(rememberScrollState()),
                horizontalArrangement = Arrangement.spacedBy(8.dp),
            ) {
                listOf("arm64-v8a", "armeabi-v7a", "x86_64").forEach { abi ->
                    FilterChip(
                        selected = abi in abis,
                        onClick = { abis = if (abi in abis) abis - abi else abis + abi },
                        label = { Text(abi) },
                    )
                }
            }
            Text("图标底色", style = MaterialTheme.typography.titleSmall)
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalAlignment = Alignment.CenterVertically) {
                listOf(0xFF185FA5, 0xFF0F6E56, 0xFF993C1D, 0xFF534AB7, 0xFF222222).forEach { color ->
                    Box(
                        Modifier
                            .size(if (iconColor == color) 32.dp else 28.dp)
                            .clip(CircleShape)
                            .background(Color(color.toInt()))
                            .clickable { iconColor = color },
                    )
                }
            }
            TextButton(onClick = onPickIcon) {
                Text(if (project.iconPath.isNullOrBlank()) "选一张图" else "已选 ${project.iconPath}")
            }
            TextButton(
                onClick = {
                    onProject(edited())
                    onPack()
                },
                enabled = project.runnable,
            ) { Text("开始打包") }
        }
    }
}

@Composable
private fun ToggleRow(label: String, checked: Boolean, onChecked: (Boolean) -> Unit) {
    Row(
        Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Text(label, modifier = Modifier.weight(1f).padding(end = 12.dp))
        Switch(checked = checked, onCheckedChange = onChecked)
    }
}

@Composable
private fun ChipRow(
    options: List<Pair<String, String>>,
    selected: String,
    onSelect: (String) -> Unit,
) {
    Row(
        Modifier.horizontalScroll(rememberScrollState()),
        horizontalArrangement = Arrangement.spacedBy(8.dp),
    ) {
        options.forEach { (value, label) ->
            FilterChip(selected = selected == value, onClick = { onSelect(value) }, label = { Text(label) })
        }
    }
}

private class WebFlag(
    val label: String,
    val read: (WebViewConfig) -> Boolean,
    val write: (WebViewConfig, Boolean) -> WebViewConfig,
)

private val webFlags = listOf(
    WebFlag("JavaScript", { it.javaScript }, { c, v -> c.copy(javaScript = v) }),
    WebFlag("记住网页数据", { it.domStorage }, { c, v -> c.copy(domStorage = v) }),
    WebFlag("本地数据库", { it.database }, { c, v -> c.copy(database = v) }),
    WebFlag("第三方 Cookie", { it.thirdPartyCookies }, { c, v -> c.copy(thirdPartyCookies = v) }),
    WebFlag("允许缩放", { it.zoom }, { c, v -> c.copy(zoom = v) }),
    WebFlag("显示缩放按钮", { it.displayZoomControls }, { c, v -> c.copy(displayZoomControls = v) }),
    WebFlag("宽视口", { it.wideViewport }, { c, v -> c.copy(wideViewport = v) }),
    WebFlag("缩放到整页", { it.overviewMode }, { c, v -> c.copy(overviewMode = v) }),
    WebFlag("媒体要先点一下", { it.mediaGestureRequired }, { c, v -> c.copy(mediaGestureRequired = v) }),
    WebFlag("跟随深色", { it.forceDark }, { c, v -> c.copy(forceDark = v) }),
    WebFlag("安全浏览", { it.safeBrowsing }, { c, v -> c.copy(safeBrowsing = v) }),
    WebFlag("远程调试", { it.remoteDebugging }, { c, v -> c.copy(remoteDebugging = v) }),
    WebFlag("读取本地文件", { it.allowFileAccess }, { c, v -> c.copy(allowFileAccess = v) }),
    WebFlag("读取 content 地址", { it.allowContentAccess }, { c, v -> c.copy(allowContentAccess = v) }),
    WebFlag("文件页面互相访问", { it.allowFileFromFile }, { c, v -> c.copy(allowFileFromFile = v) }),
    WebFlag("脚本可以开窗口", { it.javascriptCanOpenWindows }, { c, v -> c.copy(javascriptCanOpenWindows = v) }),
    WebFlag("允许多窗口", { it.multipleWindows }, { c, v -> c.copy(multipleWindows = v) }),
    WebFlag("禁止加载网络", { it.blockNetwork }, { c, v -> c.copy(blockNetwork = v) }),
    WebFlag("定位", { it.geolocation }, { c, v -> c.copy(geolocation = v) }),
    WebFlag("摄像头和麦克风", { it.cameraMic }, { c, v -> c.copy(cameraMic = v) }),
    WebFlag("选择文件", { it.fileChooser }, { c, v -> c.copy(fileChooser = v) }),
    WebFlag("下载", { it.downloads }, { c, v -> c.copy(downloads = v) }),
    WebFlag("网页对话框", { it.jsDialogs }, { c, v -> c.copy(jsDialogs = v) }),
    WebFlag("全屏", { it.fullscreen }, { c, v -> c.copy(fullscreen = v) }),
)

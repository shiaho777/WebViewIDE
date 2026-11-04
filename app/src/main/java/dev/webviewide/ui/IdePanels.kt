package dev.webviewide.ui

import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.scaleIn
import androidx.compose.animation.scaleOut
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.width
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
import androidx.compose.material.icons.automirrored.outlined.KeyboardArrowRight
import androidx.compose.material.icons.automirrored.outlined.NoteAdd
import androidx.compose.material.icons.outlined.Check
import androidx.compose.material.icons.outlined.ContentCopy
import androidx.compose.material.icons.outlined.DeleteOutline
import androidx.compose.material.icons.outlined.DriveFileRenameOutline
import androidx.compose.material.icons.outlined.FileOpen
import androidx.compose.material.icons.outlined.FolderOpen
import androidx.compose.material.icons.outlined.Add
import androidx.compose.material.icons.outlined.Badge
import androidx.compose.material.icons.outlined.Build
import androidx.compose.material.icons.outlined.DeleteSweep
import androidx.compose.material.icons.outlined.Extension
import androidx.compose.material.icons.outlined.Image
import androidx.compose.material.icons.outlined.Link
import androidx.compose.material.icons.outlined.Palette
import androidx.compose.material.icons.outlined.RocketLaunch
import androidx.compose.material.icons.outlined.Delete
import androidx.compose.material.icons.outlined.Description
import androidx.compose.material.icons.outlined.Edit
import androidx.compose.material.icons.outlined.Folder
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.AssistChip
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilledTonalButton
import androidx.compose.material3.FilledTonalIconButton
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Surface
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
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import dev.webviewide.project.FileTreeIndex
import dev.webviewide.project.WebProject
import dev.webviewide.project.WebViewConfig
import dev.webviewide.ui.theme.AppMotion
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
    ModalDrawerSheet(drawerContainerColor = MaterialTheme.colorScheme.surfaceContainerLow) {
        Row(
            Modifier.fillMaxWidth().padding(start = 24.dp, end = 12.dp, top = 20.dp, bottom = 8.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Column(Modifier.weight(1f)) {
                Text("文件", style = MaterialTheme.typography.labelLarge, color = MaterialTheme.colorScheme.primary)
                Text(project?.name ?: "WebViewIDE", style = MaterialTheme.typography.titleLarge, maxLines = 1)
            }
            FilledTonalIconButton(onClick = onNew) { Icon(Icons.Outlined.Add, contentDescription = "新建文件") }
        }
        Row(
            Modifier.fillMaxWidth().padding(horizontal = 16.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp),
        ) {
            AssistChip(
                onClick = onRename,
                enabled = session.current != null,
                label = { Text("改名") },
                leadingIcon = { Icon(Icons.Outlined.Edit, contentDescription = null, Modifier.size(18.dp)) },
            )
            AssistChip(
                onClick = onDelete,
                enabled = session.current != null,
                label = { Text("删除") },
                leadingIcon = { Icon(Icons.Outlined.Delete, contentDescription = null, Modifier.size(18.dp)) },
            )
        }
        HorizontalDivider(Modifier.padding(horizontal = 24.dp, vertical = 12.dp))
        if (project == null) return@ModalDrawerSheet
        val rows = remember(project.id, session.treeTick, session.expanded) {
            FileTreeIndex.rows(project.srcDir, session.expanded)
        }
        val currentRel = session.current?.let { file ->
            runCatching { file.relativeTo(project.srcDir).invariantSeparatorsPath }.getOrNull()
        }
        LazyColumn(
            Modifier.fillMaxWidth(),
            contentPadding = PaddingValues(start = 12.dp, end = 12.dp, bottom = 24.dp),
            verticalArrangement = Arrangement.spacedBy(2.dp),
        ) {
            items(rows, key = { it.rel }) { row ->
                FileRow(
                    name = row.name,
                    depth = row.depth,
                    directory = row.directory,
                    open = row.open,
                    selected = !row.directory && row.rel == currentRel,
                    modifier = Modifier.animateItem(
                        fadeInSpec = AppMotion.effects(),
                        placementSpec = AppMotion.offset,
                        fadeOutSpec = AppMotion.effects(),
                    ),
                    onClick = {
                        if (row.directory) {
                            session.expanded = if (row.open) session.expanded - row.rel else session.expanded + row.rel
                        } else {
                            session.select(File(project.srcDir, row.rel))
                            onFile()
                        }
                    },
                )
            }
        }
    }
}

@Composable
private fun FileRow(
    name: String,
    depth: Int,
    directory: Boolean,
    open: Boolean,
    selected: Boolean,
    modifier: Modifier = Modifier,
    onClick: () -> Unit,
) {
    val scheme = MaterialTheme.colorScheme
    val container by animateColorAsState(
        if (selected) scheme.secondaryContainer else scheme.surfaceContainerLow,
        animationSpec = AppMotion.effects(),
        label = "fileRowContainer",
    )
    val content by animateColorAsState(
        if (selected) scheme.onSecondaryContainer else scheme.onSurfaceVariant,
        animationSpec = AppMotion.effects(),
        label = "fileRowContent",
    )
    val chevron by animateFloatAsState(
        if (open) 90f else 0f,
        animationSpec = AppMotion.spatialFast(),
        label = "fileRowChevron",
    )
    Row(
        modifier
            .fillMaxWidth()
            .clip(CircleShape)
            .background(container)
            .clickable(onClick = onClick)
            .heightIn(min = 48.dp)
            .padding(start = 12.dp + (depth * 16).dp, end = 16.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Box(Modifier.size(24.dp), contentAlignment = Alignment.Center) {
            if (directory) {
                Icon(
                    Icons.AutoMirrored.Outlined.KeyboardArrowRight,
                    contentDescription = null,
                    tint = content,
                    modifier = Modifier.rotate(chevron),
                )
            }
        }
        Icon(
            when {
                directory && open -> Icons.Outlined.FolderOpen
                directory -> Icons.Outlined.Folder
                else -> Icons.Outlined.Description
            },
            contentDescription = null,
            tint = if (directory) scheme.primary else content,
            modifier = Modifier.padding(start = 4.dp, end = 12.dp).size(20.dp),
        )
        Text(
            name,
            maxLines = 1,
            style = MaterialTheme.typography.labelLarge,
            color = if (selected) content else scheme.onSurface,
        )
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
    val scheme = MaterialTheme.colorScheme
    val destructive = ask == NameAsk.DeleteFile
    AlertDialog(
        onDismissRequest = onDismiss,
        icon = {
            Icon(
                when (ask) {
                    NameAsk.NewFile -> Icons.AutoMirrored.Outlined.NoteAdd
                    NameAsk.RenameFile -> Icons.Outlined.DriveFileRenameOutline
                    NameAsk.DeleteFile -> Icons.Outlined.DeleteOutline
                },
                contentDescription = null,
                tint = if (destructive) scheme.error else scheme.secondary,
            )
        },
        title = { Text(title) },
        text = {
            if (destructive) {
                Text("「$currentName」会从项目里去掉。")
            } else {
                OutlinedTextField(
                    value = value,
                    onValueChange = { value = it },
                    modifier = Modifier.fillMaxWidth(),
                    singleLine = true,
                    shape = MaterialTheme.shapes.medium,
                    label = { Text(if (ask == NameAsk.NewFile) "路径，例如 css/extra.css" else "新名字") },
                )
            }
        },
        confirmButton = {
            Button(
                onClick = { onConfirm(value.trim()) },
                enabled = destructive || value.isNotBlank(),
                colors = if (destructive) {
                    ButtonDefaults.buttonColors(containerColor = scheme.error, contentColor = scheme.onError)
                } else {
                    ButtonDefaults.buttonColors()
                },
            ) { Text(if (destructive) "删除" else "好") }
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
            Text("项目", style = MaterialTheme.typography.headlineSmall)
            Surface(
                modifier = Modifier.fillMaxWidth().padding(top = 16.dp),
                shape = MaterialTheme.shapes.large,
                color = MaterialTheme.colorScheme.surfaceContainerHigh,
            ) {
                Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    Text(
                        "新建项目",
                        style = MaterialTheme.typography.titleSmall,
                        color = MaterialTheme.colorScheme.primary,
                    )
                    OutlinedTextField(
                        value = newName,
                        onValueChange = { newName = it },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true,
                        shape = MaterialTheme.shapes.medium,
                        label = { Text("给它起个名字") },
                    )
                    Row(
                        Modifier.fillMaxWidth().horizontalScroll(rememberScrollState()),
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                    ) {
                        templates.forEach { (id, label) ->
                            val selected = template == id
                            FilterChip(
                                selected = selected,
                                onClick = { template = id },
                                label = { Text(label) },
                                leadingIcon = {
                                    androidx.compose.animation.AnimatedVisibility(
                                        visible = selected,
                                        enter = scaleIn(AppMotion.spatialFast()) + fadeIn(AppMotion.effects()),
                                        exit = scaleOut(AppMotion.effectsFast()) + fadeOut(AppMotion.effectsFast()),
                                    ) {
                                        Icon(
                                            Icons.Outlined.Check,
                                            contentDescription = null,
                                            modifier = Modifier.size(FilterChipDefaults.IconSize),
                                        )
                                    }
                                },
                            )
                        }
                    }
                    Button(
                        onClick = {
                            session.create(template, newName.ifBlank { "未命名" })
                            newName = ""
                            onDismiss()
                        },
                        modifier = Modifier.fillMaxWidth(),
                    ) {
                        Icon(Icons.Outlined.Add, contentDescription = null, modifier = Modifier.size(ButtonDefaults.IconSize))
                        Spacer(Modifier.width(ButtonDefaults.IconSpacing))
                        Text("新建")
                    }
                }
            }
            Row(
                Modifier.fillMaxWidth().padding(top = 12.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp),
            ) {
                OutlinedButton(onClick = { onDismiss(); onImportFile() }, modifier = Modifier.weight(1f)) {
                    Icon(Icons.Outlined.FileOpen, contentDescription = null, modifier = Modifier.size(ButtonDefaults.IconSize))
                    Spacer(Modifier.width(ButtonDefaults.IconSpacing))
                    Text("导入文件")
                }
                OutlinedButton(onClick = { onDismiss(); onImportTree() }, modifier = Modifier.weight(1f)) {
                    Icon(Icons.Outlined.FolderOpen, contentDescription = null, modifier = Modifier.size(ButtonDefaults.IconSize))
                    Spacer(Modifier.width(ButtonDefaults.IconSpacing))
                    Text("导入文件夹")
                }
            }
            Text(
                "手机上不跑 npm。Vue、React 这类工程要先在电脑上构建，再把 dist 或 build 导入。",
                modifier = Modifier.padding(top = 8.dp),
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
            Text(
                "全部项目",
                modifier = Modifier.padding(top = 20.dp, bottom = 8.dp),
                style = MaterialTheme.typography.titleSmall,
                color = MaterialTheme.colorScheme.primary,
            )
            LazyColumn(
                Modifier.fillMaxWidth().heightIn(max = 320.dp),
                verticalArrangement = Arrangement.spacedBy(4.dp),
            ) {
                items(projects, key = { it.id }) { item ->
                    ProjectRow(
                        name = item.name,
                        summary = item.summary,
                        current = item.id == current?.id,
                        modifier = Modifier.animateItem(
                            fadeInSpec = AppMotion.effects(),
                            placementSpec = AppMotion.offset,
                            fadeOutSpec = AppMotion.effects(),
                        ),
                    ) {
                        session.openProject(item.id)
                        onDismiss()
                    }
                }
            }
            if (current != null) {
                Row(
                    Modifier.fillMaxWidth().padding(top = 16.dp),
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                ) {
                    FilledTonalButton(
                        onClick = { session.duplicate(); onDismiss() },
                        modifier = Modifier.weight(1f),
                    ) {
                        Icon(Icons.Outlined.ContentCopy, contentDescription = null, modifier = Modifier.size(ButtonDefaults.IconSize))
                        Spacer(Modifier.width(ButtonDefaults.IconSpacing))
                        Text("复制项目")
                    }
                    OutlinedButton(
                        onClick = { confirmDelete = true },
                        modifier = Modifier.weight(1f),
                        colors = ButtonDefaults.outlinedButtonColors(contentColor = MaterialTheme.colorScheme.error),
                    ) {
                        Icon(Icons.Outlined.DeleteOutline, contentDescription = null, modifier = Modifier.size(ButtonDefaults.IconSize))
                        Spacer(Modifier.width(ButtonDefaults.IconSpacing))
                        Text("删除项目")
                    }
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

@Composable
private fun ProjectRow(
    name: String,
    summary: String,
    current: Boolean,
    modifier: Modifier = Modifier,
    onClick: () -> Unit,
) {
    val scheme = MaterialTheme.colorScheme
    val container by animateColorAsState(
        if (current) scheme.secondaryContainer else scheme.surfaceContainerLow,
        animationSpec = AppMotion.effects(),
        label = "projectRow",
    )
    Surface(
        onClick = onClick,
        modifier = modifier.fillMaxWidth(),
        shape = MaterialTheme.shapes.large,
        color = container,
    ) {
        Row(
            Modifier.padding(horizontal = 16.dp, vertical = 12.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Column(Modifier.weight(1f)) {
                Text(
                    name,
                    maxLines = 1,
                    style = MaterialTheme.typography.titleMedium,
                    color = if (current) scheme.onSecondaryContainer else scheme.onSurface,
                )
                Text(
                    summary,
                    maxLines = 1,
                    style = MaterialTheme.typography.bodySmall,
                    color = scheme.onSurfaceVariant,
                )
            }
            if (current) {
                Icon(
                    Icons.Outlined.Check,
                    contentDescription = "当前项目",
                    tint = scheme.onSecondaryContainer,
                )
            }
        }
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
            verticalArrangement = Arrangement.spacedBy(12.dp),
        ) {
            Text("WebView 和服务", style = MaterialTheme.typography.headlineSmall)
            SectionCard("预览服务", Icons.Outlined.Link) {
                Text(url ?: "预览还没起来", style = MaterialTheme.typography.bodyMedium)
                lanUrl?.let {
                    Text(
                        it,
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
                Row(verticalAlignment = Alignment.CenterVertically) {
                    OutlinedTextField(
                        value = portText,
                        onValueChange = { portText = it.filter { ch -> ch.isDigit() }.take(5) },
                        modifier = Modifier.weight(1f),
                        singleLine = true,
                        shape = MaterialTheme.shapes.medium,
                        label = { Text("端口") },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                    )
                    Spacer(Modifier.width(8.dp))
                    FilledTonalButton(onClick = {
                        val port = portText.toIntOrNull()?.coerceIn(1024, 65535) ?: return@FilledTonalButton
                        onProject(project.copy(serverPort = port), true)
                    }) { Text("使用") }
                }
                ToggleRow("局域网也能打开", project.lan) { onProject(project.copy(lan = it), true) }
                ToggleRow("改完马上刷新", project.liveReload) { onProject(project.copy(liveReload = it), true) }
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    FilledTonalButton(
                        onClick = onCopy,
                        enabled = url != null || lanUrl != null,
                        contentPadding = ButtonDefaults.ButtonWithIconContentPadding,
                    ) {
                        Icon(Icons.Outlined.ContentCopy, contentDescription = null, modifier = Modifier.size(ButtonDefaults.IconSize))
                        Spacer(Modifier.width(ButtonDefaults.IconSpacing))
                        Text("复制地址")
                    }
                    OutlinedButton(
                        onClick = onClear,
                        contentPadding = ButtonDefaults.ButtonWithIconContentPadding,
                    ) {
                        Icon(Icons.Outlined.DeleteSweep, contentDescription = null, modifier = Modifier.size(ButtonDefaults.IconSize))
                        Spacer(Modifier.width(ButtonDefaults.IconSpacing))
                        Text("清掉缓存")
                    }
                }
            }
            SectionCard("页面能力", Icons.Outlined.Extension) {
                webFlags.forEachIndexed { index, flag ->
                    ToggleRow(flag.label, flag.read(config)) { checked ->
                        onProject(project.copy(webview = flag.write(config, checked)), false)
                    }
                    if (index < webFlags.lastIndex) HorizontalDivider()
                }
            }
            SectionCard("渲染", Icons.Outlined.Palette) {
                ChipGroup(
                    title = "混合内容",
                    options = listOf(
                        WebViewConfig.MIXED_NEVER to "不允许",
                        WebViewConfig.MIXED_COMPAT to "兼容",
                        WebViewConfig.MIXED_ALWAYS to "允许",
                    ),
                    selected = config.mixedContent,
                ) { onProject(project.copy(webview = config.copy(mixedContent = it)), false) }
                ChipGroup(
                    title = "缓存",
                    options = listOf(
                        WebViewConfig.CACHE_DEFAULT to "默认",
                        WebViewConfig.CACHE_NO to "不用缓存",
                        WebViewConfig.CACHE_ELSE_NETWORK to "缓存优先",
                        WebViewConfig.CACHE_ONLY to "只用缓存",
                    ),
                    selected = config.cacheMode,
                ) { onProject(project.copy(webview = config.copy(cacheMode = it)), false) }
                ChipGroup(
                    title = "浏览器标识",
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
                        shape = MaterialTheme.shapes.medium,
                        label = { Text("自定义标识") },
                        singleLine = true,
                    )
                }
                Text("文字大小 · ${config.textZoom}%", style = MaterialTheme.typography.titleSmall)
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
            verticalArrangement = Arrangement.spacedBy(12.dp),
        ) {
            Text("打包", style = MaterialTheme.typography.headlineSmall)
            if (!project.runnable) {
                Surface(
                    shape = MaterialTheme.shapes.medium,
                    color = MaterialTheme.colorScheme.errorContainer,
                    contentColor = MaterialTheme.colorScheme.onErrorContainer,
                ) {
                    Text(project.summary, Modifier.padding(12.dp), style = MaterialTheme.typography.bodyMedium)
                }
            } else {
                Text(
                    "打进去的是现在能预览的那一层。",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
            SectionCard("基本信息", Icons.Outlined.Badge) {
                OutlinedTextField(
                    name,
                    { name = it },
                    Modifier.fillMaxWidth(),
                    singleLine = true,
                    shape = MaterialTheme.shapes.medium,
                    label = { Text("应用名") },
                )
                OutlinedTextField(
                    packageName,
                    { packageName = it },
                    Modifier.fillMaxWidth(),
                    singleLine = true,
                    shape = MaterialTheme.shapes.medium,
                    label = { Text("包名") },
                )
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    OutlinedTextField(
                        versionName,
                        { versionName = it },
                        Modifier.weight(1f),
                        singleLine = true,
                        shape = MaterialTheme.shapes.medium,
                        label = { Text("版本名") },
                    )
                    OutlinedTextField(
                        versionCode,
                        { versionCode = it.filter { ch -> ch.isDigit() }.take(6) },
                        Modifier.weight(1f),
                        singleLine = true,
                        shape = MaterialTheme.shapes.medium,
                        label = { Text("版本号") },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                    )
                }
            }
            SectionCard("外观", Icons.Outlined.Palette) {
                Text("图标底色", style = MaterialTheme.typography.titleSmall)
                Row(horizontalArrangement = Arrangement.spacedBy(12.dp), verticalAlignment = Alignment.CenterVertically) {
                    listOf(0xFF185FA5, 0xFF0F6E56, 0xFF993C1D, 0xFF534AB7, 0xFF222222).forEach { color ->
                        val selected = iconColor == color
                        Box(
                            Modifier
                                .size(if (selected) 36.dp else 28.dp)
                                .clip(CircleShape)
                                .background(Color(color.toInt()))
                                .clickable { iconColor = color },
                        ) {
                            if (selected) {
                                Icon(
                                    Icons.Outlined.Check,
                                    contentDescription = null,
                                    tint = Color.White,
                                    modifier = Modifier.align(Alignment.Center).size(18.dp),
                                )
                            }
                        }
                    }
                }
                OutlinedButton(onClick = onPickIcon, contentPadding = ButtonDefaults.ButtonWithIconContentPadding) {
                    Icon(Icons.Outlined.Image, contentDescription = null, modifier = Modifier.size(ButtonDefaults.IconSize))
                    Spacer(Modifier.width(ButtonDefaults.IconSpacing))
                    Text(if (project.iconPath.isNullOrBlank()) "选一张图" else "已选 ${project.iconPath}")
                }
            }
            SectionCard("构建", Icons.Outlined.Build) {
                ChipGroup(
                    title = "方向",
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
            }
            Button(
                onClick = {
                    onProject(edited())
                    onPack()
                },
                enabled = project.runnable,
                modifier = Modifier.fillMaxWidth().heightIn(min = 56.dp),
            ) {
                Icon(Icons.Outlined.RocketLaunch, contentDescription = null, modifier = Modifier.size(ButtonDefaults.IconSize))
                Spacer(Modifier.width(ButtonDefaults.IconSpacing))
                Text("开始打包", style = MaterialTheme.typography.titleMedium)
            }
        }
    }
}

@Composable
private fun SectionCard(
    title: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    content: @Composable () -> Unit,
) {
    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Icon(
                icon,
                contentDescription = null,
                modifier = Modifier.size(18.dp),
                tint = MaterialTheme.colorScheme.primary,
            )
            Spacer(Modifier.width(8.dp))
            Text(title, style = MaterialTheme.typography.titleSmall, color = MaterialTheme.colorScheme.primary)
        }
        Surface(
            modifier = Modifier.fillMaxWidth(),
            shape = MaterialTheme.shapes.large,
            color = MaterialTheme.colorScheme.surfaceContainerHigh,
        ) {
            Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                content()
            }
        }
    }
}

@Composable
private fun ChipGroup(
    title: String,
    options: List<Pair<String, String>>,
    selected: String,
    onSelect: (String) -> Unit,
) {
    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
        Text(title, style = MaterialTheme.typography.titleSmall)
        Row(
            Modifier.horizontalScroll(rememberScrollState()),
            horizontalArrangement = Arrangement.spacedBy(8.dp),
        ) {
            options.forEach { (value, label) ->
                FilterChip(selected = selected == value, onClick = { onSelect(value) }, label = { Text(label) })
            }
        }
    }
}

@Composable
private fun ToggleRow(label: String, checked: Boolean, onChecked: (Boolean) -> Unit) {
    Row(
        Modifier
            .fillMaxWidth()
            .clip(MaterialTheme.shapes.small)
            .clickable { onChecked(!checked) }
            .heightIn(min = 48.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Text(label, modifier = Modifier.weight(1f).padding(end = 12.dp), style = MaterialTheme.typography.bodyLarge)
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

package dev.webviewide.ui

import android.content.Intent
import android.net.Uri
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.Crossfade
import androidx.compose.animation.expandVertically
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.scaleIn
import androidx.compose.animation.shrinkVertically
import androidx.compose.animation.slideInVertically
import androidx.compose.animation.slideOutVertically
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.Add
import androidx.compose.material.icons.outlined.Archive
import androidx.compose.material.icons.outlined.AutoFixHigh
import androidx.compose.material.icons.outlined.Close
import androidx.compose.material.icons.outlined.Code
import androidx.compose.material.icons.outlined.Description
import androidx.compose.material.icons.outlined.ExpandMore
import androidx.compose.material.icons.outlined.FolderOpen
import androidx.compose.material.icons.outlined.Info
import androidx.compose.material.icons.outlined.MoreVert
import androidx.compose.material.icons.outlined.OpenInBrowser
import androidx.compose.material.icons.outlined.PlayArrow
import androidx.compose.material.icons.outlined.Refresh
import androidx.compose.material.icons.outlined.Tune
import androidx.compose.material.icons.outlined.VerticalSplit
import androidx.compose.material.icons.outlined.Visibility
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.DrawerValue
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilledTonalButton
import androidx.compose.material3.FilledTonalIconButton
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.LocalContentColor
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalNavigationDrawer
import androidx.compose.material3.Scaffold
import androidx.compose.material3.ShortNavigationBar
import androidx.compose.material3.ShortNavigationBarItem
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.material3.rememberDrawerState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.SideEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.hapticfeedback.HapticFeedbackType
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalHapticFeedback
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import dev.webviewide.preview.WebPreview
import dev.webviewide.project.ProjectIds
import dev.webviewide.project.ProjectStore
import dev.webviewide.project.isRasterImage
import dev.webviewide.project.sourceKindFor
import dev.webviewide.ui.bifold.BifoldMode
import dev.webviewide.ui.bifold.BifoldScaffold
import dev.webviewide.ui.bifold.rememberBifoldState
import dev.webviewide.ui.editor.CodeEditor
import dev.webviewide.ui.editor.ImageFace
import dev.webviewide.ui.theme.AppMotion
import kotlinx.coroutines.launch

private enum class Panel { PROJECTS, SETTINGS, PACKAGE }

@Composable
fun rememberIdeSession(): IdeSession {
    val context = LocalContext.current.applicationContext
    val scope = rememberCoroutineScope()
    val session = remember { IdeSession(context, scope) }
    DisposableEffect(session) {
        session.openCurrent()
        onDispose { session.close() }
    }
    return session
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun IdeScreen() {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    val haptic = LocalHapticFeedback.current
    val session = rememberIdeSession()
    val bifold = rememberBifoldState()
    val drawerState = rememberDrawerState(DrawerValue.Closed)
    var panel by remember { mutableStateOf<Panel?>(null) }
    var menu by remember { mutableStateOf(false) }
    var naming by remember { mutableStateOf<NameAsk?>(null) }
    val project = session.project
    val currentPath = session.current?.let { file ->
        project?.let { open -> runCatching { ProjectStore.relative(open, file) }.getOrDefault(file.name) }
    }.orEmpty()

    val importFile = rememberLauncherForActivityResult(ActivityResultContracts.OpenDocument()) { uri ->
        if (uri != null) {
            keepRead(context, uri)
            session.importFile(uri)
        }
    }
    val importTree = rememberLauncherForActivityResult(ActivityResultContracts.OpenDocumentTree()) { uri ->
        if (uri != null) {
            keepRead(context, uri)
            session.importTree(uri)
        }
    }
    val importIcon = rememberLauncherForActivityResult(ActivityResultContracts.OpenDocument()) { uri ->
        if (uri != null) session.importIcon(uri)
    }

    fun switchMode(mode: BifoldMode) {
        if (bifold.mode == mode) return
        haptic.performHapticFeedback(HapticFeedbackType.SegmentTick)
        bifold.mode = mode
    }

    ModalNavigationDrawer(
        drawerState = drawerState,
        gesturesEnabled = drawerState.isOpen,
        drawerContent = {
            FileDrawer(
                session = session,
                onFile = { scope.launch { drawerState.close() } },
                onNew = { naming = NameAsk.NewFile },
                onRename = { naming = NameAsk.RenameFile },
                onDelete = { naming = NameAsk.DeleteFile },
            )
        },
    ) {
        Scaffold(
            containerColor = MaterialTheme.colorScheme.surfaceContainer,
            topBar = {
                TopAppBar(
                    colors = TopAppBarDefaults.topAppBarColors(
                        containerColor = MaterialTheme.colorScheme.surfaceContainer,
                        scrolledContainerColor = MaterialTheme.colorScheme.surfaceContainer,
                    ),
                    navigationIcon = {
                        IconButton(onClick = { scope.launch { drawerState.open() } }) {
                            Icon(Icons.Outlined.FolderOpen, contentDescription = "文件")
                        }
                    },
                    title = {
                        ProjectTitle(
                            name = project?.name ?: "WebViewIDE",
                            path = currentPath,
                            onClick = { panel = Panel.PROJECTS },
                        )
                    },
                    actions = {
                        RunButton(
                            busy = session.busy,
                            enabled = project != null && !session.busy,
                            onClick = {
                                haptic.performHapticFeedback(HapticFeedbackType.Confirm)
                                if (bifold.mode == BifoldMode.CODE) bifold.mode = BifoldMode.BOTH
                                session.runPreview()
                            },
                        )
                        Spacer(Modifier.width(4.dp))
                        FilledTonalIconButton(
                            onClick = {
                                haptic.performHapticFeedback(HapticFeedbackType.Confirm)
                                panel = Panel.PACKAGE
                            },
                            enabled = project != null && !session.busy,
                        ) {
                            Icon(Icons.Outlined.Archive, contentDescription = "打包")
                        }
                        Box {
                            IconButton(onClick = { menu = true }) {
                                Icon(Icons.Outlined.MoreVert, contentDescription = "更多")
                            }
                            DropdownMenu(expanded = menu, onDismissRequest = { menu = false }) {
                                DropdownMenuItem(
                                    text = { Text("在浏览器打开") },
                                    leadingIcon = { Icon(Icons.Outlined.OpenInBrowser, contentDescription = null) },
                                    onClick = {
                                        menu = false
                                        val address = session.url
                                        if (address == null) {
                                            session.status = "预览还没起来"
                                        } else {
                                            runCatching {
                                                context.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(address)))
                                            }.onFailure { session.status = "系统浏览器没有打开" }
                                        }
                                    },
                                )
                                DropdownMenuItem(
                                    text = { Text("重新加载") },
                                    leadingIcon = { Icon(Icons.Outlined.Refresh, contentDescription = null) },
                                    onClick = {
                                        menu = false
                                        session.runPreview()
                                    },
                                )
                                HorizontalDivider(Modifier.padding(vertical = 4.dp))
                                DropdownMenuItem(
                                    text = { Text("WebView 和服务") },
                                    leadingIcon = { Icon(Icons.Outlined.Tune, contentDescription = null) },
                                    onClick = {
                                        menu = false
                                        panel = Panel.SETTINGS
                                    },
                                )
                                DropdownMenuItem(
                                    text = { Text("重新识别") },
                                    leadingIcon = { Icon(Icons.Outlined.AutoFixHigh, contentDescription = null) },
                                    onClick = {
                                        menu = false
                                        session.redetect()
                                    },
                                )
                            }
                        }
                    },
                )
            },
            bottomBar = {
                ShortNavigationBar(containerColor = MaterialTheme.colorScheme.surfaceContainer) {
                    ModeItem(bifold.mode == BifoldMode.CODE, "代码", Icons.Outlined.Code) {
                        switchMode(BifoldMode.CODE)
                    }
                    ModeItem(bifold.mode == BifoldMode.BOTH, "分屏", Icons.Outlined.VerticalSplit) {
                        switchMode(BifoldMode.BOTH)
                    }
                    ModeItem(bifold.mode == BifoldMode.PREVIEW, "预览", Icons.Outlined.Visibility) {
                        switchMode(BifoldMode.PREVIEW)
                    }
                }
            },
        ) { inner ->
            Crossfade(
                targetState = project != null,
                animationSpec = AppMotion.effects(),
                modifier = Modifier.padding(inner).fillMaxSize(),
                label = "workspace",
            ) { ready ->
                val open = project
                if (!ready || open == null) {
                    Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                        CircularProgressIndicator()
                    }
                    return@Crossfade
                }
                Column(Modifier.fillMaxSize()) {
                    StatusBanner(
                        message = session.status,
                        onDismiss = { session.status = null },
                    )
                    Surface(
                        modifier = Modifier
                            .weight(1f)
                            .fillMaxWidth()
                            .padding(start = 8.dp, end = 8.dp, top = 4.dp),
                        shape = MaterialTheme.shapes.large,
                        color = MaterialTheme.colorScheme.surface,
                    ) {
                        Box(Modifier.fillMaxSize()) {
                            BifoldScaffold(
                                state = bifold,
                                modifier = Modifier.fillMaxSize(),
                                codeFace = {
                                    AnimatedContent(
                                        targetState = session.current,
                                        contentKey = { it?.path },
                                        transitionSpec = {
                                            (
                                                fadeIn(animationSpec = AppMotion.effects()) +
                                                    scaleIn(animationSpec = AppMotion.spatial(), initialScale = 0.98f)
                                                ) togetherWith fadeOut(animationSpec = AppMotion.effectsFast())
                                        },
                                        label = "editor",
                                    ) { file ->
                                        when {
                                            file == null -> EmptyEditor(
                                                onOpen = { scope.launch { drawerState.open() } },
                                                onNew = { naming = NameAsk.NewFile },
                                            )
                                            isRasterImage(file.name) -> ImageFace(file)
                                            else -> CodeEditor(
                                                path = runCatching { ProjectStore.relative(open, file) }
                                                    .getOrDefault(file.name),
                                                initial = session.draft,
                                                kind = sourceKindFor(file.name),
                                                onText = { session.edit(it) },
                                            )
                                        }
                                    }
                                },
                                previewFace = {
                                    WebPreview(
                                        url = session.url,
                                        config = open.webview,
                                        profile = ProjectIds.profileName(open.id),
                                        reloadKey = session.reloadKey,
                                        localRoot = open.serveDir,
                                        modifier = Modifier.fillMaxSize(),
                                        onStatus = { session.status = it },
                                        onWebView = session::attachWebView,
                                    )
                                },
                            )
                            BusyBar(
                                visible = session.busy,
                                modifier = Modifier.align(Alignment.TopCenter).fillMaxWidth(),
                            )
                        }
                    }
                }
            }
        }
    }

    when (panel) {
        Panel.PROJECTS -> ProjectSheet(
            session = session,
            onImportFile = { importFile.launch(arrayOf("*/*")) },
            onImportTree = { importTree.launch(null) },
            onDismiss = { panel = null },
        )
        Panel.SETTINGS -> project?.let { open ->
            SettingsSheet(
                project = open,
                url = session.url,
                lanUrl = session.lanUrl,
                onProject = { next, restart -> session.update(next, restart) },
                onCopy = { session.copyUrl() },
                onClear = { session.clearSiteData() },
                onDismiss = { panel = null },
            )
        }
        Panel.PACKAGE -> project?.let { open ->
            PackageSheet(
                project = open,
                onProject = { next -> session.update(next, false) },
                onPickIcon = { importIcon.launch(arrayOf("image/*")) },
                onPack = {
                    panel = null
                    session.pack()
                },
                onDismiss = { panel = null },
            )
        }
        null -> Unit
    }

    naming?.let { ask ->
        NameDialog(
            ask = ask,
            currentName = session.current?.name.orEmpty(),
            onDismiss = { naming = null },
            onConfirm = { value ->
                naming = null
                when (ask) {
                    NameAsk.NewFile -> session.createFile(value)
                    NameAsk.RenameFile -> {
                        val file = session.current ?: return@NameDialog
                        val rel = runCatching { ProjectStore.relative(project ?: return@NameDialog, file) }.getOrNull()
                            ?: return@NameDialog
                        session.renameFile(rel, value)
                    }
                    NameAsk.DeleteFile -> {
                        val file = session.current ?: return@NameDialog
                        val rel = runCatching { ProjectStore.relative(project ?: return@NameDialog, file) }.getOrNull()
                            ?: return@NameDialog
                        session.deleteFile(rel)
                    }
                }
            },
        )
    }
}

@Composable
private fun ProjectTitle(name: String, path: String, onClick: () -> Unit) {
    Row(
        Modifier
            .clip(MaterialTheme.shapes.medium)
            .clickable(onClick = onClick)
            .padding(horizontal = 8.dp, vertical = 4.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Column(Modifier.weight(1f, fill = false)) {
            Text(
                name,
                style = MaterialTheme.typography.titleMedium,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
            )
            AnimatedContent(
                targetState = path,
                transitionSpec = {
                    (slideInVertically(animationSpec = AppMotion.offset) { it / 2 } + fadeIn(animationSpec = AppMotion.effects())) togetherWith
                        (slideOutVertically(animationSpec = AppMotion.offset) { -it / 2 } + fadeOut(animationSpec = AppMotion.effectsFast()))
                },
                label = "path",
            ) { shown ->
                Text(
                    shown.ifBlank { "未打开文件" },
                    style = MaterialTheme.typography.labelMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                )
            }
        }
        Icon(
            Icons.Outlined.ExpandMore,
            contentDescription = "切换项目",
            modifier = Modifier.padding(start = 4.dp).size(20.dp),
            tint = MaterialTheme.colorScheme.onSurfaceVariant,
        )
    }
}

@Composable
private fun RunButton(busy: Boolean, enabled: Boolean, onClick: () -> Unit) {
    Button(
        onClick = onClick,
        enabled = enabled,
        contentPadding = ButtonDefaults.ButtonWithIconContentPadding,
        modifier = Modifier.height(40.dp),
    ) {
        AnimatedContent(
            targetState = busy,
            transitionSpec = {
                (fadeIn(animationSpec = AppMotion.effects()) + scaleIn(animationSpec = AppMotion.spatialFast(), initialScale = 0.6f)) togetherWith
                    fadeOut(animationSpec = AppMotion.effectsFast())
            },
            label = "run",
        ) { running ->
            if (running) {
                CircularProgressIndicator(
                    modifier = Modifier.size(ButtonDefaults.IconSize),
                    color = LocalContentColor.current,
                    strokeWidth = 2.dp,
                )
            } else {
                Icon(Icons.Outlined.PlayArrow, contentDescription = null, modifier = Modifier.size(ButtonDefaults.IconSize))
            }
        }
        Spacer(Modifier.width(ButtonDefaults.IconSpacing))
        Text("运行")
    }
}

@Composable
private fun StatusBanner(message: String?, onDismiss: () -> Unit) {
    val last = remember { mutableStateOf("") }
    val text = message ?: last.value
    SideEffect { if (message != null) last.value = message }
    AnimatedVisibility(
        visible = message != null,
        enter = expandVertically(animationSpec = AppMotion.size, expandFrom = Alignment.Top) +
            fadeIn(animationSpec = AppMotion.effects()),
        exit = shrinkVertically(animationSpec = AppMotion.size, shrinkTowards = Alignment.Top) +
            fadeOut(animationSpec = AppMotion.effectsFast()),
    ) {
        Surface(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 8.dp, vertical = 4.dp),
            shape = MaterialTheme.shapes.large,
            color = MaterialTheme.colorScheme.secondaryContainer,
            contentColor = MaterialTheme.colorScheme.onSecondaryContainer,
        ) {
            Row(
                Modifier.padding(start = 16.dp, end = 4.dp, top = 2.dp, bottom = 2.dp),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Icon(Icons.Outlined.Info, contentDescription = null, modifier = Modifier.size(18.dp))
                Spacer(Modifier.width(12.dp))
                AnimatedContent(
                    targetState = text,
                    transitionSpec = {
                        fadeIn(animationSpec = AppMotion.effects()) togetherWith fadeOut(animationSpec = AppMotion.effectsFast())
                    },
                    modifier = Modifier.weight(1f),
                    label = "status",
                ) { shown ->
                    Text(shown, style = MaterialTheme.typography.bodyMedium, maxLines = 3, overflow = TextOverflow.Ellipsis)
                }
                IconButton(onClick = onDismiss) {
                    Icon(Icons.Outlined.Close, contentDescription = "关闭", modifier = Modifier.size(18.dp))
                }
            }
        }
    }
}

@Composable
private fun EmptyEditor(onOpen: () -> Unit, onNew: () -> Unit) {
    Column(
        Modifier.fillMaxSize().padding(32.dp),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        Surface(
            modifier = Modifier.size(72.dp),
            shape = MaterialTheme.shapes.extraLarge,
            color = MaterialTheme.colorScheme.primaryContainer,
            contentColor = MaterialTheme.colorScheme.onPrimaryContainer,
        ) {
            Box(contentAlignment = Alignment.Center) {
                Icon(Icons.Outlined.Description, contentDescription = null, modifier = Modifier.size(32.dp))
            }
        }
        Spacer(Modifier.height(16.dp))
        Text("还没有打开文件", style = MaterialTheme.typography.titleMedium)
        Spacer(Modifier.height(4.dp))
        Text(
            "从文件列表里选一个，或者新建一个。",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            textAlign = TextAlign.Center,
        )
        Spacer(Modifier.height(24.dp))
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            FilledTonalButton(onClick = onOpen, contentPadding = ButtonDefaults.ButtonWithIconContentPadding) {
                Icon(Icons.Outlined.FolderOpen, contentDescription = null, modifier = Modifier.size(ButtonDefaults.IconSize))
                Spacer(Modifier.width(ButtonDefaults.IconSpacing))
                Text("文件列表")
            }
            Button(onClick = onNew, contentPadding = ButtonDefaults.ButtonWithIconContentPadding) {
                Icon(Icons.Outlined.Add, contentDescription = null, modifier = Modifier.size(ButtonDefaults.IconSize))
                Spacer(Modifier.width(ButtonDefaults.IconSpacing))
                Text("新建文件")
            }
        }
    }
}

@Composable
private fun ModeItem(
    selected: Boolean,
    label: String,
    icon: ImageVector,
    onClick: () -> Unit,
) {
    ShortNavigationBarItem(
        selected = selected,
        onClick = onClick,
        icon = { Icon(icon, contentDescription = null) },
        label = { Text(label) },
    )
}

@Composable
private fun BusyBar(visible: Boolean, modifier: Modifier = Modifier) {
    AnimatedVisibility(
        visible = visible,
        enter = fadeIn(animationSpec = AppMotion.effects()),
        exit = fadeOut(animationSpec = AppMotion.effects()),
        modifier = modifier,
    ) {
        LinearProgressIndicator(Modifier.fillMaxWidth())
    }
}

private fun keepRead(context: android.content.Context, uri: Uri) {
    runCatching {
        context.contentResolver.takePersistableUriPermission(
            uri,
            Intent.FLAG_GRANT_READ_URI_PERMISSION,
        )
    }
}
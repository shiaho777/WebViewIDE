package dev.webviewide.ui

import android.content.Intent
import android.net.Uri
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.Code
import androidx.compose.material.icons.outlined.Menu
import androidx.compose.material.icons.outlined.MoreVert
import androidx.compose.material.icons.outlined.VerticalSplit
import androidx.compose.material.icons.outlined.Visibility
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalNavigationDrawer
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.rememberDrawerState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.hapticfeedback.HapticFeedbackType
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalHapticFeedback
import androidx.compose.ui.unit.dp
import androidx.compose.material3.DrawerValue
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

    ModalNavigationDrawer(
        drawerState = drawerState,
        gesturesEnabled = false,
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
            topBar = {
                TopAppBar(
                    navigationIcon = {
                        IconButton(onClick = { scope.launch { drawerState.open() } }) {
                            Icon(Icons.Outlined.Menu, contentDescription = "文件")
                        }
                    },
                    title = {
                        TextButton(onClick = { panel = Panel.PROJECTS }) {
                            Text(project?.name ?: "WebViewIDE", maxLines = 1)
                        }
                    },
                    actions = {
                        TextButton(
                            onClick = {
                                haptic.performHapticFeedback(HapticFeedbackType.Confirm)
                                if (bifold.mode == BifoldMode.CODE) bifold.mode = BifoldMode.BOTH
                                session.runPreview()
                            },
                            enabled = project != null && !session.busy,
                        ) { Text("运行") }
                        TextButton(
                            onClick = {
                                haptic.performHapticFeedback(HapticFeedbackType.Confirm)
                                panel = Panel.PACKAGE
                            },
                            enabled = project != null && !session.busy,
                        ) { Text("打包") }
                        IconButton(onClick = { menu = true }) {
                            Icon(Icons.Outlined.MoreVert, contentDescription = "更多")
                        }
                        DropdownMenu(expanded = menu, onDismissRequest = { menu = false }) {
                            DropdownMenuItem(
                                text = { Text("在浏览器打开") },
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
                                onClick = {
                                    menu = false
                                    session.runPreview()
                                },
                            )
                            DropdownMenuItem(
                                text = { Text("WebView 和服务") },
                                onClick = {
                                    menu = false
                                    panel = Panel.SETTINGS
                                },
                            )
                            DropdownMenuItem(
                                text = { Text("重新识别") },
                                onClick = {
                                    menu = false
                                    session.redetect()
                                },
                            )
                        }
                    },
                )
            },
            bottomBar = {
                NavigationBar {
                    ModeItem(bifold.mode == BifoldMode.CODE, "代码", Icons.Outlined.Code) {
                        bifold.mode = BifoldMode.CODE
                    }
                    ModeItem(bifold.mode == BifoldMode.BOTH, "分屏", Icons.Outlined.VerticalSplit) {
                        bifold.mode = BifoldMode.BOTH
                    }
                    ModeItem(bifold.mode == BifoldMode.PREVIEW, "预览", Icons.Outlined.Visibility) {
                        bifold.mode = BifoldMode.PREVIEW
                    }
                }
            },
        ) { inner ->
            if (project == null) {
                Box(Modifier.padding(inner).fillMaxSize(), contentAlignment = Alignment.Center) {
                    CircularProgressIndicator()
                }
            } else {
                Column(Modifier.padding(inner).fillMaxSize()) {
                    if (session.busy) LinearProgressIndicator(Modifier.fillMaxWidth())
                    session.status?.let { message ->
                        Text(
                            message,
                            modifier = Modifier.padding(horizontal = 16.dp, vertical = 4.dp),
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                            maxLines = 3,
                        )
                    }
                    BifoldScaffold(
                        state = bifold,
                        modifier = Modifier.weight(1f).fillMaxWidth(),
                        codeFace = {
                            val file = session.current
                            if (file != null && isRasterImage(file.name)) {
                                ImageFace(file)
                            } else {
                                val path = file?.let {
                                    runCatching { ProjectStore.relative(project, it) }.getOrDefault(it.name)
                                }.orEmpty()
                                CodeEditor(
                                    path = path.ifBlank { "还没有打开文件" },
                                    initial = session.draft,
                                    kind = sourceKindFor(file?.name ?: ""),
                                    onText = { session.edit(it) },
                                )
                            }
                        },
                        previewFace = {
                            WebPreview(
                                url = session.url,
                                config = project.webview,
                                profile = ProjectIds.profileName(project.id),
                                reloadKey = session.reloadKey,
                                localRoot = project.serveDir,
                                modifier = Modifier.fillMaxSize(),
                                onStatus = { session.status = it },
                                onWebView = session::attachWebView,
                            )
                        },
                    )
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
private fun RowScope.ModeItem(
    selected: Boolean,
    label: String,
    icon: ImageVector,
    onClick: () -> Unit,
) {
    NavigationBarItem(
        selected = selected,
        onClick = onClick,
        icon = { Icon(icon, contentDescription = null) },
        label = { Text(label) },
        alwaysShowLabel = true,
    )
}

private fun keepRead(context: android.content.Context, uri: Uri) {
    runCatching {
        context.contentResolver.takePersistableUriPermission(
            uri,
            Intent.FLAG_GRANT_READ_URI_PERMISSION,
        )
    }
}

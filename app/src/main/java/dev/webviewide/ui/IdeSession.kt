package dev.webviewide.ui

import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.net.Uri
import android.webkit.CookieManager
import android.webkit.WebStorage
import android.webkit.WebView
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.webkit.WebViewFeature
import dev.webviewide.build.ApkInstaller
import dev.webviewide.build.ApkPackager
import dev.webviewide.build.BuildConfig
import dev.webviewide.build.DebugKeystore
import dev.webviewide.build.Orientation
import dev.webviewide.project.DocumentImport
import dev.webviewide.project.DraftSaver
import dev.webviewide.project.ProjectIds
import dev.webviewide.project.ProjectStore
import dev.webviewide.project.WebProject
import dev.webviewide.project.isRasterImage
import dev.webviewide.server.LocalPreviewServer
import dev.webviewide.server.SiteFiles
import java.io.File
import java.lang.ref.WeakReference
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class IdeSession(
    private val app: Context,
    private val scope: CoroutineScope,
) {
    var project by mutableStateOf<WebProject?>(null)
    var current by mutableStateOf<File?>(null)
    var draft by mutableStateOf("")
    var status by mutableStateOf<String?>(null)
    var busy by mutableStateOf(false)
    var url by mutableStateOf<String?>(null)
    var lanUrl by mutableStateOf<String?>(null)
    var reloadKey by mutableIntStateOf(0)
    var treeTick by mutableIntStateOf(0)
    var expanded by mutableStateOf(setOf<String>())

    val server = LocalPreviewServer()
    private var saveJob: Job? = null
    private var serverJob: Job? = null
    private val saver = DraftSaver()
    private var version = 0L
    private val dirty: Boolean get() = !saver.isSaved(version)
    private var lastProjectId: String? = null
    private var liveWeb: WeakReference<WebView>? = null

    fun openCurrent() {
        scope.launch {
            val opened = withContext(Dispatchers.IO) { ProjectStore.current(app) }
            show(opened)
        }
    }

    fun close() {
        saveJob?.cancel()
        serverJob?.cancel()
        flushBlocking()
        server.stop()
    }

    fun projects(): List<WebProject> = ProjectStore.list(app)

    fun openProject(id: String) {
        flushBlocking()
        scope.launch {
            val opened = withContext(Dispatchers.IO) { ProjectStore.open(app, id) }
            show(opened)
        }
    }

    fun create(template: String, name: String) {
        flushBlocking()
        scope.launch {
            val created = withContext(Dispatchers.IO) { ProjectStore.create(app, template, name) }
            show(created)
            status = "已新建 ${created.name}"
        }
    }

    fun importFile(uri: Uri) {
        flushBlocking()
        busy = true
        status = "正在导入"
        scope.launch {
            val outcome = withContext(Dispatchers.IO) { runCatching { DocumentImport.importFile(app, uri) } }
            busy = false
            outcome.fold(
                onSuccess = {
                    show(it)
                    status = it.summary
                },
                onFailure = { status = it.message ?: "导入失败" },
            )
        }
    }

    fun importTree(uri: Uri) {
        flushBlocking()
        busy = true
        status = "正在导入文件夹"
        scope.launch {
            val outcome = withContext(Dispatchers.IO) { runCatching { DocumentImport.importTree(app, uri) } }
            busy = false
            outcome.fold(
                onSuccess = {
                    show(it)
                    status = it.summary
                },
                onFailure = { status = it.message ?: "导入失败" },
            )
        }
    }

    fun rename(name: String) {
        val currentProject = project ?: return
        scope.launch {
            val next = withContext(Dispatchers.IO) { ProjectStore.rename(currentProject, name) }
            project = next
        }
    }

    fun duplicate() {
        val currentProject = project ?: return
        flushBlocking()
        scope.launch {
            val next = withContext(Dispatchers.IO) { ProjectStore.duplicate(app, currentProject) }
            show(next)
        }
    }

    fun delete() {
        val currentProject = project ?: return
        flushBlocking()
        scope.launch {
            val next = withContext(Dispatchers.IO) { ProjectStore.delete(app, currentProject) }
            show(next)
        }
    }

    fun redetect() {
        val currentProject = project ?: return
        scope.launch {
            val next = withContext(Dispatchers.IO) { ProjectStore.redetect(currentProject) }
            project = next
            status = next.summary
            restartServer()
        }
    }

    fun update(next: WebProject, restart: Boolean) {
        project = next
        scope.launch {
            val saved = withContext(Dispatchers.IO) { ProjectStore.update(next) }
            if (project?.id == saved.id) project = saved
            if (restart) restartServer()
        }
    }

    fun edit(text: String) {
        draft = text
        version += 1
        scheduleSave()
    }

    private fun scheduleSave() {
        saveJob?.cancel()
        saveJob = scope.launch {
            delay(350)
            val file = current ?: return@launch
            val open = project ?: return@launch
            val snapshot = draft
            val saving = version
            if (saver.isSaved(saving)) return@launch
            val outcome = withContext(Dispatchers.IO) {
                runCatching {
                    saver.save(file, snapshot, saving) && SiteFiles.isInside(open.serveDir, file)
                }
            }
            outcome.fold(
                onSuccess = { served -> if (served && open.liveReload) server.reload() },
                onFailure = { status = it.message ?: "没能保存" },
            )
        }
    }

    fun runPreview() {
        flushBlocking()
        reloadKey += 1
        server.reload()
    }

    fun select(file: File) {
        flushBlocking()
        load(file)
    }

    private fun load(file: File?) {
        saveJob?.cancel()
        current = file
        draft = file?.let { readFile(it) }.orEmpty()
        saver.discardThrough(version)
        if (file != null) reveal(file)
    }

    fun createFile(relative: String) {
        val open = project ?: return
        val file = resolve(open, relative) ?: run {
            status = "这个路径不能用"
            return
        }
        if (file.exists()) {
            status = "已经有这个文件"
            return
        }
        val created = runCatching { ProjectStore.write(file, "") }
        if (created.isFailure) {
            status = created.exceptionOrNull()?.message ?: "没能新建"
            return
        }
        treeTick += 1
        select(file)
    }

    fun renameFile(relative: String, nextName: String) {
        val open = project ?: return
        val file = resolve(open, relative) ?: return
        if (nextName.isBlank() || nextName.contains('/') || nextName.contains('\\')) {
            status = "名字里不能带路径"
            return
        }
        val target = File(file.parentFile, nextName.trim())
        if (target.exists()) {
            status = "已经有这个名字"
            return
        }
        flushBlocking()
        val moved = current?.takeIf { SiteFiles.isInside(file, it) }?.let {
            if (it == file) target else File(target, it.toRelativeString(file))
        }
        if (!file.renameTo(target)) {
            status = "没能改名"
            return
        }
        treeTick += 1
        if (moved != null) load(moved)
    }

    fun deleteFile(relative: String) {
        val open = project ?: return
        val file = resolve(open, relative) ?: return
        val removesCurrent = current?.let { SiteFiles.isInside(file, it) } == true
        if (removesCurrent) {
            saveJob?.cancel()
            saver.discardThrough(version)
        }
        file.deleteRecursively()
        treeTick += 1
        if (removesCurrent) load(null)
    }

    fun importIcon(uri: Uri) {
        val open = project ?: return
        scope.launch {
            val outcome = withContext(Dispatchers.IO) {
                runCatching {
                    val name = DocumentImport.displayName(app, uri)
                    val dest = File(open.dir, name.substringAfterLast('/'))
                    app.contentResolver.openInputStream(uri)?.use { input ->
                        dest.outputStream().use { input.copyTo(it) }
                    } ?: error("没读到图标")
                    ProjectStore.update(open.copy(iconPath = dest.name))
                }
            }
            outcome.fold(
                onSuccess = { project = it },
                onFailure = { status = it.message ?: "图标没放进去" },
            )
        }
    }

    fun pack(onInstalled: () -> Unit = {}) {
        val open = project ?: return
        if (!open.runnable) {
            status = open.summary
            return
        }
        if (!ProjectIds.validPackageName(open.resolvedPackageName())) {
            status = "包名要像 com.example.app 这样"
            return
        }
        if (busy) return
        val file = current
        val snapshot = draft
        val saving = version
        saveJob?.cancel()
        busy = true
        status = "正在打包"
        scope.launch {
            val outcome = withContext(Dispatchers.IO) {
                runCatching {
                    if (file != null) saver.save(file, snapshot, saving)
                    val fresh = project ?: open
                    val out = File(File(app.cacheDir, "builds").apply { mkdirs() }, "${fresh.id}.apk")
                    ApkPackager(app).packageApk(
                        config = BuildConfig(
                            appName = fresh.name,
                            packageName = fresh.resolvedPackageName(),
                            versionName = fresh.versionName,
                            versionCode = fresh.versionCode,
                            entryFile = fresh.entryFile,
                            orientation = runCatching { Orientation.valueOf(fresh.orientation) }.getOrDefault(Orientation.AUTO),
                            abis = fresh.abis,
                            iconPath = fresh.iconPath,
                            iconBgColor = fresh.iconBgColor,
                            spaFallback = fresh.spaFallback,
                            webViewJson = fresh.webview.encode(),
                            extraPermissions = fresh.webview.extraPermissions(),
                        ),
                        srcDir = fresh.serveDir,
                        files = ProjectStore.listUnder(fresh.serveDir),
                        outFile = out,
                        identity = DebugKeystore.getOrCreate(app),
                        projectDir = fresh.dir,
                    )
                    out
                }
            }
            busy = false
            outcome.fold(
                onSuccess = { apk ->
                    if (ApkInstaller.canRequestInstall(app)) {
                        status = "已签名，正在打开安装"
                        ApkInstaller.install(app, apk)
                        onInstalled()
                    } else {
                        status = "请允许安装未知应用，然后再打包一次"
                        ApkInstaller.openInstallPermissionSettings(app)
                    }
                },
                onFailure = { status = it.message ?: "打包失败" },
            )
        }
    }

    fun copyUrl() {
        val text = lanUrl ?: url ?: return
        val clipboard = app.getSystemService(ClipboardManager::class.java)
        clipboard.setPrimaryClip(ClipData.newPlainText("preview", text))
        status = "地址已复制"
    }

    fun clearSiteData() {
        runCatching {
            WebStorage.getInstance().deleteAllData()
            CookieManager.getInstance().removeAllCookies(null)
            CookieManager.getInstance().flush()
        }
        webView()?.clearCache(true)
        status = "已清掉预览里的缓存和 cookie"
        reloadKey += 1
    }

    fun attachWebView(view: WebView?) {
        liveWeb = view?.let { WeakReference(it) }
    }

    fun webView(): WebView? = liveWeb?.get()

    private fun show(next: WebProject) {
        if (lastProjectId != null && lastProjectId != next.id &&
            !WebViewFeature.isFeatureSupported(WebViewFeature.MULTI_PROFILE)
        ) {
            runCatching {
                WebStorage.getInstance().deleteAllData()
                CookieManager.getInstance().removeAllCookies(null)
            }
        }
        lastProjectId = next.id
        project = next
        expanded = emptySet()
        treeTick += 1
        val entry = File(next.serveDir, next.entryFile)
        val file = if (entry.isFile) entry else ProjectStore.listUnder(next.srcDir).firstOrNull()
        current = file
        draft = file?.let { readFile(it) }.orEmpty()
        saver.discardThrough(version)
        if (file != null) reveal(file)
        status = next.summary
        restartServer()
    }

    private fun restartServer() {
        serverJob?.cancel()
        val open = project ?: return
        if (!open.runnable) {
            url = null
            lanUrl = null
            server.stop()
            status = open.summary
            return
        }
        serverJob = scope.launch {
            val started = withContext(Dispatchers.IO) {
                runCatching {
                    server.stop()
                    server.root = open.serveDir
                    server.spaFallback = open.spaFallback
                    server.liveReload = open.liveReload
                    server.entryFile = open.entryFile.ifBlank { "index.html" }
                    val index = File(open.serveDir, server.entryFile)
                    server.basePrefix = if (index.isFile) SiteFiles.basePrefix(index.readText()) else ""
                    server.start(open.serverPort, open.lan)
                }
            }
            started.fold(
                onSuccess = { port ->
                    url = "http://127.0.0.1:$port/"
                    lanUrl = if (open.lan) LocalPreviewServer.lanAddress()?.let { "http://$it:$port/" } else null
                },
                onFailure = {
                    url = null
                    lanUrl = null
                    status = it.message ?: "预览服务没有起来"
                },
            )
        }
    }

    private fun flushBlocking() {
        saveJob?.cancel()
        val file = current ?: return
        if (!dirty) return
        runCatching { saver.save(file, draft, version) }.onFailure {
            status = it.message ?: "没能保存"
        }
    }

    private fun readFile(file: File): String {
        if (isRasterImage(file.name)) return ""
        if (file.length() > 512_000) {
            status = "这个文件太大，编辑器只打开 512 KB 以内的文本"
            return ""
        }
        return runCatching { file.readText() }.getOrElse {
            status = it.message ?: "打不开这个文件"
            ""
        }
    }

    private fun reveal(file: File) {
        val open = project ?: return
        val rel = runCatching { ProjectStore.relative(open, file) }.getOrNull() ?: return
        val dirs = mutableListOf<String>()
        var path = ""
        for (part in rel.split('/').dropLast(1)) {
            path = if (path.isEmpty()) part else "$path/$part"
            dirs += path
        }
        expanded = expanded + dirs
    }

    private fun resolve(project: WebProject, relative: String): File? {
        val clean = SiteFiles.normalize("/$relative") ?: return null
        val file = File(project.srcDir, clean)
        val parent = file.parentFile ?: return null
        if (!parent.exists()) parent.mkdirs()
        return if (SiteFiles.isInside(project.srcDir, file)) file else null
    }
}

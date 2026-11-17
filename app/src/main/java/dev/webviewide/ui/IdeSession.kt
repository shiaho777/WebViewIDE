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
import dev.webviewide.build.ArtifactStore
import dev.webviewide.build.BuildArtifact
import dev.webviewide.build.BuildConfig
import dev.webviewide.build.DebugKeystore
import dev.webviewide.build.KeystoreException
import dev.webviewide.build.KeystoreManager
import dev.webviewide.build.Orientation
import dev.webviewide.build.SignMode
import dev.webviewide.project.DocumentImport
import dev.webviewide.project.DraftJournal
import dev.webviewide.project.DraftSaver
import dev.webviewide.project.ExternalChangeException
import dev.webviewide.project.FileHistory
import dev.webviewide.project.ProjectIds
import dev.webviewide.project.ProjectStore
import dev.webviewide.project.ProjectZip
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
    /** True until the first project lookup finishes; distinguishes loading from a fresh install. */
    var loading by mutableStateOf(true)
    var current by mutableStateOf<File?>(null)
    /** Open editor tabs in visit order; current is always a member when non-null. */
    var openFiles by mutableStateOf(listOf<File>())
    var draft by mutableStateOf("")
    var status by mutableStateOf<String?>(null)
    var busy by mutableStateOf(false)
    var url by mutableStateOf<String?>(null)
    var lanUrl by mutableStateOf<String?>(null)
    var reloadKey by mutableIntStateOf(0)
    var treeTick by mutableIntStateOf(0)
    var expanded by mutableStateOf(setOf<String>())
    var pendingGotoLine by mutableIntStateOf(0)
    /** Bumped on rollback so the editor WebView remounts with the restored text. */
    var docEpoch by mutableIntStateOf(0)
    var artifacts by mutableStateOf(listOf<BuildArtifact>())
    var signingKeys by mutableStateOf(listOf<KeystoreManager.StoredKey>())
    var projectExportRequested by mutableStateOf(false)

    fun requestProjectExport() {
        projectExportRequested = true
    }

    fun refreshBuildState() {
        artifacts = ArtifactStore.list(app)
        signingKeys = KeystoreManager.list(app)
    }

    fun importKeystore(uri: Uri, storePassword: String, alias: String, keyPassword: String) {
        scope.launch {
            val outcome = withContext(Dispatchers.IO) {
                runCatching {
                    val bytes = app.contentResolver.openInputStream(uri)?.use { it.readBytes() }
                        ?: throw KeystoreException("没读到密钥文件")
                    KeystoreManager.import(app, bytes, storePassword, alias, keyPassword)
                }
            }
            outcome.fold(
                onSuccess = { entry ->
                    refreshBuildState()
                    project?.let { update(it.copy(signingFingerprint = entry.fingerprint), false) }
                    status = "密钥已导入并绑定到当前项目"
                },
                onFailure = { status = it.message ?: "密钥导入失败" },
            )
        }
    }

    fun bindKeystore(fingerprint: String) {
        project?.let { update(it.copy(signingFingerprint = fingerprint), false) }
        status = if (fingerprint.isBlank()) "已改回本机调试签名" else "已绑定签名密钥"
    }

    fun exportKeystore(fingerprint: String, uri: Uri) {
        scope.launch {
            val outcome = withContext(Dispatchers.IO) {
                runCatching {
                    val entry = KeystoreManager.list(app).firstOrNull { it.fingerprint == fingerprint }
                        ?: throw KeystoreException("没有这个密钥")
                    val src = File(KeystoreManager.dir(app), entry.fileName)
                    app.contentResolver.openOutputStream(uri)?.use { out -> src.inputStream().use { it.copyTo(out) } }
                        ?: throw KeystoreException("没能写入导出位置")
                }
            }
            status = outcome.fold({ "密钥库已导出（密码请自行保管）" }, { it.message ?: "导出失败" })
        }
    }

    fun exportArtifact(id: String, uri: Uri) {
        scope.launch {
            val outcome = withContext(Dispatchers.IO) {
                runCatching {
                    val artifact = ArtifactStore.list(app).firstOrNull { it.id == id }
                        ?: error("没有这个安装包")
                    app.contentResolver.openOutputStream(uri)?.use { out ->
                        artifact.file.inputStream().use { it.copyTo(out) }
                    } ?: error("没能写入导出位置")
                }
            }
            status = outcome.fold({ "安装包已导出" }, { it.message ?: "导出失败" })
        }
    }

    fun shareArtifact(id: String) {
        val artifact = ArtifactStore.list(app).firstOrNull { it.id == id } ?: return
        ApkInstaller.share(app, artifact.file)
    }

    fun deleteArtifact(id: String) {
        ArtifactStore.remove(app, id)
        artifacts = ArtifactStore.list(app)
    }

    fun installArtifact(id: String) {
        val artifact = ArtifactStore.list(app).firstOrNull { it.id == id } ?: return
        if (ApkInstaller.canRequestInstall(app)) {
            ApkInstaller.install(app, artifact.file)
        } else {
            status = "请允许安装未知应用"
            ApkInstaller.openInstallPermissionSettings(app)
        }
    }

    val server = LocalPreviewServer(
        clientScript = runCatching {
            app.assets.open("preview/client.js").bufferedReader().use { it.readText() }
        }.getOrNull(),
    )
    private var saveJob: Job? = null
    private var serverJob: Job? = null
    private val saver = DraftSaver()
    private val journal = DraftJournal(File(app.filesDir, "draft-journal.txt"))
    private var version = 0L
    private val dirty: Boolean get() = !saver.isSaved(version)
    private var lastProjectId: String? = null
    private var liveWeb: WeakReference<WebView>? = null

    fun openCurrent() {
        scope.launch {
            val opened = withContext(Dispatchers.IO) { ProjectStore.current(app) }
            show(opened)
            recoverJournal()
        }
    }

    private fun recoverJournal() {
        val entry = journal.recover() ?: return
        val open = project ?: return
        val target = entry.target
        if (!target.isFile || !SiteFiles.isInside(open.srcDir, target)) {
            journal.clear()
            return
        }
        if (target.readText() == entry.text) {
            journal.clear()
            return
        }
        current = target
        draft = entry.text
        version += 1
        saver.noteDiskState(target)
        reveal(target)
        status = "已恢复上次未保存的修改"
        scheduleSave()
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
        current?.let { journal.record(it, text, version) }
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
                    val served = saver.save(file, snapshot, saving) && SiteFiles.isInside(open.serveDir, file)
                    if (served) {
                        val rel = runCatching { ProjectStore.relative(open, file) }.getOrDefault(file.name)
                        FileHistory.record(app.filesDir, open.id, rel, snapshot)
                    }
                    if (served && open.liveReload) {
                        val rel = runCatching { file.toRelativeString(open.serveDir).replace(File.separatorChar, '/') }
                            .getOrDefault("")
                        val cssOnly = file.extension.equals("css", ignoreCase = true)
                        // SSE socket writes must stay off the main thread.
                        server.reload(rel, full = !cssOnly)
                    }
                    served
                }
            }
            outcome.fold(
                onSuccess = { journal.clear() },
                onFailure = {
                    status = it.message ?: "没能保存"
                    if (it is ExternalChangeException) journal.clear()
                },
            )
        }
    }

    /** Version snapshots for the active file, newest first. */
    fun historyEntries(): List<FileHistory.Entry> {
        val open = project ?: return emptyList()
        val file = current ?: return emptyList()
        val rel = runCatching { ProjectStore.relative(open, file) }.getOrDefault(file.name)
        return FileHistory.list(app.filesDir, open.id, rel)
    }

    /** Restores a snapshot into the editor and saves it (triggers hot reload). */
    fun rollback(ts: Long) {
        val open = project ?: return
        val file = current ?: return
        val rel = runCatching { ProjectStore.relative(open, file) }.getOrDefault(file.name)
        val text = FileHistory.read(app.filesDir, open.id, rel, ts) ?: run {
            status = "这个版本读不到了"
            return
        }
        edit(text)
        docEpoch += 1
        status = "已回滚到历史版本"
    }

    fun runPreview() {
        flushBlocking()
        reloadKey += 1
        scope.launch(Dispatchers.IO) { server.reload() }
    }

    fun select(file: File) {
        flushBlocking()
        load(file)
    }

    /** Opens a project source file by serve-relative path (console jump-to-source). */
    fun openRelative(path: String): Boolean {
        val open = project ?: return false
        val clean = SiteFiles.normalize("/$path") ?: return false
        val file = File(open.serveDir, clean)
        if (!file.isFile || !SiteFiles.isInside(open.serveDir, file)) return false
        select(file)
        return true
    }

    private fun load(file: File?) {
        saveJob?.cancel()
        current = file
        openFiles = if (file == null) emptyList() else (openFiles.filter { it != file } + file)
        draft = file?.let { readFile(it) }.orEmpty()
        saver.discardThrough(version)
        if (file != null) {
            saver.noteDiskState(file)
            reveal(file)
        }
    }

    /** Closes a tab; if it was active, activates the neighbour (or empty state). */
    fun closeFile(file: File) {
        val wasCurrent = current == file
        if (wasCurrent) flushBlocking()
        val remaining = openFiles.filter { it != file }
        openFiles = remaining
        if (wasCurrent) {
            load(remaining.lastOrNull())
        }
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

    fun moveFile(relative: String, targetRelative: String) {
        val open = project ?: return
        val file = resolve(open, relative) ?: return
        val target = resolve(open, targetRelative) ?: run {
            status = "这个路径不能用"
            return
        }
        if (target.exists()) {
            status = "目标位置已经有文件"
            return
        }
        if (SiteFiles.isInside(file, target)) {
            status = "不能移动到自身里面"
            return
        }
        flushBlocking()
        val movedCurrent = current?.takeIf { SiteFiles.isInside(file, it) }?.let {
            if (it == file) target else File(target, it.toRelativeString(file))
        }
        target.parentFile?.mkdirs()
        if (!file.renameTo(target)) {
            status = "没能移动"
            return
        }
        treeTick += 1
        if (movedCurrent != null) {
            current = movedCurrent
            saver.noteDiskState(movedCurrent)
            reveal(movedCurrent)
        }
        status = "已移动到 $targetRelative"
    }

    fun exportProjectZip(uri: Uri) {
        val open = project ?: return
        scope.launch {
            val outcome = withContext(Dispatchers.IO) {
                runCatching {
                    flushBlocking()
                    app.contentResolver.openOutputStream(uri)?.use { out ->
                        ProjectZip.write(open.srcDir, ProjectStore.listUnder(open.srcDir), out)
                    } ?: error("没能写入导出位置")
                }
            }
            status = outcome.fold({ "项目已导出为 zip" }, { it.message ?: "导出失败" })
        }
    }

    /** One-tap hand-off: zip into the share cache, then open the system share sheet. */
    fun shareProjectZip() {
        val open = project ?: return
        scope.launch {
            val outcome = withContext(Dispatchers.IO) {
                runCatching {
                    flushBlocking()
                    val dir = File(app.cacheDir, "share").apply { mkdirs() }
                    // Keep only the newest archive so the share cache stays bounded.
                    dir.listFiles()?.forEach { it.delete() }
                    val safeName = open.name.replace(Regex("""[^\w一-龥.-]"""), "_").ifBlank { "project" }
                    val zip = File(dir, "$safeName.zip")
                    zip.outputStream().use { out ->
                        ProjectZip.write(open.srcDir, ProjectStore.listUnder(open.srcDir), out)
                    }
                    zip
                }
            }
            outcome.fold(
                onSuccess = { zip ->
                    status = "正在分享项目"
                    ApkInstaller.shareFile(app, zip)
                },
                onFailure = { status = it.message ?: "分享失败" },
            )
        }
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
                    val userKey = KeystoreManager.resolve(app, fresh.signingFingerprint)
                    if (fresh.signingFingerprint.isNotBlank() && userKey == null) {
                        throw KeystoreException("绑定的签名密钥不可用，请在打包设置里重新选择")
                    }
                    val identity = userKey ?: DebugKeystore.getOrCreate(app)
                    val signMode = if (userKey != null) SignMode.RELEASE else SignMode.DEBUG
                    val code = if (fresh.autoVersionCode) fresh.versionCode + 1 else fresh.versionCode
                    val stamp = System.currentTimeMillis()
                    val out = File(ArtifactStore.dir(app), "${fresh.id}-$stamp.apk")
                    val kind = ApkPackager(app).packageApk(
                        config = BuildConfig(
                            appName = fresh.name,
                            packageName = fresh.resolvedPackageName(),
                            versionName = fresh.versionName,
                            versionCode = code,
                            entryFile = fresh.entryFile,
                            orientation = runCatching { Orientation.valueOf(fresh.orientation) }.getOrDefault(Orientation.AUTO),
                            abis = fresh.abis,
                            signMode = signMode,
                            iconPath = fresh.iconPath,
                            iconBgColor = fresh.iconBgColor,
                            spaFallback = fresh.spaFallback,
                            webViewJson = fresh.webview.encode(),
                            extraPermissions = fresh.webview.extraPermissions(),
                        ),
                        srcDir = fresh.serveDir,
                        files = ProjectStore.listUnder(fresh.serveDir),
                        outFile = out,
                        identity = identity,
                        projectDir = fresh.dir,
                    )
                    ArtifactStore.record(
                        app,
                        BuildArtifact(
                            id = "${fresh.id}-$stamp",
                            appName = fresh.name,
                            versionName = fresh.versionName,
                            versionCode = code,
                            kind = kind,
                            sizeBytes = out.length(),
                            createdAt = stamp,
                            file = out,
                        ),
                    )
                    if (fresh.autoVersionCode) {
                        val bumped = ProjectStore.update(fresh.copy(versionCode = code))
                        if (project?.id == bumped.id) project = bumped
                    }
                    out
                }
            }
            busy = false
            outcome.fold(
                onSuccess = { apk ->
                    artifacts = ArtifactStore.list(app)
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

    private fun show(next: WebProject?) {
        if (next == null) {
            // Fresh install: no project yet, the welcome screen takes over.
            project = null
            current = null
            openFiles = emptyList()
            draft = ""
            url = null
            lanUrl = null
            status = null
            server.stop()
            loading = false
            return
        }
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
        loading = false
        expanded = emptySet()
        treeTick += 1
        val entry = File(next.serveDir, next.entryFile)
        val file = if (entry.isFile) entry else ProjectStore.listUnder(next.srcDir).firstOrNull()
        current = file
        openFiles = listOfNotNull(file)
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
        if (file.length() > 2_000_000) {
            status = "这个文件太大，编辑器只打开 2 MB 以内的文本"
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

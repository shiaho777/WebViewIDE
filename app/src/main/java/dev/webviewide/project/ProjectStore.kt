package dev.webviewide.project

import android.content.Context
import android.content.res.AssetManager
import java.io.File

data class WebProject(
    val id: String,
    val name: String,
    val dir: File,
    val entryFile: String = "index.html",
    val serveRoot: String = "",
    val kind: String = ProjectKinds.STATIC,
    val spaFallback: Boolean = false,
    val runnable: Boolean = true,
    val summary: String = "静态网页",
    val packageName: String = "",
    val versionName: String = "1.0.0",
    val versionCode: Int = 1,
    val orientation: String = "AUTO",
    val abis: Set<String> = setOf("arm64-v8a", "armeabi-v7a", "x86_64"),
    val iconPath: String? = null,
    val iconBgColor: Long = 0xFF185FA5,
    val serverPort: Int = 4173,
    val lan: Boolean = false,
    val liveReload: Boolean = true,
    val webview: WebViewConfig = WebViewConfig(),
    val detected: Boolean = false,
) {
    val srcDir: File get() = File(dir, "src")
    val serveDir: File get() = if (serveRoot.isBlank()) srcDir else File(srcDir, serveRoot)
    fun resolvedPackageName(): String =
        packageName.ifBlank { "dev.webviewide.${ProjectIds.packageSegment(id)}" }

    fun applyDetection(detection: Detection): WebProject = copy(
        entryFile = detection.entryFile,
        serveRoot = detection.serveRoot,
        kind = detection.kind,
        spaFallback = detection.spaFallback,
        runnable = detection.runnable,
        summary = detection.summary,
        detected = true,
    )
}

object ProjectStore {
    private const val ROOT = "web-projects"
    private const val PREFS = "dev.webviewide.session"
    private const val CURRENT = "current"

    fun open(context: Context): WebProject = current(context)

    fun current(context: Context): WebProject {
        val root = root(context)
        val saved = context.getSharedPreferences(PREFS, Context.MODE_PRIVATE).getString(CURRENT, null)
        val dir = saved?.let { File(root, it) }?.takeIf { File(it, "project.json").isFile }
        if (dir != null) return read(dir)
        val existing = list(context)
        if (existing.isNotEmpty()) {
            remember(context, existing.first().id)
            return existing.first()
        }
        return create(context, "blank", "首页")
    }

    fun list(context: Context): List<WebProject> {
        val root = root(context)
        return root.listFiles()
            ?.filter { it.isDirectory && File(it, "project.json").isFile }
            ?.sortedBy { it.name }
            ?.map { read(it) }
            .orEmpty()
    }

    fun open(context: Context, id: String): WebProject {
        val dir = File(root(context), id)
        if (!File(dir, "project.json").isFile) return current(context)
        remember(context, id)
        return read(dir)
    }

    fun create(context: Context, template: String, name: String): WebProject {
        val root = root(context)
        val id = ProjectIds.freshId(root.list()?.toSet().orEmpty(), name)
        val dir = File(root, id)
        val src = File(dir, "src")
        src.mkdirs()
        val copied = runCatching { copyAssetTree(context.assets, "templates/$template", src) }.isSuccess
        if (!copied || src.listFiles().isNullOrEmpty()) writeFallback(src)
        var project = WebProject(
            id = id,
            name = name.ifBlank { "未命名" },
            dir = dir,
            packageName = "dev.webviewide.${ProjectIds.packageSegment(id)}",
        )
        project = project.applyDetection(ProjectDetect.detect(src))
        save(project)
        remember(context, id)
        return project
    }

    fun update(project: WebProject): WebProject {
        save(project)
        return project
    }

    fun redetect(project: WebProject): WebProject {
        val next = project.applyDetection(ProjectDetect.detect(project.srcDir))
        save(next)
        return next
    }

    fun rename(project: WebProject, name: String): WebProject {
        val next = project.copy(name = name.ifBlank { project.name })
        save(next)
        return next
    }

    fun duplicate(context: Context, project: WebProject): WebProject {
        val root = root(context)
        val name = "${project.name} 副本"
        val id = ProjectIds.freshId(root.list()?.toSet().orEmpty(), name)
        val dir = File(root, id)
        project.dir.copyRecursively(dir, overwrite = true)
        File(dir, "builds").deleteRecursively()
        val next = read(dir).copy(
            id = id,
            name = name,
            dir = dir,
            packageName = "dev.webviewide.${ProjectIds.packageSegment(id)}",
        )
        save(next)
        remember(context, id)
        return next
    }

    fun delete(context: Context, project: WebProject): WebProject {
        project.dir.deleteRecursively()
        val rest = list(context)
        return if (rest.isEmpty()) create(context, "blank", "首页") else open(context, rest.first().id)
    }

    fun adopt(context: Context, name: String, fill: (File) -> Unit): WebProject {
        val root = root(context)
        val id = ProjectIds.freshId(root.list()?.toSet().orEmpty(), name)
        val dir = File(root, id)
        val src = File(dir, "src").apply { mkdirs() }
        try {
            fill(src)
        } catch (error: Exception) {
            dir.deleteRecursively()
            throw error
        }
        var project = WebProject(
            id = id,
            name = name.ifBlank { "导入的项目" },
            dir = dir,
            packageName = "dev.webviewide.${ProjectIds.packageSegment(id)}",
        )
        project = project.applyDetection(ProjectDetect.detect(src))
        save(project)
        remember(context, id)
        return project
    }

    fun listUnder(dir: File): List<File> {
        if (!dir.isDirectory) return emptyList()
        return dir.walkTopDown()
            .onEnter { it == dir || !ArchiveImport.shouldSkipDir(it.name) }
            .filter { it.isFile && !it.name.startsWith(".") }
            .sortedBy { it.path }
            .toList()
    }

    fun listSources(project: WebProject): List<File> = listUnder(project.srcDir)

    fun relative(project: WebProject, file: File): String =
        file.toRelativeString(project.srcDir).replace(File.separatorChar, '/')

    fun write(file: File, text: String) {
        file.parentFile?.mkdirs()
        val tmp = File(file.parentFile, ".${file.name}.tmp")
        tmp.writeText(text)
        if (!tmp.renameTo(file)) {
            tmp.copyTo(file, overwrite = true)
            tmp.delete()
        }
    }

    private fun root(context: Context) = File(context.filesDir, ROOT).apply { mkdirs() }

    private fun remember(context: Context, id: String) {
        context.getSharedPreferences(PREFS, Context.MODE_PRIVATE).edit().putString(CURRENT, id).apply()
    }

    private fun read(dir: File): WebProject {
        val raw = parseJson(File(dir, "project.json").readText()).jsonObject()
        val project = fromMap(dir, raw)
        if (!raw.containsKey("kind")) return redetect(project)
        return project
    }

    private fun save(project: WebProject) {
        project.dir.mkdirs()
        File(project.dir, "project.json").writeText(encodeJson(project.toMap()))
    }

    private fun WebProject.toMap(): Map<String, Any?> = linkedMapOf(
        "id" to id,
        "name" to name,
        "entryFile" to entryFile,
        "serveRoot" to serveRoot,
        "kind" to kind,
        "spaFallback" to spaFallback,
        "runnable" to runnable,
        "summary" to summary,
        "packageName" to resolvedPackageName(),
        "versionName" to versionName,
        "versionCode" to versionCode,
        "orientation" to orientation,
        "abis" to abis.toList(),
        "iconPath" to iconPath,
        "iconBgColor" to "#%08X".format(iconBgColor),
        "serverPort" to serverPort,
        "lan" to lan,
        "liveReload" to liveReload,
        "webview" to webview.toMap(),
    )

    private fun fromMap(dir: File, map: Map<String, Any?>): WebProject {
        val id = map.string("id", dir.name)
        val color = map.string("iconBgColor", "#FF185FA5").removePrefix("#").toLongOrNull(16) ?: 0xFF185FA5
        val orientation = map.string("orientation", "AUTO").let {
            if (it == "PORTRAIT" || it == "LANDSCAPE" || it == "AUTO") it else "AUTO"
        }
        return WebProject(
            id = id,
            name = map.string("name", "未命名"),
            dir = dir,
            entryFile = map.string("entryFile", "index.html").ifBlank { "index.html" },
            serveRoot = map.string("serveRoot"),
            kind = map.string("kind", ProjectKinds.STATIC),
            spaFallback = map.boolean("spaFallback", false),
            runnable = map.boolean("runnable", true),
            summary = map.string("summary", "静态网页"),
            packageName = map.string("packageName", "dev.webviewide.${ProjectIds.packageSegment(id)}"),
            versionName = map.string("versionName", "1.0.0"),
            versionCode = map.int("versionCode", 1).coerceAtLeast(1),
            orientation = orientation,
            abis = map.strings("abis").toSet().ifEmpty { setOf("arm64-v8a", "armeabi-v7a", "x86_64") },
            iconPath = map.string("iconPath").ifBlank { null },
            iconBgColor = color,
            serverPort = map.int("serverPort", 4173),
            lan = map.boolean("lan", false),
            liveReload = map.boolean("liveReload", true),
            webview = WebViewConfig.fromMap(map.obj("webview")),
            detected = map.containsKey("kind"),
        )
    }

    private fun copyAssetTree(assets: AssetManager, path: String, dest: File) {
        val kids = assets.list(path).orEmpty()
        if (kids.isEmpty()) {
            dest.parentFile?.mkdirs()
            assets.open(path).use { input -> dest.outputStream().use { input.copyTo(it) } }
            return
        }
        dest.mkdirs()
        kids.forEach { copyAssetTree(assets, "$path/$it", File(dest, it)) }
    }

    private fun writeFallback(src: File) {
        src.mkdirs()
        File(src, "index.html").writeText(
            """
            <!DOCTYPE html>
            <html lang="zh-CN"><head><meta charset="utf-8"><title>首页</title></head>
            <body><h1>写在手机上的网页</h1></body></html>
            """.trimIndent(),
        )
    }
}

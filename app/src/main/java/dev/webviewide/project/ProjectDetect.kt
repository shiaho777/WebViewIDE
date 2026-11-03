package dev.webviewide.project

import java.io.File

object ProjectDetect {
    private val builtFiles = listOf(
        "dist/index.html",
        "build/index.html",
        "out/index.html",
        ".output/public/index.html",
        "docs/.vitepress/dist/index.html",
        "storybook-static/index.html",
    )

    fun dependencyNames(text: String): Set<String> = runCatching {
        val root = parseJson(text).jsonObject()
        buildSet {
            for (section in listOf("dependencies", "devDependencies", "peerDependencies")) {
                val obj = root[section] as? Map<*, *> ?: continue
                obj.keys.filterIsInstance<String>().forEach { add(it) }
            }
        }
    }.getOrDefault(emptySet())

    fun detect(root: File): Detection {
        if (!root.isDirectory) {
            return Detection(ProjectKinds.SOURCE, "", "index.html", false, false, "没有找到项目目录")
        }
        val pkg = File(root, "package.json")
        val deps = if (pkg.isFile) dependencyNames(pkg.readText()) else emptySet()
        val framework = frameworkOf(deps)
        val built = findBuilt(root)
        if (built != null) {
            val kind = framework ?: ProjectKinds.STATIC
            val spa = framework != null && framework != ProjectKinds.DOCS
            val where = built.ifBlank { "根目录" }
            return Detection(kind, built, "index.html", spa, true, "${ProjectKinds.label(kind)} · $where")
        }
        if (framework == ProjectKinds.DOCS) {
            val docs = firstIndex(root, listOf("", "docs"))
            if (docs != null) {
                return Detection(ProjectKinds.DOCS, docs, "index.html", false, true, "文档站")
            }
        }
        if (framework != null) {
            return Detection(framework, "", "index.html", false, false, sourceSummary(framework))
        }
        if (File(root, "vue.global.prod.js").isFile && File(root, "index.html").isFile) {
            return Detection(ProjectKinds.VUE, "", "index.html", true, true, "Vue 页面，打开就能改")
        }
        if (File(root, "react.production.min.js").isFile && File(root, "index.html").isFile) {
            return Detection(ProjectKinds.REACT, "", "index.html", true, true, "React 页面，打开就能改")
        }
        val staticRoot = firstIndex(root, listOf("", "www", "public", "docs", "site"))
        if (staticRoot != null) {
            val where = staticRoot.ifBlank { "根目录" }
            return Detection(ProjectKinds.STATIC, staticRoot, "index.html", false, true, "静态网页 · $where")
        }
        return Detection(ProjectKinds.SOURCE, "", "index.html", false, false, "没有找到 index.html")
    }

    fun frameworkOf(deps: Set<String>): String? = when {
        "next" in deps -> ProjectKinds.NEXT
        "nuxt" in deps || "nuxt3" in deps -> ProjectKinds.NUXT
        "@angular/core" in deps -> ProjectKinds.ANGULAR
        "@sveltejs/kit" in deps -> ProjectKinds.SVELTE
        "vitepress" in deps || "docsify" in deps || "docsify-cli" in deps -> ProjectKinds.DOCS
        "vue" in deps -> ProjectKinds.VUE
        "react" in deps -> ProjectKinds.REACT
        "preact" in deps -> ProjectKinds.PREACT
        "solid-js" in deps -> ProjectKinds.SOLID
        "svelte" in deps -> ProjectKinds.SVELTE
        else -> null
    }

    fun sourceSummary(kind: String): String = when (kind) {
        ProjectKinds.VUE -> "这是 Vue 源码，还没有构建结果。在电脑上构建后，把 dist 一起导入。"
        ProjectKinds.REACT -> "这是 React 源码，还没有构建结果。在电脑上构建后，把 build 或 dist 一起导入。"
        ProjectKinds.NEXT -> "这是 Next 源码。导出静态站点后，把 out 一起导入。"
        ProjectKinds.NUXT -> "这是 Nuxt 源码。生成静态站点后，把 .output/public 一起导入。"
        ProjectKinds.ANGULAR -> "这是 Angular 源码，还没有构建结果。构建后把 dist 一起导入。"
        ProjectKinds.SVELTE -> "这是 Svelte 源码，还没有构建结果。构建后把产物一起导入。"
        ProjectKinds.PREACT -> "这是 Preact 源码，还没有构建结果。构建后把 dist 一起导入。"
        ProjectKinds.SOLID -> "这是 Solid 源码，还没有构建结果。构建后把 dist 一起导入。"
        else -> "这个工程还不能直接预览。"
    }

    private fun findBuilt(root: File): String? {
        for (rel in builtFiles) {
            if (File(root, rel).isFile) return rel.removeSuffix("/index.html")
        }
        val dist = File(root, "dist")
        if (!dist.isDirectory) return null
        val children = dist.listFiles()?.filter { it.isDirectory }?.sortedBy { it.name }.orEmpty()
        for (child in children) {
            if (ArchiveImport.shouldSkipDir(child.name)) continue
            if (File(child, "browser/index.html").isFile) return "dist/${child.name}/browser"
            if (File(child, "index.html").isFile) return "dist/${child.name}"
        }
        return null
    }

    private fun firstIndex(root: File, dirs: List<String>): String? {
        for (dir in dirs) {
            val file = if (dir.isEmpty()) File(root, "index.html") else File(root, "$dir/index.html")
            if (file.isFile) return dir
        }
        return null
    }
}

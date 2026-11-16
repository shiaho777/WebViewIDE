package dev.webviewide.project

import dev.webviewide.build.ApkInstaller
import java.io.ByteArrayOutputStream
import java.io.File
import java.util.zip.ZipFile
import kotlin.io.path.createTempDirectory
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class ProjectZipTest {
    @Test fun entriesAreRelativeAndContentsSurvive() {
        val root = createTempDirectory("zip").toFile()
        try {
            File(root, "css").mkdirs()
            File(root, "index.html").writeText("<h1>hi</h1>")
            File(root, "css/app.css").writeText("body{margin:0}")
            val files = listOf(File(root, "index.html"), File(root, "css/app.css"))
            val bytes = ByteArrayOutputStream().also { ProjectZip.write(root, files, it) }.toByteArray()
            val archive = File(root, "out.zip")
            archive.writeBytes(bytes)
            ZipFile(archive).use { zip ->
                val names = zip.entries().toList().map { it.name }.sorted()
                assertEquals(listOf("css/app.css", "index.html"), names)
                assertEquals("<h1>hi</h1>", zip.getInputStream(zip.getEntry("index.html")).use { String(it.readBytes()) })
                assertEquals("body{margin:0}", zip.getInputStream(zip.getEntry("css/app.css")).use { String(it.readBytes()) })
            }
        } finally {
            root.deleteRecursively()
        }
    }

    @Test fun directoriesAreSkippedAndOrderIsStable() {
        val root = createTempDirectory("zip2").toFile()
        try {
            File(root, "sub").mkdirs()
            File(root, "b.txt").writeText("b")
            File(root, "a.txt").writeText("a")
            val bytes = ByteArrayOutputStream()
            ProjectZip.write(root, listOf(File(root, "b.txt"), File(root, "sub"), File(root, "a.txt")), bytes)
            val archive = File(root, "out.zip").apply { writeBytes(bytes.toByteArray()) }
            ZipFile(archive).use { zip ->
                assertEquals(listOf("a.txt", "b.txt"), zip.entries().toList().map { it.name })
            }
        } finally {
            root.deleteRecursively()
        }
    }

    @Test fun traversalPathsAreRefused() {
        val root = createTempDirectory("zip3").toFile()
        val outside = File(root.parentFile, "outside-${System.nanoTime()}.txt")
        try {
            outside.writeText("secret")
            val refused = runCatching { ProjectZip.entryName(root, outside) }
            assertTrue(refused.isFailure)
        } finally {
            outside.delete()
            root.deleteRecursively()
        }
    }

    @Test fun shareMimeAndTitleFollowExtension() {
        assertEquals("application/vnd.android.package-archive", ApkInstaller.mimeTypeFor(File("a.apk")))
        assertEquals("application/zip", ApkInstaller.mimeTypeFor(File("a.zip")))
        assertEquals("application/zip", ApkInstaller.mimeTypeFor(File("A.ZIP")))
        assertEquals("application/octet-stream", ApkInstaller.mimeTypeFor(File("a.bin")))
        assertEquals("分享项目", ApkInstaller.shareTitleFor(File("a.zip")))
        assertEquals("分享安装包", ApkInstaller.shareTitleFor(File("a.apk")))
    }

    @Test fun shareWiringIsPresent() {
        val session = File("src/main/java/dev/webviewide/ui/IdeSession.kt").readText()
        assertTrue(session.contains("fun shareProjectZip()"))
        assertTrue("share cache must be bounded", session.contains("dir.listFiles()?.forEach { it.delete() }"))
        assertTrue(session.contains("ApkInstaller.shareFile(app, zip)"))
        val panels = File("src/main/java/dev/webviewide/ui/IdePanels.kt").readText()
        assertTrue(panels.contains("session.shareProjectZip()"))
        assertTrue(panels.contains("分享项目"))
        val paths = File("src/main/res/xml/file_paths.xml").readText()
        assertTrue("FileProvider must cover the cache dir", paths.contains("cache-path"))
    }
}
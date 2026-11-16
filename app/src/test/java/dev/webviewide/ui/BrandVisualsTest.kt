package dev.webviewide.ui

import java.io.File
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

/** Pins the brand wiring: splash theme, visible icon paths, stable palette, about entry. */
class BrandVisualsTest {
    private fun res(path: String) = File("src/main/res/$path")
    private fun src(path: String) = File("src/main/java/dev/webviewide/$path")

    @Test fun splashThemeIsWiredEndToEnd() {
        val themes = res("values/themes.xml").readText()
        assertTrue(themes.contains("Theme.WebViewIDE.Splash"))
        assertTrue(themes.contains("parent=\"Theme.SplashScreen\""))
        assertTrue(themes.contains("windowSplashScreenBackground"))
        assertTrue(themes.contains("windowSplashScreenAnimatedIcon"))
        assertTrue("must hand back to the app theme", themes.contains("postSplashScreenTheme"))

        val manifest = File("src/main/AndroidManifest.xml").readText()
        assertTrue("launcher activity must use the splash theme", manifest.contains("@style/Theme.WebViewIDE.Splash"))

        val activity = src("MainActivity.kt").readText()
        assertTrue(activity.contains("installSplashScreen()"))
        val installAt = activity.indexOf("installSplashScreen()")
        val superAt = activity.indexOf("super.onCreate(savedInstanceState)")
        assertTrue("installSplashScreen must precede super.onCreate", installAt in 0 until superAt)
    }

    @Test fun splashResourcesExist() {
        assertTrue(res("drawable/ic_splash_logo.xml").isFile)
        assertTrue(res("values/colors.xml").readText().contains("brand_splash"))
        // Splash background and launcher background should be the same brand color.
        val bg = res("mipmap-anydpi-v26/ic_launcher.xml")
        if (bg.isFile) {
            assertTrue(bg.readText().contains("ic_launcher_background") || bg.readText().contains("color"))
        }
    }

    @Test fun launcherIconPathsHaveArea() {
        // The old icon used open paths with fillColor, which render invisibly.
        val vector = res("drawable/ic_launcher_foreground.xml").readText()
        val paths = Regex("""android:pathData="([^"]+)"""").findAll(vector).map { it.groupValues[1] }.toList()
        assertTrue("icon must declare paths", paths.isNotEmpty())
        paths.forEach { d ->
            assertTrue("path must be closed to have fill area: $d", d.trim().endsWith("Z", ignoreCase = true))
        }
        assertFalse("open-path leftovers", vector.contains("M42,40 L30,54 L42,68"))
    }

    @Test fun brandPaletteIsStableByDefault() {
        val theme = src("ui/theme/Theme.kt").readText()
        assertTrue("dynamicColor must default to false", theme.contains("dynamicColor: Boolean = false"))
    }

    @Test fun aboutSheetShowsVersionAndIsReachable() {
        val about = src("ui/About.kt").readText()
        assertTrue(about.contains("BuildConfig.VERSION_NAME"))
        assertTrue(about.contains("BuildConfig.VERSION_CODE"))
        val screen = src("ui/IdeScreen.kt").readText()
        assertTrue(screen.contains("Panel.ABOUT"))
        assertTrue(screen.contains("AboutSheet("))
        assertTrue(screen.contains("关于 WebViewIDE"))
        val gradle = File("build.gradle.kts").readText()
        assertTrue("BuildConfig must be generated", gradle.contains("buildConfig = true"))
    }
}
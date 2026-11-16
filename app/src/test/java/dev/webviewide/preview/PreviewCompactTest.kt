package dev.webviewide.preview

import java.io.File
import org.junit.Assert.assertTrue
import org.junit.Test

/** Pins the narrow-pane fallback so labelled buttons can't overflow the split pane again. */
class PreviewCompactTest {
    private val preview = File("src/main/java/dev/webviewide/preview/WebPreview.kt").readText()

    @Test fun narrowPaneFallsBackToIconControls() {
        assertTrue("must measure available width", preview.contains("BoxWithConstraints"))
        assertTrue("must define a compact threshold", preview.contains("maxWidth < 300.dp"))
        assertTrue("compact branch must exist", preview.contains("if (compact)"))
        assertTrue("width control needs an icon fallback", preview.contains("Icons.Outlined.AspectRatio"))
        assertTrue("console needs an icon fallback", preview.contains("contentDescription = \"控制台\""))
    }

    @Test fun consoleKeepsErrorBadgeWhenCompact() {
        assertTrue(preview.contains("BadgedBox"))
        assertTrue(preview.contains("Badge { Text(errorCount.toString()) }"))
    }

    @Test fun labelledButtonsRemainForWidePanes() {
        assertTrue(preview.contains("FilledTonalButton(onClick = { showConsole = !showConsole })"))
        assertTrue(preview.contains("maxLines = 1"))
        assertTrue(preview.contains("softWrap = false"))
    }

    @Test fun everyLongSheetScrollsSoActionsStayReachable() {
        val panels = File("src/main/java/dev/webviewide/ui/IdePanels.kt").readText()
        // Each sheet body must scroll; the project sheet previously did not, which
        // pushed 分享/导出/删除 off-screen and made them unreachable.
        val sheetStarts = Regex("""ModalBottomSheet\(onDismissRequest""").findAll(panels).map { it.range.first }.toList()
        assertTrue("expected at least three sheets", sheetStarts.size >= 3)
        sheetStarts.forEachIndexed { i, start ->
            val end = if (i + 1 < sheetStarts.size) sheetStarts[i + 1] else panels.length
            val body = panels.substring(start, end)
            assertTrue("sheet #$i body must scroll", body.contains("verticalScroll(rememberScrollState())"))
        }
    }

    @Test fun newUiCopyIsCentralised() {
        val strings = File("src/main/res/values/strings.xml").readText()
        listOf(
            "welcome_tagline", "welcome_pillars", "welcome_pick_title",
            "welcome_start_blank", "welcome_hint",
            "about_title", "about_version", "about_summary", "about_limit",
        ).forEach { key -> assertTrue("missing string $key", strings.contains("name=\"$key\"")) }
        val welcome = File("src/main/java/dev/webviewide/ui/Welcome.kt").readText()
        assertTrue(welcome.contains("stringResource(R.string.welcome_tagline)"))
    }
}
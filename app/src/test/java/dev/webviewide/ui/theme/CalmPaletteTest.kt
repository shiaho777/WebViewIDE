package dev.webviewide.ui.theme

import java.io.File
import org.junit.Assert.assertTrue
import org.junit.Test

/**
 * Pins the "low-contrast, bright, simply beautiful" direction so a future
 * change can't quietly reintroduce saturated tri-accent styling.
 *
 * Colors are read from source (Compose Color is an inline value class that is
 * awkward to assert on from a plain JVM test), then checked as RGB.
 */
class CalmPaletteTest {
    private val source = File("src/main/java/dev/webviewide/ui/theme/Color.kt").readText()

    private fun rgb(name: String): IntArray {
        val hex = Regex("""val $name = Color\(0x([0-9A-Fa-f]{8})\)""").find(source)?.groupValues?.get(1)
            ?: error("missing color $name")
        val v = hex.toLong(16)
        return intArrayOf(((v shr 16) and 0xFF).toInt(), ((v shr 8) and 0xFF).toInt(), (v and 0xFF).toInt())
    }

    private fun saturation(c: IntArray): Float {
        val max = c.max(); val min = c.min()
        return if (max == 0) 0f else (max - min).toFloat() / max
    }

    private fun luminance(c: IntArray): Float =
        (0.2126f * c[0] + 0.7152f * c[1] + 0.0722f * c[2]) / 255f

    private fun contrast(a: IntArray, b: IntArray): Float {
        fun lin(c: IntArray) = (0.2126 * srgb(c[0]) + 0.7152 * srgb(c[1]) + 0.0722 * srgb(c[2]))
        val l1 = lin(a); val l2 = lin(b)
        val hi = maxOf(l1, l2); val lo = minOf(l1, l2)
        return ((hi + 0.05) / (lo + 0.05)).toFloat()
    }

    private fun srgb(v: Int): Double {
        val s = v / 255.0
        return if (s <= 0.03928) s / 12.92 else Math.pow((s + 0.055) / 1.055, 2.4)
    }

    @Test fun accentsAreMutedNotVivid() {
        listOf(
            "md_primary", "md_secondary", "md_tertiary",
            "md_primary_d", "md_secondary_d", "md_tertiary_d",
        ).forEach { name ->
            val s = saturation(rgb(name))
            assertTrue("$name saturation $s should stay <= 0.40", s <= 0.40f)
        }
    }

    @Test fun oneAccentFamilyInsteadOfThreeCompetingHues() {
        // secondary/tertiary must be near-neutral relatives, not teal/purple.
        listOf("md_secondary", "md_tertiary", "md_secondary_d", "md_tertiary_d").forEach { name ->
            val s = saturation(rgb(name))
            assertTrue("$name should be near-neutral (sat $s)", s <= 0.20f)
        }
    }

    @Test fun containersAreBarelyTinted() {
        listOf(
            "md_primaryContainer", "md_secondaryContainer", "md_tertiaryContainer",
            "md_errorContainer",
        ).forEach { name ->
            val c = rgb(name)
            assertTrue("$name should stay bright", luminance(c) >= 0.85f)
            assertTrue("$name should be barely tinted", saturation(c) <= 0.12f)
        }
    }

    @Test fun lightSurfacesAreBrightAndCloseTogether() {
        val surfaces = listOf(
            "md_surface", "md_surfaceContainerLowest", "md_surfaceContainerLow",
            "md_surfaceContainer", "md_surfaceContainerHigh", "md_surfaceContainerHighest",
        ).map { luminance(rgb(it)) }
        assertTrue("all light surfaces should be bright", surfaces.all { it >= 0.88f })
        assertTrue("surface steps should be subtle", surfaces.max() - surfaces.min() <= 0.12f)
    }

    @Test fun textIsSoftenedButStillReadable() {
        val ratio = contrast(rgb("md_onSurface"), rgb("md_surface"))
        // Softer than near-black-on-white (~17) yet comfortably above WCAG AA.
        assertTrue("body contrast $ratio should be >= 4.5", ratio >= 4.5f)
        assertTrue("body contrast $ratio should stay <= 11 for a calm feel", ratio <= 11f)
        val muted = contrast(rgb("md_onSurfaceVariant"), rgb("md_surface"))
        assertTrue("secondary text contrast $muted should be >= 3.0", muted >= 3.0f)
        assertTrue("secondary text contrast $muted should stay <= 7", muted <= 7f)
    }

    @Test fun darkSchemeIsCharcoalNotNearBlack() {
        // Simple channel luminance (0..1): near-black sits under ~0.08, a soft
        // charcoal lands around 0.12, and anything above ~0.2 stops reading dark.
        val bg = luminance(rgb("md_surface_d"))
        assertTrue("dark surface should be a soft charcoal, not near-black ($bg)", bg in 0.09f..0.20f)
        val ratio = contrast(rgb("md_onSurface_d"), rgb("md_surface_d"))
        assertTrue("dark body contrast $ratio should be >= 4.5", ratio >= 4.5f)
        assertTrue("dark body contrast $ratio should stay <= 12", ratio <= 12f)
    }

    @Test fun noVividGradientsRemainInUi() {
        listOf(
            "src/main/java/dev/webviewide/ui/Welcome.kt",
            "src/main/java/dev/webviewide/ui/About.kt",
            "src/main/java/dev/webviewide/ui/IdePanels.kt",
        ).forEach { path ->
            val text = File(path).readText()
            assertTrue("$path should not use gradient brushes", !text.contains("linearGradient"))
        }
    }

    @Test fun surfaceTintIsNeutral() {
        val theme = File("src/main/java/dev/webviewide/ui/theme/Theme.kt").readText()
        assertTrue(theme.contains("surfaceTint = md_onSurfaceVariant,"))
        assertTrue(theme.contains("surfaceTint = md_onSurfaceVariant_d,"))
    }

    @Test fun syntaxHueShiftsNeverLandInViolet() {
        val editor = File("src/main/java/dev/webviewide/ui/editor/CmEditor.kt").readText()
        // The accent sits near 209°. Positive turns push it into violet (~288°),
        // the loud hue this palette removes; shifts must go negative (green/sand).
        val shifts = Regex("""hueShift\(keyword, ([+-]?[\d.]+)f\)""").findAll(editor)
            .map { it.groupValues[1].toFloat() }.toList()
        assertTrue("expected syntax hue shifts", shifts.isNotEmpty())
        shifts.forEach { t ->
            val hue = (209f + t * 360f + 360f) % 360f
            assertTrue("shift $t lands at hue $hue (violet)", hue < 250f || hue > 330f)
        }
        assertTrue("attribute tone must stay in-family", editor.contains("calmVariant(keyword)"))
    }

    @Test fun brandAssetsMatchTheCalmAccent() {
        val colors = File("src/main/res/values/colors.xml").readText()
        assertTrue(colors.contains("#61809B"))
        val iconBg = File("src/main/res/drawable/ic_launcher_background.xml").readText()
        assertTrue(iconBg.contains("#61809B"))
    }
}
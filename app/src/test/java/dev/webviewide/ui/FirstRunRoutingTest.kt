package dev.webviewide.ui

import dev.webviewide.project.Templates
import java.io.File
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

/**
 * The welcome screen must appear on a fresh install and never be replaced by a
 * silently created demo project. These assertions pin the source-level contract
 * (ProjectStore returns null, IdeScreen routes on loading) without needing an
 * Android runtime.
 */
class FirstRunRoutingTest {
    private val store = File("src/main/java/dev/webviewide/project/ProjectStore.kt").readText()
    private val screen = File("src/main/java/dev/webviewide/ui/IdeScreen.kt").readText()
    private val session = File("src/main/java/dev/webviewide/ui/IdeSession.kt").readText()
    private val welcome = File("src/main/java/dev/webviewide/ui/Welcome.kt").readText()

    @Test fun freshInstallHasNoProject() {
        assertTrue("current() must be nullable", store.contains("fun current(context: Context): WebProject?"))
        assertTrue("fresh install must return null", store.contains("return null"))
        assertFalse(
            "must not silently create a blank demo on first run",
            store.contains("""return create(context, "blank", "首页")"""),
        )
    }

    @Test fun deletingLastProjectReturnsToWelcome() {
        assertTrue(store.contains("fun delete(context: Context, project: WebProject): WebProject?"))
        assertTrue(store.contains("return if (rest.isEmpty()) null else open(context, rest.first().id)"))
    }

    @Test fun screenRoutesLoadingThenWelcome() {
        assertTrue("loading must gate the spinner", screen.contains("if (session.loading)"))
        assertTrue("welcome must render when no project", screen.contains("WelcomeScreen("))
        assertTrue(screen.contains("onCreateBlank = { session.create(\"blank\""))
    }

    @Test fun sessionTracksLoadingAndNullProject() {
        assertTrue(session.contains("var loading by mutableStateOf(true)"))
        assertTrue("show() must accept null", session.contains("private fun show(next: WebProject?)"))
        assertTrue("null show must clear project", session.contains("project = null"))
        assertTrue("null show must stop loading", session.contains("loading = false"))
    }

    @Test fun welcomeOffersEveryShowcaseStarter() {
        assertTrue(welcome.contains("Templates.showcase.forEach"))
        assertTrue(welcome.contains("TemplateCard("))
        assertEquals(3, Templates.showcase.size)
        // Brand + value proposition must be present, not just a template list.
        // Copy lives in strings.xml so it stays localisable.
        val strings = File("src/main/res/values/strings.xml").readText()
        assertTrue(welcome.contains("WebViewIDE"))
        assertTrue(welcome.contains("stringResource(R.string.welcome_pillars)"))
        assertTrue(strings.contains("免 root"))
        assertTrue(strings.contains("welcome_tagline"))
    }
}
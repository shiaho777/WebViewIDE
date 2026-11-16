package dev.webviewide.runtime

import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test

class UrlRoutingTest {
    @Test fun assetHostStaysInApp() {
        assertFalse(RuntimeNavigation.shouldOpenExternally("https", "appassets.androidplatform.net", true))
        assertFalse(RuntimeNavigation.shouldOpenExternally("https", "appassets.androidplatform.net", false))
    }

    @Test fun externalMainFramesLeaveTheApp() {
        assertTrue(RuntimeNavigation.shouldOpenExternally("https", "example.com", true))
        assertTrue(RuntimeNavigation.shouldOpenExternally("http", "192.168.1.5", true))
        assertTrue(RuntimeNavigation.shouldOpenExternally("mailto", null, true))
        assertTrue(RuntimeNavigation.shouldOpenExternally("tel", null, true))
    }

    @Test fun subresourcesAreNeverHijacked() {
        assertFalse(RuntimeNavigation.shouldOpenExternally("https", "cdn.example.com", false))
        assertFalse(RuntimeNavigation.shouldOpenExternally("http", "example.com", false))
    }

    @Test fun errorPageEscapesTheFailedUrl() {
        val html = RuntimeErrors.page("https://x.test/<script>alert(1)</script>?a=\"b\"&c=d")
        assertFalse(html.contains("<script>alert"))
        assertTrue(html.contains("&lt;script&gt;"))
        assertTrue(html.contains("&quot;b&quot;"))
        assertTrue(html.contains("&amp;c=d"))
        assertTrue(html.contains("https://appassets.androidplatform.net/www/"))
    }

    @Test fun pathCleaningBlocksTraversal() {
        assertEquals("index.html", RuntimePaths.clean("index.html"))
        assertEquals("a/b.css", RuntimePaths.clean("a/./b.css"))
        assertEquals("", RuntimePaths.clean("/"))
        assertEquals("b", RuntimePaths.clean("a/../b"))
        assertNull(RuntimePaths.clean("../escape"))
        assertNull(RuntimePaths.clean("a/../../escape"))
        assertNull(RuntimePaths.clean("a\u0000b"))
        assertEquals("a/b", RuntimePaths.clean("a%2Fb"))
    }
}
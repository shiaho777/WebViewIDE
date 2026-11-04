package dev.webviewide.preview

import android.os.Build
import android.webkit.CookieManager
import android.webkit.WebSettings
import android.webkit.WebView
import androidx.webkit.WebSettingsCompat
import androidx.webkit.WebViewFeature
import dev.webviewide.R
import dev.webviewide.project.WebViewConfig

fun applyWebSettings(web: WebView, config: WebViewConfig) {
    val settings = web.settings
    settings.javaScriptEnabled = config.javaScript
    settings.domStorageEnabled = config.domStorage
    @Suppress("DEPRECATION")
    settings.databaseEnabled = config.database
    settings.setSupportZoom(config.zoom)
    settings.builtInZoomControls = config.zoom
    settings.displayZoomControls = config.zoom && config.displayZoomControls
    settings.useWideViewPort = config.wideViewport
    settings.loadWithOverviewMode = config.overviewMode
    settings.mediaPlaybackRequiresUserGesture = config.mediaGestureRequired
    settings.textZoom = config.textZoom.coerceIn(50, 200)
    settings.allowFileAccess = config.allowFileAccess
    settings.allowContentAccess = config.allowContentAccess
    settings.javaScriptCanOpenWindowsAutomatically = config.javascriptCanOpenWindows
    settings.setSupportMultipleWindows(config.multipleWindows)
    settings.blockNetworkLoads = config.blockNetwork
    settings.loadsImagesAutomatically = true
    settings.cacheMode = when (config.cacheMode) {
        WebViewConfig.CACHE_NO -> WebSettings.LOAD_NO_CACHE
        WebViewConfig.CACHE_ELSE_NETWORK -> WebSettings.LOAD_CACHE_ELSE_NETWORK
        WebViewConfig.CACHE_ONLY -> WebSettings.LOAD_CACHE_ONLY
        else -> WebSettings.LOAD_DEFAULT
    }
    settings.mixedContentMode = when (config.mixedContent) {
        WebViewConfig.MIXED_ALWAYS -> WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
        WebViewConfig.MIXED_NEVER -> WebSettings.MIXED_CONTENT_NEVER_ALLOW
        else -> WebSettings.MIXED_CONTENT_COMPATIBILITY_MODE
    }
    if (web.getTag(R.id.preview_default_user_agent) == null) web.setTag(R.id.preview_default_user_agent, settings.userAgentString)
    val fallback = web.getTag(R.id.preview_default_user_agent) as? String
    settings.userAgentString = when (config.userAgent) {
        WebViewConfig.UA_DESKTOP -> WebViewConfig.DESKTOP_UA
        WebViewConfig.UA_CUSTOM -> config.customUserAgent.ifBlank { fallback }
        else -> fallback
    }
    setHiddenBool(settings, "setAllowFileAccessFromFileURLs", config.allowFileFromFile)
    setHiddenBool(settings, "setAllowUniversalAccessFromFileURLs", config.allowFileFromFile)
    if (WebViewFeature.isFeatureSupported(WebViewFeature.SAFE_BROWSING_ENABLE)) {
        WebSettingsCompat.setSafeBrowsingEnabled(settings, config.safeBrowsing)
    } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        settings.safeBrowsingEnabled = config.safeBrowsing
    }
    if (WebViewFeature.isFeatureSupported(WebViewFeature.ALGORITHMIC_DARKENING)) {
        WebSettingsCompat.setAlgorithmicDarkeningAllowed(settings, config.forceDark)
    } else if (WebViewFeature.isFeatureSupported(WebViewFeature.FORCE_DARK)) {
        @Suppress("DEPRECATION")
        WebSettingsCompat.setForceDark(
            settings,
            if (config.forceDark) WebSettingsCompat.FORCE_DARK_ON else WebSettingsCompat.FORCE_DARK_OFF,
        )
    }
    CookieManager.getInstance().setAcceptCookie(true)
    CookieManager.getInstance().setAcceptThirdPartyCookies(web, config.thirdPartyCookies)
    WebView.setWebContentsDebuggingEnabled(config.remoteDebugging)
}

private fun setHiddenBool(settings: WebSettings, name: String, value: Boolean) {
    runCatching {
        val method = WebSettings::class.java.getMethod(name, Boolean::class.javaPrimitiveType)
        method.invoke(settings, value)
    }
}

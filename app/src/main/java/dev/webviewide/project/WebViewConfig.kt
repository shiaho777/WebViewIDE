package dev.webviewide.project

data class WebViewConfig(
    val javaScript: Boolean = true,
    val domStorage: Boolean = true,
    val database: Boolean = true,
    val thirdPartyCookies: Boolean = true,
    val mixedContent: String = MIXED_COMPAT,
    val zoom: Boolean = true,
    val displayZoomControls: Boolean = false,
    val wideViewport: Boolean = true,
    val overviewMode: Boolean = true,
    val mediaGestureRequired: Boolean = false,
    val textZoom: Int = 100,
    val forceDark: Boolean = false,
    val safeBrowsing: Boolean = true,
    val cacheMode: String = CACHE_DEFAULT,
    val userAgent: String = UA_MOBILE,
    val customUserAgent: String = "",
    val remoteDebugging: Boolean = true,
    val allowFileAccess: Boolean = false,
    val allowContentAccess: Boolean = true,
    val allowFileFromFile: Boolean = false,
    val javascriptCanOpenWindows: Boolean = true,
    val multipleWindows: Boolean = true,
    val blockNetwork: Boolean = false,
    val geolocation: Boolean = true,
    val cameraMic: Boolean = true,
    val fileChooser: Boolean = true,
    val downloads: Boolean = true,
    val jsDialogs: Boolean = true,
    val fullscreen: Boolean = true,
) {
    fun toMap(): Map<String, Any?> = linkedMapOf(
        "javaScript" to javaScript,
        "domStorage" to domStorage,
        "database" to database,
        "thirdPartyCookies" to thirdPartyCookies,
        "mixedContent" to mixedContent,
        "zoom" to zoom,
        "displayZoomControls" to displayZoomControls,
        "wideViewport" to wideViewport,
        "overviewMode" to overviewMode,
        "mediaGestureRequired" to mediaGestureRequired,
        "textZoom" to textZoom.coerceIn(50, 200),
        "forceDark" to forceDark,
        "safeBrowsing" to safeBrowsing,
        "cacheMode" to cacheMode,
        "userAgent" to userAgent,
        "customUserAgent" to customUserAgent,
        "remoteDebugging" to remoteDebugging,
        "allowFileAccess" to allowFileAccess,
        "allowContentAccess" to allowContentAccess,
        "allowFileFromFile" to allowFileFromFile,
        "javascriptCanOpenWindows" to javascriptCanOpenWindows,
        "multipleWindows" to multipleWindows,
        "blockNetwork" to blockNetwork,
        "geolocation" to geolocation,
        "cameraMic" to cameraMic,
        "fileChooser" to fileChooser,
        "downloads" to downloads,
        "jsDialogs" to jsDialogs,
        "fullscreen" to fullscreen,
    )

    fun encode(): String = encodeJson(toMap())

    fun extraPermissions(): Set<String> = buildSet {
        if (geolocation) {
            add("android.permission.ACCESS_COARSE_LOCATION")
            add("android.permission.ACCESS_FINE_LOCATION")
        }
        if (cameraMic) {
            add("android.permission.CAMERA")
            add("android.permission.RECORD_AUDIO")
        }
    }

    companion object {
        const val MIXED_NEVER = "never"
        const val MIXED_COMPAT = "compatibility"
        const val MIXED_ALWAYS = "always"
        const val CACHE_DEFAULT = "default"
        const val CACHE_NO = "no-cache"
        const val CACHE_ELSE_NETWORK = "cache-else-network"
        const val CACHE_ONLY = "cache-only"
        const val UA_MOBILE = "mobile"
        const val UA_DESKTOP = "desktop"
        const val UA_CUSTOM = "custom"
        const val DESKTOP_UA =
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"

        fun fromMap(map: Map<String, Any?>): WebViewConfig {
            if (map.isEmpty()) return WebViewConfig()
            val base = WebViewConfig()
            return base.copy(
                javaScript = map.boolean("javaScript", base.javaScript),
                domStorage = map.boolean("domStorage", base.domStorage),
                database = map.boolean("database", base.database),
                thirdPartyCookies = map.boolean("thirdPartyCookies", base.thirdPartyCookies),
                mixedContent = map.string("mixedContent", base.mixedContent),
                zoom = map.boolean("zoom", base.zoom),
                displayZoomControls = map.boolean("displayZoomControls", base.displayZoomControls),
                wideViewport = map.boolean("wideViewport", base.wideViewport),
                overviewMode = map.boolean("overviewMode", base.overviewMode),
                mediaGestureRequired = map.boolean("mediaGestureRequired", base.mediaGestureRequired),
                textZoom = map.int("textZoom", base.textZoom).coerceIn(50, 200),
                forceDark = map.boolean("forceDark", base.forceDark),
                safeBrowsing = map.boolean("safeBrowsing", base.safeBrowsing),
                cacheMode = map.string("cacheMode", base.cacheMode),
                userAgent = map.string("userAgent", base.userAgent),
                customUserAgent = map.string("customUserAgent", base.customUserAgent),
                remoteDebugging = map.boolean("remoteDebugging", base.remoteDebugging),
                allowFileAccess = map.boolean("allowFileAccess", base.allowFileAccess),
                allowContentAccess = map.boolean("allowContentAccess", base.allowContentAccess),
                allowFileFromFile = map.boolean("allowFileFromFile", base.allowFileFromFile),
                javascriptCanOpenWindows = map.boolean("javascriptCanOpenWindows", base.javascriptCanOpenWindows),
                multipleWindows = map.boolean("multipleWindows", base.multipleWindows),
                blockNetwork = map.boolean("blockNetwork", base.blockNetwork),
                geolocation = map.boolean("geolocation", base.geolocation),
                cameraMic = map.boolean("cameraMic", base.cameraMic),
                fileChooser = map.boolean("fileChooser", base.fileChooser),
                downloads = map.boolean("downloads", base.downloads),
                jsDialogs = map.boolean("jsDialogs", base.jsDialogs),
                fullscreen = map.boolean("fullscreen", base.fullscreen),
            )
        }
    }
}

package dev.webviewide

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen
import dev.webviewide.ui.IdeScreen
import dev.webviewide.ui.theme.WebViewIDETheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        // Must run before super.onCreate so the platform hands the splash
        // window over to us instead of flashing a bare theme.
        installSplashScreen()
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            WebViewIDETheme {
                IdeScreen()
            }
        }
    }
}
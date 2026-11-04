package dev.webviewide.ui.theme

import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.dynamicDarkColorScheme
import androidx.compose.material3.dynamicLightColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.platform.LocalContext

private val LightColors = lightColorScheme(
    primary = md_primary,
    onPrimary = md_onPrimary,
    primaryContainer = md_primaryContainer,
    onPrimaryContainer = md_onPrimaryContainer,
    inversePrimary = md_inversePrimary,
    secondary = md_secondary,
    onSecondary = md_onSecondary,
    secondaryContainer = md_secondaryContainer,
    onSecondaryContainer = md_onSecondaryContainer,
    tertiary = md_tertiary,
    onTertiary = md_onTertiary,
    tertiaryContainer = md_tertiaryContainer,
    onTertiaryContainer = md_onTertiaryContainer,
    background = md_background,
    onBackground = md_onBackground,
    surface = md_surface,
    onSurface = md_onSurface,
    surfaceVariant = md_surfaceVariant,
    onSurfaceVariant = md_onSurfaceVariant,
    surfaceTint = md_primary,
    inverseSurface = md_inverseSurface,
    inverseOnSurface = md_inverseOnSurface,
    error = md_error,
    onError = md_onError,
    errorContainer = md_errorContainer,
    onErrorContainer = md_onErrorContainer,
    outline = md_outline,
    outlineVariant = md_outlineVariant,
    surfaceBright = md_surfaceBright,
    surfaceDim = md_surfaceDim,
    surfaceContainerLowest = md_surfaceContainerLowest,
    surfaceContainerLow = md_surfaceContainerLow,
    surfaceContainer = md_surfaceContainer,
    surfaceContainerHigh = md_surfaceContainerHigh,
    surfaceContainerHighest = md_surfaceContainerHighest,
)

private val DarkColors = darkColorScheme(
    primary = md_primary_d,
    onPrimary = md_onPrimary_d,
    primaryContainer = md_primaryContainer_d,
    onPrimaryContainer = md_onPrimaryContainer_d,
    inversePrimary = md_inversePrimary_d,
    secondary = md_secondary_d,
    onSecondary = md_onSecondary_d,
    secondaryContainer = md_secondaryContainer_d,
    onSecondaryContainer = md_onSecondaryContainer_d,
    tertiary = md_tertiary_d,
    onTertiary = md_onTertiary_d,
    tertiaryContainer = md_tertiaryContainer_d,
    onTertiaryContainer = md_onTertiaryContainer_d,
    background = md_background_d,
    onBackground = md_onBackground_d,
    surface = md_surface_d,
    onSurface = md_onSurface_d,
    surfaceVariant = md_surfaceVariant_d,
    onSurfaceVariant = md_onSurfaceVariant_d,
    surfaceTint = md_primary_d,
    inverseSurface = md_inverseSurface_d,
    inverseOnSurface = md_inverseOnSurface_d,
    error = md_error_d,
    onError = md_onError_d,
    errorContainer = md_errorContainer_d,
    onErrorContainer = md_onErrorContainer_d,
    outline = md_outline_d,
    outlineVariant = md_outlineVariant_d,
    surfaceBright = md_surfaceBright_d,
    surfaceDim = md_surfaceDim_d,
    surfaceContainerLowest = md_surfaceContainerLowest_d,
    surfaceContainerLow = md_surfaceContainerLow_d,
    surfaceContainer = md_surfaceContainer_d,
    surfaceContainerHigh = md_surfaceContainerHigh_d,
    surfaceContainerHighest = md_surfaceContainerHighest_d,
)

@Composable
fun WebViewIDETheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    dynamicColor: Boolean = true,
    content: @Composable () -> Unit,
) {
    val context = LocalContext.current
    val colorScheme = when {
        dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S ->
            if (darkTheme) dynamicDarkColorScheme(context) else dynamicLightColorScheme(context)
        darkTheme -> DarkColors
        else -> LightColors
    }
    MaterialTheme(
        colorScheme = colorScheme,
        shapes = Shapes,
        typography = Typography,
        content = content,
    )
}

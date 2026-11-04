package dev.webviewide.ui.theme

import androidx.compose.animation.core.FiniteAnimationSpec
import androidx.compose.animation.core.spring
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.IntSize

/**
 * Spring specs shared by the app's own animations.
 *
 * Material 3 1.4.0 keeps `MotionScheme` internal, so components cannot be
 * themed with these; custom transitions use them directly instead.
 * Spatial specs (position, size, shape) are slightly underdamped so moving
 * surfaces settle with a small overshoot. Effects specs (color, alpha) are
 * critically damped so they never flicker past their target.
 */
object AppMotion {
    fun <T> spatial(): FiniteAnimationSpec<T> = spring(dampingRatio = 0.8f, stiffness = 380f)

    fun <T> spatialFast(): FiniteAnimationSpec<T> = spring(dampingRatio = 0.6f, stiffness = 800f)

    fun <T> spatialSlow(): FiniteAnimationSpec<T> = spring(dampingRatio = 0.8f, stiffness = 200f)

    fun <T> effects(): FiniteAnimationSpec<T> = spring(dampingRatio = 1f, stiffness = 1600f)

    fun <T> effectsFast(): FiniteAnimationSpec<T> = spring(dampingRatio = 1f, stiffness = 3800f)

    fun <T> effectsSlow(): FiniteAnimationSpec<T> = spring(dampingRatio = 1f, stiffness = 800f)

    val offset: FiniteAnimationSpec<IntOffset> = spring(dampingRatio = 0.8f, stiffness = 380f)

    val size: FiniteAnimationSpec<IntSize> = spring(dampingRatio = 0.8f, stiffness = 380f)
}

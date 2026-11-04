package dev.webviewide.ui.bifold

import androidx.compose.animation.core.FiniteAnimationSpec
import androidx.compose.animation.core.spring

internal object Motion {
    /** Pane ratio and hinge size: a little underdamped so a fling settles with a soft overshoot. */
    fun <T> pane(): FiniteAnimationSpec<T> = spring(dampingRatio = 0.82f, stiffness = 420f)

    /** Color and alpha: critically damped, no visible bounce. */
    fun <T> fade(): FiniteAnimationSpec<T> = spring(dampingRatio = 1f, stiffness = 1600f)
}

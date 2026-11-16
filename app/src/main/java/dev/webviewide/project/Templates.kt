package dev.webviewide.project

/**
 * Starter templates shipped in assets/templates/<id>.
 *
 * [accent]/[accent2] drive the picker's gradient preview so a template reads
 * as a piece of work rather than a name in a chip row. [showcase] marks the
 * three polished starters surfaced on the welcome screen.
 */
data class Template(
    val id: String,
    val name: String,
    val description: String,
    val accent: Long,
    val accent2: Long,
    val showcase: Boolean = false,
)

object Templates {
    val all: List<Template> = listOf(
        Template(
            id = "portfolio",
            name = "个人主页",
            description = "渐变头图、作品卡与滚动动画，改文字就是你的主页",
            accent = 0xFF6EA8FE,
            accent2 = 0xFFB18CFF,
            showcase = true,
        ),
        Template(
            id = "game",
            name = "快点方块",
            description = "30 秒计分小游戏，含连击、飘分与最高分记录",
            accent = 0xFFFFD166,
            accent2 = 0xFFFF9F68,
            showcase = true,
        ),
        Template(
            id = "tool",
            name = "专注记账",
            description = "环形倒计时 + 本地记账，数据存在手机里",
            accent = 0xFF5EEAD4,
            accent2 = 0xFF60A5FA,
            showcase = true,
        ),
        Template(
            id = "blank",
            name = "空白页",
            description = "最小骨架，从零开始写",
            accent = 0xFF9AA3AF,
            accent2 = 0xFF6B7280,
        ),
        Template(
            id = "multipage",
            name = "多页面",
            description = "两个页面互相跳转，练习链接与目录",
            accent = 0xFF7DDC8A,
            accent2 = 0xFF6EA8FE,
        ),
        Template(
            id = "vue",
            name = "Vue 待办",
            description = "本地 Vue，无需 npm 的待办清单",
            accent = 0xFF42B883,
            accent2 = 0xFF35495E,
        ),
        Template(
            id = "react",
            name = "React 待办",
            description = "本地 React + htm，免编译的待办清单",
            accent = 0xFF61DAFB,
            accent2 = 0xFF2C7BE5,
        ),
    )

    val showcase: List<Template> = all.filter { it.showcase }

    fun byId(id: String): Template? = all.firstOrNull { it.id == id }

    fun isKnown(id: String): Boolean = byId(id) != null
}
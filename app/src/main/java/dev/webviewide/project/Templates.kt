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
            accent = 0xFF7C93AB,
            accent2 = 0xFF9BA9B8,
            showcase = true,
        ),
        Template(
            id = "game",
            name = "快点方块",
            description = "30 秒计分小游戏，含连击、飘分与最高分记录",
            accent = 0xFFB39B7E,
            accent2 = 0xFFC4B299,
            showcase = true,
        ),
        Template(
            id = "tool",
            name = "专注记账",
            description = "环形倒计时 + 本地记账，数据存在手机里",
            accent = 0xFF86A39B,
            accent2 = 0xFFA3B8B2,
            showcase = true,
        ),
        Template(
            id = "blank",
            name = "空白页",
            description = "最小骨架，从零开始写",
            accent = 0xFF9AA1A9,
            accent2 = 0xFFB0B6BC,
        ),
        Template(
            id = "multipage",
            name = "多页面",
            description = "两个页面互相跳转，练习链接与目录",
            accent = 0xFF93A38C,
            accent2 = 0xFFAEB8A8,
        ),
        Template(
            id = "vue",
            name = "Vue 待办",
            description = "本地 Vue，无需 npm 的待办清单",
            accent = 0xFF84A292,
            accent2 = 0xFFA2B5AA,
        ),
        Template(
            id = "react",
            name = "React 待办",
            description = "本地 React + htm，免编译的待办清单",
            accent = 0xFF8AA1B5,
            accent2 = 0xFFA8B9C7,
        ),
    )

    val showcase: List<Template> = all.filter { it.showcase }

    fun byId(id: String): Template? = all.firstOrNull { it.id == id }

    fun isKnown(id: String): Boolean = byId(id) != null
}
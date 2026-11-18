package dev.webviewide.git

import java.io.File
import org.eclipse.jgit.lib.ConfigConstants
import org.eclipse.jgit.storage.file.FileBasedConfig
import org.eclipse.jgit.util.FS
import org.eclipse.jgit.util.SystemReader

/**
 * Pins JGit's environment so it never probes Android system paths.
 * Global/system gitconfig are stubbed empty; identity comes from the repo config.
 */
object GitEnv {
    @Volatile
    private var installed = false

    /** Idempotent; call before any JGit use. [home] should be an app-private dir. */
    fun init(home: File) {
        if (installed) return
        synchronized(this) {
            if (installed) return
            if (!home.exists()) home.mkdirs()
            val base = SystemReader.getInstance()
            SystemReader.setInstance(object : SystemReader() {
                override fun getHostname(): String = base.hostname
                override fun getenv(variable: String): String? =
                    if (variable.startsWith("GIT_")) null else base.getenv(variable)

                override fun getProperty(key: String): String? =
                    if (key == "user.home") home.absolutePath else base.getProperty(key)

                override fun openUserConfig(parent: org.eclipse.jgit.lib.Config?, fs: FS): FileBasedConfig =
                    FileBasedConfig(File(home, ".gitconfig"), fs)

                override fun openSystemConfig(parent: org.eclipse.jgit.lib.Config?, fs: FS): FileBasedConfig =
                    FileBasedConfig(File(home, ".gitconfig-system"), fs)

                override fun openJGitConfig(parent: org.eclipse.jgit.lib.Config?, fs: FS): FileBasedConfig =
                    FileBasedConfig(File(home, ".jgitconfig"), fs)

                override fun getCurrentTime(): Long = base.currentTime
                override fun getTimezone(whenMs: Long): Int = base.getTimezone(whenMs)
            })
            installed = true
        }
    }

    /** Repo-local settings that keep Android filesystems from confusing JGit. */
    fun tune(repo: org.eclipse.jgit.lib.Repository) {
        val config = repo.config
        config.setBoolean(ConfigConstants.CONFIG_CORE_SECTION, null, ConfigConstants.CONFIG_KEY_FILEMODE, false)
        config.setBoolean(ConfigConstants.CONFIG_CORE_SECTION, null, ConfigConstants.CONFIG_KEY_AUTOCRLF, false)
        if (config.getString(ConfigConstants.CONFIG_USER_SECTION, null, ConfigConstants.CONFIG_KEY_NAME).isNullOrBlank()) {
            config.setString(ConfigConstants.CONFIG_USER_SECTION, null, ConfigConstants.CONFIG_KEY_NAME, "WebViewIDE")
            config.setString(ConfigConstants.CONFIG_USER_SECTION, null, ConfigConstants.CONFIG_KEY_EMAIL, "ide@webviewide.local")
        }
        config.save()
    }
}
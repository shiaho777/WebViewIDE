package dev.webviewide.build

import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import dev.webviewide.ui.IdeSession

/**
 * Mounts the hidden build runtime + net/build controllers and routes bridge
 * events into the session (progress/log/finish). Must be placed in a real layout
 * slot (the Scaffold content root) so the WebView actually attaches.
 */
@Composable
fun BuildHost(
    session: IdeSession,
    buildCtl: BuildController,
    onHandle: (BuildHandle?) -> Unit,
    modifier: Modifier = Modifier,
) {
    val context = LocalContext.current
    var handle by remember { mutableStateOf<BuildHandle?>(null) }
    val netCtl = remember {
        BuildNetController(context.filesDir) { m -> handle?.send(m) }
    }
    BuildRuntime(
        onEvent = { id, ev ->
            when (ev) {
                is BuildEvent.Net -> netCtl.handle(id, ev.url, ev.integrity)
                is BuildEvent.FsWrite -> {
                    val root = session.project?.srcDir
                    val ok = root != null && BuildFs.writeText(root, ev.path, ev.text ?: "")
                    handle?.send(BuildBridge.fsWriteResponse(id, ok, ""))
                }
                is BuildEvent.FsRead -> {
                    val root = session.project?.srcDir
                    val text = root?.let { BuildFs.readText(it, ev.path) }
                    handle?.send(BuildBridge.fsReadResponse(id, text, text != null))
                }
                is BuildEvent.ReadSource -> buildCtl.readSource(id, ev.path)
                is BuildEvent.ListSource -> buildCtl.listSource(id)
                is BuildEvent.WriteDist -> buildCtl.writeDist(id, ev.path, ev.b64)
                is BuildEvent.Log -> session.appendBuildLog(ev.text)
                is BuildEvent.Progress -> session.setBuildProgress(ev.fraction, ev.label)
                is BuildEvent.Done -> session.onBuildFinished(ev.ok, ev.summary)
                is BuildEvent.TcDone -> session.onTypecheckFinished(ev.ok, ev.summary)
                is BuildEvent.Error -> session.appendBuildLog("错误：${ev.message}")
                else -> {}
            }
        },
        onHandle = {
            handle = it
            onHandle(it)
        },
        modifier = modifier,
    )
}
package dev.webviewide.ui

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Button
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.unit.dp
import dev.webviewide.build.BuildBridge
import dev.webviewide.build.BuildHandle

/** Install / build controls with progress and a rolling log. */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
internal fun BuildPanel(
    handle: BuildHandle?,
    running: Boolean,
    fraction: Float,
    label: String,
    log: List<String>,
    hasPackageJson: Boolean,
    onRunning: () -> Unit,
    onStartBuild: () -> Unit,
    onStartTypecheck: () -> Unit,
    onDismiss: () -> Unit,
) {
    ModalBottomSheet(onDismissRequest = onDismiss) {
        Column(
            Modifier.fillMaxWidth().padding(start = 24.dp, end = 24.dp, bottom = 28.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
        ) {
            Text("NPM 构建", style = MaterialTheme.typography.titleLarge)
            Text(
                if (hasPackageJson) "安装依赖后用 esbuild 打包到 dist，预览与打包自动使用产物。打包只转译；「类型检查」单独查 .ts/.tsx 的类型错误（.vue 内部暂不检查）。"
                else "当前项目没有 package.json。可先新建 npm-react 模板，或手动添加 package.json。",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                Button(
                    onClick = { onRunning(); handle?.send(BuildBridge.install(1)) },
                    enabled = handle != null && !running && hasPackageJson,
                    modifier = Modifier.weight(1f),
                ) { Text("安装依赖") }
                OutlinedButton(
                    onClick = { onRunning(); onStartBuild(); handle?.send(BuildBridge.build(2)) },
                    enabled = handle != null && !running && hasPackageJson,
                    modifier = Modifier.weight(1f),
                ) { Text("构建") }
            }
            OutlinedButton(
                onClick = { onRunning(); onStartTypecheck(); handle?.send(BuildBridge.typecheck(3)) },
                enabled = handle != null && !running && hasPackageJson,
                modifier = Modifier.fillMaxWidth(),
            ) { Text("类型检查（TS，首次需联网下载编译器）") }
            if (running || fraction > 0f) {
                LinearProgressIndicator(progress = { fraction }, modifier = Modifier.fillMaxWidth())
                Text(label, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
            LazyColumn(Modifier.heightIn(max = 260.dp)) {
                items(log) { line ->
                    Text(
                        line,
                        style = MaterialTheme.typography.bodySmall,
                        fontFamily = FontFamily.Monospace,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
            }
        }
    }
}
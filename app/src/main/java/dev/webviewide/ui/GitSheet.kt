package dev.webviewide.ui

import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.unit.dp
import dev.webviewide.git.GitRepo
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

/** Local Git: init, review changes (tap for diff), commit, browse history, restore. */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
internal fun GitSheet(
    ready: Boolean,
    changes: List<GitRepo.Change>,
    commits: List<GitRepo.CommitInfo>,
    busy: Boolean,
    diff: Pair<String, String>?,
    onInit: () -> Unit,
    onRefresh: () -> Unit,
    onCommit: (String) -> Unit,
    onDiff: (String) -> Unit,
    onDiffClose: () -> Unit,
    onRestore: (String) -> Unit,
    onDismiss: () -> Unit,
) {
    var message by remember { mutableStateOf("") }
    var confirmRestore by remember { mutableStateOf<String?>(null) }
    LaunchedEffect(Unit) { onRefresh() }
    ModalBottomSheet(onDismissRequest = onDismiss) {
        Column(
            Modifier.fillMaxWidth().padding(start = 24.dp, end = 24.dp, bottom = 28.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp),
        ) {
            Text("Git", style = MaterialTheme.typography.titleLarge)
            if (!ready) {
                Text(
                    "这个项目还没有 Git 仓库。初始化后可以提交版本、查看历史，全部在本机完成，不需要网络。",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
                Button(onClick = onInit, enabled = !busy, modifier = Modifier.fillMaxWidth()) {
                    Text(if (busy) "正在初始化…" else "初始化仓库")
                }
            } else {
                Text(
                    if (changes.isEmpty()) "工作区是干净的，没有待提交的改动。" else "有 ${changes.size} 处改动待提交，点文件可看差异。",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
                if (changes.isNotEmpty()) {
                    LazyColumn(Modifier.heightIn(max = 220.dp)) {
                        items(changes, key = { it.kind.name + ":" + it.path }) { change ->
                            Row(
                                Modifier.fillMaxWidth().padding(vertical = 4.dp),
                                verticalAlignment = Alignment.CenterVertically,
                            ) {
                                Text(
                                    label(change.kind),
                                    style = MaterialTheme.typography.labelMedium,
                                    color = MaterialTheme.colorScheme.primary,
                                    modifier = Modifier.padding(end = 12.dp),
                                )
                                Text(
                                    change.path,
                                    style = MaterialTheme.typography.bodyMedium,
                                    fontFamily = FontFamily.Monospace,
                                    modifier = Modifier.weight(1f).clickable { onDiff(change.path) },
                                )
                                if (change.kind == GitRepo.Change.Kind.MODIFIED || change.kind == GitRepo.Change.Kind.REMOVED) {
                                    TextButton(onClick = { confirmRestore = change.path }) { Text("恢复") }
                                }
                            }
                            HorizontalDivider()
                        }
                    }
                }
                OutlinedTextField(
                    value = message,
                    onValueChange = { message = it },
                    label = { Text("提交说明") },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth(),
                )
                Button(
                    onClick = {
                        onCommit(message)
                        message = ""
                    },
                    enabled = !busy && changes.isNotEmpty() && message.isNotBlank(),
                    modifier = Modifier.fillMaxWidth(),
                ) {
                    Text(if (busy) "正在提交…" else "提交")
                }
                if (commits.isNotEmpty()) {
                    Text(
                        "提交历史",
                        style = MaterialTheme.typography.titleSmall,
                        modifier = Modifier.padding(top = 8.dp),
                    )
                    val fmt = SimpleDateFormat("MM-dd HH:mm", Locale.getDefault())
                    LazyColumn(Modifier.heightIn(max = 180.dp)) {
                        items(commits, key = { it.hash }) { commit ->
                            Row(
                                Modifier.fillMaxWidth().padding(vertical = 4.dp),
                                verticalAlignment = Alignment.CenterVertically,
                            ) {
                                Text(
                                    commit.hash,
                                    style = MaterialTheme.typography.bodySmall,
                                    fontFamily = FontFamily.Monospace,
                                    color = MaterialTheme.colorScheme.primary,
                                    modifier = Modifier.padding(end = 10.dp),
                                )
                                Text(
                                    commit.message,
                                    style = MaterialTheme.typography.bodyMedium,
                                    modifier = Modifier.weight(1f),
                                )
                                Text(
                                    fmt.format(Date(commit.time)),
                                    style = MaterialTheme.typography.bodySmall,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                                )
                            }
                            HorizontalDivider()
                        }
                    }
                }
            }
        }
    }
    diff?.let { (path, text) ->
        AlertDialog(
            onDismissRequest = onDiffClose,
            confirmButton = { TextButton(onClick = onDiffClose) { Text("关闭") } },
            title = { Text(path, style = MaterialTheme.typography.titleMedium) },
            text = {
                Column(Modifier.heightIn(max = 420.dp).verticalScroll(rememberScrollState())) {
                    Text(
                        text,
                        style = MaterialTheme.typography.bodySmall,
                        fontFamily = FontFamily.Monospace,
                        modifier = Modifier.horizontalScroll(rememberScrollState()),
                    )
                }
            },
        )
    }
    confirmRestore?.let { path ->
        AlertDialog(
            onDismissRequest = { confirmRestore = null },
            confirmButton = {
                TextButton(onClick = {
                    onRestore(path)
                    confirmRestore = null
                }) { Text("恢复") }
            },
            dismissButton = { TextButton(onClick = { confirmRestore = null }) { Text("取消") } },
            title = { Text("恢复这个文件？") },
            text = { Text("$path 会回到最近一次提交的内容，当前未提交的修改会被丢弃。") },
        )
    }
}

private fun label(kind: GitRepo.Change.Kind): String = when (kind) {
    GitRepo.Change.Kind.ADDED -> "新增"
    GitRepo.Change.Kind.MODIFIED -> "修改"
    GitRepo.Change.Kind.REMOVED -> "删除"
    GitRepo.Change.Kind.UNTRACKED -> "未跟踪"
    GitRepo.Change.Kind.CONFLICT -> "冲突"
}
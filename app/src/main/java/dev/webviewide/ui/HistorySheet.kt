package dev.webviewide.ui

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.unit.dp
import dev.webviewide.project.FileHistory
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

/** Lists local version snapshots of the active file and rolls back on tap. */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
internal fun HistorySheet(
    fileName: String,
    entries: List<FileHistory.Entry>,
    onRollback: (Long) -> Unit,
    onDismiss: () -> Unit,
) {
    val fmt = SimpleDateFormat("MM-dd HH:mm:ss", Locale.getDefault())
    ModalBottomSheet(onDismissRequest = onDismiss) {
        Column(
            Modifier.fillMaxWidth().padding(start = 24.dp, end = 24.dp, bottom = 28.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp),
        ) {
            Text("历史版本 · $fileName", style = MaterialTheme.typography.titleLarge)
            Text(
                "每次保存自动留一个快照，最多 20 个。点「回滚」恢复到该版本。",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
            if (entries.isEmpty()) {
                Text(
                    "还没有历史快照，先编辑并保存几次。",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    modifier = Modifier.padding(vertical = 16.dp),
                )
            } else {
                LazyColumn(Modifier.heightIn(max = 420.dp)) {
                    items(entries, key = { it.ts }) { entry ->
                        Row(
                            Modifier.fillMaxWidth().padding(vertical = 4.dp),
                            verticalAlignment = Alignment.CenterVertically,
                        ) {
                            Text(
                                fmt.format(Date(entry.ts)),
                                style = MaterialTheme.typography.bodyMedium,
                                fontFamily = FontFamily.Monospace,
                                modifier = Modifier.weight(1f),
                            )
                            TextButton(onClick = { onRollback(entry.ts) }) { Text("回滚") }
                        }
                        HorizontalDivider()
                    }
                }
            }
        }
    }
}
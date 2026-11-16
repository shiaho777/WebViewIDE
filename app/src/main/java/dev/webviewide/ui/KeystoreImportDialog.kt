package dev.webviewide.ui

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp

@Composable
internal fun KeystoreImportDialog(
    onDismiss: () -> Unit,
    onConfirm: (storePassword: String, alias: String, keyPassword: String) -> Unit,
) {
    var storePassword by remember { mutableStateOf("") }
    var alias by remember { mutableStateOf("") }
    var keyPassword by remember { mutableStateOf("") }
    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("导入密钥库") },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                Text(
                    "支持 PKCS12 (.p12/.pfx) 和 JKS。密码只保存在本机加密存储里；导入后请导出备份并妥善保管。",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
                OutlinedTextField(
                    value = storePassword,
                    onValueChange = { storePassword = it },
                    modifier = Modifier.fillMaxWidth(),
                    singleLine = true,
                    label = { Text("密钥库密码") },
                    visualTransformation = PasswordVisualTransformation(),
                )
                OutlinedTextField(
                    value = alias,
                    onValueChange = { alias = it },
                    modifier = Modifier.fillMaxWidth(),
                    singleLine = true,
                    label = { Text("别名（留空用第一个）") },
                )
                OutlinedTextField(
                    value = keyPassword,
                    onValueChange = { keyPassword = it },
                    modifier = Modifier.fillMaxWidth(),
                    singleLine = true,
                    label = { Text("私钥密码（留空同库密码）") },
                    visualTransformation = PasswordVisualTransformation(),
                )
            }
        },
        confirmButton = {
            TextButton(
                onClick = { onConfirm(storePassword, alias.trim(), keyPassword) },
                enabled = storePassword.isNotBlank(),
            ) { Text("导入") }
        },
        dismissButton = { TextButton(onClick = onDismiss) { Text("取消") } },
    )
}
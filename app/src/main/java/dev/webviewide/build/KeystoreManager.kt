package dev.webviewide.build

import android.content.Context
import android.security.keystore.KeyGenParameterSpec
import android.security.keystore.KeyProperties
import java.io.File
import java.io.FileInputStream
import java.security.KeyStore
import java.security.MessageDigest
import java.security.PrivateKey
import java.security.cert.X509Certificate
import javax.crypto.Cipher
import javax.crypto.KeyGenerator
import javax.crypto.SecretKey
import javax.crypto.spec.GCMParameterSpec

class KeystoreException(message: String) : IllegalStateException(message)

/**
 * User-owned signing keys. Stores live in filesDir/signing/user-*.p12;
 * passwords are encrypted with an Android-Keystore AES key before touching
 * disk (signing/user-keys.json). Per-project binding is by store fingerprint
 * so a renamed file still resolves.
 */
object KeystoreManager {
    private const val DIR = "signing"
    private const val INDEX = "user-keys.json"
    private const val ANDROID_KEYSTORE = "AndroidKeyStore"
    private const val WRAP_ALIAS = "webviewide_signing_wrap"

    data class StoredKey(
        val fileName: String,
        val alias: String,
        val fingerprint: String,
        val wrappedStorePassword: String,
        val wrappedKeyPassword: String,
    )

    fun dir(context: Context): File = File(context.filesDir, DIR).apply { mkdirs() }

    fun list(context: Context): List<StoredKey> = readIndex(context)

    fun fingerprint(identity: SigningIdentity): String = sha256(identity.certificates.first().encoded)

    /**
     * Validates and imports a PKCS12/JKS stream. Returns the stored entry.
     * Throws [KeystoreException] with a user-readable message on bad input.
     */
    fun import(
        context: Context,
        bytes: ByteArray,
        storePassword: String,
        aliasInput: String,
        keyPasswordInput: String,
    ): StoredKey {
        if (bytes.size > 1_000_000) throw KeystoreException("密钥文件太大")
        val keyPassword = keyPasswordInput.ifBlank { storePassword }
        var lastError: String? = null
        for (type in listOf("PKCS12", "JKS")) {
            val result = runCatching {
                val ks = KeyStore.getInstance(type)
                ks.load(bytes.inputStream(), storePassword.toCharArray())
                val aliases = ks.aliases().toList().filter { ks.isKeyEntry(it) }
                if (aliases.isEmpty()) throw KeystoreException("这个密钥库里没有可用的私钥")
                val alias = when {
                    aliasInput.isNotBlank() && aliasInput in aliases -> aliasInput
                    aliasInput.isNotBlank() -> throw KeystoreException("找不到别名 $aliasInput，可用：${aliases.joinToString()}")
                    else -> aliases.first()
                }
                val key = ks.getKey(alias, keyPassword.toCharArray()) as? PrivateKey
                    ?: throw KeystoreException("私钥密码不对")
                val chain = ks.getCertificateChain(alias)?.map { it as X509Certificate }
                    ?: listOfNotNull(ks.getCertificate(alias) as? X509Certificate)
                if (chain.isEmpty()) throw KeystoreException("这个别名没有证书")
                Triple(alias, key, chain)
            }
            val (alias, key, chain) = result.getOrElse {
                lastError = it.message
                continue
            }
            // Re-store as PKCS12 so later loads are uniform.
            val out = KeyStore.getInstance("PKCS12")
            out.load(null, storePassword.toCharArray())
            out.setKeyEntry(alias, key, keyPassword.toCharArray(), chain.toTypedArray())
            val fp = sha256(chain.first().encoded)
            val existing = readIndex(context).firstOrNull { it.fingerprint == fp }
            val fileName = existing?.fileName ?: "user-${fp.take(12)}.p12"
            val dest = File(dir(context), fileName)
            val tmp = File(dest.parentFile, ".${dest.name}.tmp")
            tmp.outputStream().use { out.store(it, storePassword.toCharArray()) }
            if (!tmp.renameTo(dest)) {
                tmp.copyTo(dest, overwrite = true)
                tmp.delete()
            }
            val entry = StoredKey(
                fileName = fileName,
                alias = alias,
                fingerprint = fp,
                wrappedStorePassword = wrap(storePassword),
                wrappedKeyPassword = wrap(keyPassword),
            )
            writeIndex(context, readIndex(context).filter { it.fingerprint != fp } + entry)
            return entry
        }
        throw KeystoreException(
            if (lastError?.contains("password", ignoreCase = true) == true) "密钥库密码不对"
            else "打不开这个密钥库（支持 PKCS12 / JKS）：$lastError",
        )
    }

    /** Loads a stored key into a signing identity. Never regenerates on failure. */
    fun identity(context: Context, entry: StoredKey): SigningIdentity {
        val file = File(dir(context), entry.fileName)
        if (!file.isFile) throw KeystoreException("密钥文件不见了，请重新导入")
        val storePassword = unwrap(entry.wrappedStorePassword)
        val keyPassword = unwrap(entry.wrappedKeyPassword)
        return runCatching {
            val ks = KeyStore.getInstance("PKCS12")
            FileInputStream(file).use { ks.load(it, storePassword.toCharArray()) }
            val key = ks.getKey(entry.alias, keyPassword.toCharArray()) as? PrivateKey
                ?: throw KeystoreException("私钥读取失败")
            val chain = ks.getCertificateChain(entry.alias).map { it as X509Certificate }
            SigningIdentity(file, storePassword, keyPassword, entry.alias, key, chain)
        }.getOrElse { throw KeystoreException("密钥库打不开：${it.message}") }
    }

    fun remove(context: Context, fingerprint: String) {
        val entries = readIndex(context)
        val entry = entries.firstOrNull { it.fingerprint == fingerprint } ?: return
        File(dir(context), entry.fileName).delete()
        writeIndex(context, entries.filter { it.fingerprint != fingerprint })
    }

    /** Copies a stored keystore out (SAF export). Passwords are NOT included. */
    fun exportTo(context: Context, fingerprint: String, dest: File) {
        val entry = readIndex(context).firstOrNull { it.fingerprint == fingerprint }
            ?: throw KeystoreException("没有这个密钥")
        File(dir(context), entry.fileName).copyTo(dest, overwrite = true)
    }

    fun resolve(context: Context, fingerprint: String?): SigningIdentity? {
        if (fingerprint.isNullOrBlank()) return null
        val entry = readIndex(context).firstOrNull { it.fingerprint == fingerprint } ?: return null
        return runCatching { identity(context, entry) }.getOrNull()
    }

    private fun readIndex(context: Context): List<StoredKey> {
        val file = File(dir(context), INDEX)
        if (!file.isFile) return emptyList()
        val root = runCatching {
            @Suppress("UNCHECKED_CAST")
            (dev.webviewide.project.parseJson(file.readText()) as? List<Map<String, Any?>>).orEmpty()
        }.getOrNull() ?: return emptyList()
        return root.mapNotNull { m ->
            runCatching {
                StoredKey(
                    fileName = m["fileName"] as String,
                    alias = m["alias"] as String,
                    fingerprint = m["fingerprint"] as String,
                    wrappedStorePassword = m["wrappedStorePassword"] as String,
                    wrappedKeyPassword = m["wrappedKeyPassword"] as String,
                )
            }.getOrNull()
        }
    }

    private fun writeIndex(context: Context, entries: List<StoredKey>) {
        val list = entries.map {
            mapOf(
                "fileName" to it.fileName,
                "alias" to it.alias,
                "fingerprint" to it.fingerprint,
                "wrappedStorePassword" to it.wrappedStorePassword,
                "wrappedKeyPassword" to it.wrappedKeyPassword,
            )
        }
        File(dir(context), INDEX).writeText(dev.webviewide.project.encodeJson(list))
    }

    private fun wrapKey(): SecretKey {
        val ks = KeyStore.getInstance(ANDROID_KEYSTORE).apply { load(null) }
        (ks.getKey(WRAP_ALIAS, null) as? SecretKey)?.let { return it }
        val generator = KeyGenerator.getInstance(KeyProperties.KEY_ALGORITHM_AES, ANDROID_KEYSTORE)
        generator.init(
            KeyGenParameterSpec.Builder(WRAP_ALIAS, KeyProperties.PURPOSE_ENCRYPT or KeyProperties.PURPOSE_DECRYPT)
                .setBlockModes(KeyProperties.BLOCK_MODE_GCM)
                .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE)
                .setKeySize(256)
                .build(),
        )
        return generator.generateKey()
    }

    internal fun wrap(plain: String): String {
        val cipher = Cipher.getInstance("AES/GCM/NoPadding")
        cipher.init(Cipher.ENCRYPT_MODE, wrapKey())
        val encrypted = cipher.doFinal(plain.toByteArray(Charsets.UTF_8))
        return android.util.Base64.encodeToString(cipher.iv + encrypted, android.util.Base64.NO_WRAP)
    }

    internal fun unwrap(wrapped: String): String {
        val raw = android.util.Base64.decode(wrapped, android.util.Base64.NO_WRAP)
        require(raw.size > 12) { "bad wrapped secret" }
        val cipher = Cipher.getInstance("AES/GCM/NoPadding")
        cipher.init(Cipher.DECRYPT_MODE, wrapKey(), GCMParameterSpec(128, raw, 0, 12))
        return String(cipher.doFinal(raw, 12, raw.size - 12), Charsets.UTF_8)
    }

    internal fun sha256(bytes: ByteArray): String =
        MessageDigest.getInstance("SHA-256").digest(bytes).joinToString("") { "%02x".format(it) }
}
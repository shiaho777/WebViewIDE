package dev.webviewide.git

import java.io.File
import java.util.Base64
import kotlin.io.path.createTempDirectory
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test

class CredentialStoreTest {
    // Reversible fake seal so JVM tests run without AndroidKeyStore.
    private val seal: (String) -> String = { Base64.getEncoder().encodeToString(it.toByteArray()) }
    private val unseal: (String) -> String = { String(Base64.getDecoder().decode(it)) }

    @Test fun roundTripAndNoPlaintextOnDisk() {
        val dir = createTempDirectory("cred").toFile()
        try {
            val store = CredentialStore(dir, seal, unseal)
            store.put("gitee.com", "alice", "super-secret-token")
            val raw = File(dir, "credentials.json").readText()
            assertFalse(raw.contains("super-secret-token"))
            assertTrue(raw.contains("alice")) // username is not a secret
            val cred = store.get("gitee.com")!!
            assertEquals("alice", cred.user)
            assertEquals("super-secret-token", cred.token)
        } finally {
            dir.deleteRecursively()
        }
    }

    @Test fun hostIsolationAndNormalization() {
        val dir = createTempDirectory("cred-host").toFile()
        try {
            val store = CredentialStore(dir, seal, unseal)
            store.put("https://Gitee.com/", "a", "t1")
            store.put("github.com", "b", "t2")
            assertEquals(listOf("gitee.com", "github.com"), store.hosts())
            assertEquals("t1", store.get("GITEE.COM")!!.token)
            assertEquals("t2", store.get("github.com")!!.token)
            store.remove("gitee.com")
            assertNull(store.get("gitee.com"))
            assertEquals(listOf("github.com"), store.hosts())
        } finally {
            dir.deleteRecursively()
        }
    }

    @Test fun corruptFileAndBrokenEntryTolerated() {
        val dir = createTempDirectory("cred-bad").toFile()
        try {
            val store = CredentialStore(dir, seal, unseal)
            File(dir, "credentials.json").writeText("{not json")
            assertTrue(store.hosts().isEmpty())
            assertNull(store.get("gitee.com"))
            // A entry whose token cannot be unsealed is dropped, not crashed.
            File(dir, "credentials.json").writeText("""{"gitee.com":{"user":"a","token":"!!!not-base64!!!"}}""")
            assertNull(store.get("gitee.com"))
            assertTrue(store.hosts().isEmpty())
        } finally {
            dir.deleteRecursively()
        }
    }

    @Test fun sessionAndSheetWireCredentials() {
        val session = File("src/main/java/dev/webviewide/ui/IdeSession.kt").readText()
        assertTrue(session.contains("CredentialStore("))
        assertTrue(session.contains("KeystoreManager.wrap(it)"))
        assertTrue(session.contains("KeystoreManager.unwrap(it)"))
        assertTrue(session.contains("fun saveGitCred("))
        assertTrue(session.contains("fun removeGitCred("))
        val sheet = File("src/main/java/dev/webviewide/ui/GitSheet.kt").readText()
        assertTrue(sheet.contains("远程凭据"))
        assertTrue(sheet.contains("PasswordVisualTransformation()"))
        val screen = File("src/main/java/dev/webviewide/ui/IdeScreen.kt").readText()
        assertTrue(screen.contains("onCredSave = session::saveGitCred"))
    }
}
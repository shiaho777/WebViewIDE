plugins {
    alias(libs.plugins.android.application)
}

android {
    namespace = "dev.webviewide.runtime"
    compileSdk = 37

    defaultConfig {
        applicationId = "dev.webviewide.runtime"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"
    }

    signingConfigs {
        getByName("debug")
        // CI/release can inject a dedicated template identity via env vars;
        // local builds fall back to debug so no secrets are ever committed.
        create("templateRelease") {
            val store = System.getenv("RUNTIME_TEMPLATE_KEYSTORE")
            if (store != null && file(store).isFile) {
                storeFile = file(store)
                storePassword = System.getenv("RUNTIME_TEMPLATE_STORE_PASSWORD")
                keyAlias = System.getenv("RUNTIME_TEMPLATE_KEY_ALIAS")
                keyPassword = System.getenv("RUNTIME_TEMPLATE_KEY_PASSWORD")
            } else {
                val debug = getByName("debug")
                val debugStore = debug.storeFile
                if (debugStore != null && debugStore.isFile) {
                    storeFile = debugStore
                    storePassword = debug.storePassword
                    keyAlias = debug.keyAlias
                    keyPassword = debug.keyPassword
                } else {
                    // CI runners have no debug.keystore until a debug build runs;
                    // generate a throwaway template identity on demand.
                    val generated = layout.buildDirectory.file("signing/template-fallback.p12").get().asFile
                    if (!generated.isFile) {
                        generated.parentFile.mkdirs()
                        providers.exec {
                            commandLine(
                                "keytool", "-genkeypair", "-keystore", generated.absolutePath,
                                "-storetype", "PKCS12", "-storepass", "android", "-keypass", "android",
                                "-alias", "template", "-keyalg", "RSA", "-keysize", "2048",
                                "-validity", "10000", "-dname", "CN=WebViewIDE Template,O=WebViewIDE,C=US",
                            )
                        }.result.get()
                    }
                    storeFile = generated
                    storePassword = "android"
                    keyAlias = "template"
                    keyPassword = "android"
                }
            }
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro",
            )
            signingConfig = signingConfigs.getByName("templateRelease")
        }
        debug {
            isMinifyEnabled = false
            signingConfig = signingConfigs.getByName("debug")
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    packaging {
        resources { excludes += "/META-INF/{AL2.0,LGPL2.1}" }
    }
}

dependencies {
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.webkit)

    testImplementation(libs.junit4)
}

tasks.register<Copy>("syncRuntimeTemplate") {
    dependsOn("assembleRelease")
    from(layout.buildDirectory.dir("outputs/apk/release"))
    include("*.apk")
    into(rootProject.file("app/src/main/assets/runtime"))
    rename { "template.apk" }
    doLast {
        println("synced runtime template -> app/src/main/assets/runtime/template.apk")
    }
}

afterEvaluate {
    tasks.named("assembleRelease").configure {
        finalizedBy("syncRuntimeTemplate")
    }
}

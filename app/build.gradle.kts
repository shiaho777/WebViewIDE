plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.compose.compiler)
}

android {
    namespace = "dev.webviewide"
    compileSdk = 37

    defaultConfig {
        applicationId = "dev.webviewide"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "0.1.0"
        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables { useSupportLibrary = true }
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro",
            )
        }
        debug { isMinifyEnabled = false }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    buildFeatures {
        compose = true
        // The about sheet reads VERSION_NAME / VERSION_CODE from BuildConfig.
        buildConfig = true
    }
    // AGP 9.4's lintVitalAnalyze reads src/main/assets (where syncRuntimeTemplate
    // writes template.apk) and trips Gradle's implicit-dependency validation;
    // dependsOn/mustRunAfter on the lint task do not satisfy it. Release lint is
    // disabled until AGP exposes a proper input wiring; unit tests + CI remain
    // the merge gate, and :runtime still runs its own lint vital.
    lint { checkReleaseBuilds = false }
    packaging {
        resources {
            excludes += "/META-INF/{AL2.0,LGPL2.1}"
            excludes += "META-INF/DEPENDENCIES"
            excludes += "META-INF/INDEX.LIST"
        }
    }
}

dependencies {
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.lifecycle.viewmodel.compose)
    implementation(libs.androidx.activity.compose)
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.ui)
    implementation(libs.androidx.ui.graphics)
    implementation(libs.androidx.ui.tooling.preview)
    implementation(libs.androidx.material3)
    implementation(libs.androidx.material.icons.extended)
    implementation(libs.androidx.webkit)
    implementation(libs.androidx.core.splashscreen)

    implementation(files("libs/ARSCLib-1.4.0.jar"))
    implementation("com.android.tools.build:apksig:8.7.3")
    // Pure-Java Git; no native binaries, no root. HTTPS transport is built in.
    implementation(libs.jgit)
    implementation(libs.slf4j.nop)

    testImplementation(libs.junit4)
    androidTestImplementation(platform(libs.androidx.compose.bom))
    androidTestImplementation(libs.androidx.ui.test.junit4)
    debugImplementation(libs.androidx.ui.test.manifest)
    debugImplementation(libs.androidx.ui.tooling)
}

afterEvaluate {
    tasks.named("mergeDebugAssets").configure {
        dependsOn(":runtime:syncRuntimeTemplate")
    }
    tasks.named("mergeReleaseAssets").configure {
        dependsOn(":runtime:syncRuntimeTemplate")
    }
}

# WebViewIDE

An Android IDE for HTML, CSS, and JavaScript. Edit files on the phone, preview them in the system WebView, and package a signed APK. No root.

[简体中文](README.zh-CN.md)

## What it does

- Keep several projects. Start one from a template (blank, multi-page, React, Vue) or import a file, archive, or folder. Each project's files live under its `src/` directory.
- Preview runs on a local HTTP server with live reload. It can also be opened from other devices on the same network.
- Split the screen between the editor and the preview, and drag the hinge to change the ratio.
- **运行** saves and reloads the preview.
- **打包** injects `src/` into a WebView shell as `assets/www/`, writes `assets/webcfg.json`, signs the APK, and opens the installer.

The page is a normal web page. Both the preview and the installed app are drawn by the system WebView.

## Build

JDK 17 and an Android SDK.

```bash
./gradlew :app:testDebugUnitTest :runtime:syncRuntimeTemplate :app:assembleDebug :runtime:assembleDebug
```

`:app:assembleDebug` builds the runtime template first and packs it into the IDE.

The GitHub repository is [shiaho777/WebViewIDE](https://github.com/shiaho777/WebViewIDE). The old name LuaXIDE redirects there.

## Layout

```
app/       IDE (editor, split view, packager)
runtime/   WebView shell that becomes the packaged APK
```

Released under [Apache-2.0](LICENSE). Third-party components are listed in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

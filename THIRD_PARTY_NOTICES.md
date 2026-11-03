# Third-Party Notices

[简体中文](THIRD_PARTY_NOTICES.zh-CN.md)

The Kotlin sources in this repository are original work. The build also uses the following third-party components.

| Component | Version | License | Origin |
|---|---|---|---|
| ARSCLib | 1.4.0 | Apache-2.0 | [reandroid/ARSCLib](https://github.com/reandroid/ARSCLib), `app/libs/ARSCLib-1.4.0.jar` |
| apksig | 8.7.3 | Apache-2.0 | [tools/apksig](https://android.googlesource.com/platform/tools/apksig/), Gradle dependency `com.android.tools.build:apksig` |
| AndroidX / Jetpack Compose / Kotlin / AGP / AndroidX WebKit | see `gradle/libs.versions.toml` | Apache-2.0 | [developer.android.com](https://developer.android.com/jetpack) |
| Vue | 3.5.13 | MIT | [vuejs/core](https://github.com/vuejs/core), vendored `app/src/main/assets/templates/vue/vue.global.prod.js` |
| React | 18.3.1 | MIT | [facebook/react](https://github.com/facebook/react), vendored `app/src/main/assets/templates/react/react.production.min.js` and `react-dom.production.min.js` |
| htm | 3.1.1 | MIT | [developit/htm](https://github.com/developit/htm), vendored `app/src/main/assets/templates/react/htm.umd.js` |

Full license texts live in each upstream repository. Update this file when a version changes.

The project is published under [Apache-2.0](LICENSE). Redistribution must keep this notice.

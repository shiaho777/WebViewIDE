# 第三方声明

[English](THIRD_PARTY_NOTICES.md)

本仓库的 Kotlin 源码为原创。构建还使用下列第三方组件。

| 组件 | 版本 | 许可证 | 来源 |
|---|---|---|---|
| ARSCLib | 1.4.0 | Apache-2.0 | [reandroid/ARSCLib](https://github.com/reandroid/ARSCLib)，`app/libs/ARSCLib-1.4.0.jar` |
| apksig | 8.7.3 | Apache-2.0 | [tools/apksig](https://android.googlesource.com/platform/tools/apksig/)，Gradle 依赖 `com.android.tools.build:apksig` |
| AndroidX / Jetpack Compose / Kotlin / AGP / AndroidX WebKit | 见 `gradle/libs.versions.toml` | Apache-2.0 | [developer.android.com](https://developer.android.com/jetpack) |
| Vue | 3.5.13 | MIT | [vuejs/core](https://github.com/vuejs/core)，随包文件 `app/src/main/assets/templates/vue/vue.global.prod.js` |
| React | 18.3.1 | MIT | [facebook/react](https://github.com/facebook/react)，随包文件 `app/src/main/assets/templates/react/react.production.min.js` 与 `react-dom.production.min.js` |
| htm | 3.1.1 | MIT | [developit/htm](https://github.com/developit/htm)，随包文件 `app/src/main/assets/templates/react/htm.umd.js` |

许可全文以各自上游仓库为准。升级版本时请同时改这个文件。

项目以 [Apache-2.0](LICENSE) 发布。再分发时请保留本声明。

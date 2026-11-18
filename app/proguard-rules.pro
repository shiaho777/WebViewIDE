-keep class dev.webviewide.** { *; }

# JGit loads transports and the filesystem factory by reflection / ServiceLoader.
-keep class org.eclipse.jgit.** { *; }
-keep class com.googlecode.javaewah.** { *; }
-dontwarn org.eclipse.jgit.**
-dontwarn org.slf4j.**
-dontwarn org.ietf.jgss.**
-dontwarn javax.crypto.**

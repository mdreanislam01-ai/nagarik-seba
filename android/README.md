# Nagarik Seba Android app

A small Android app that opens https://www.nagarikseba.com inside the phone
(WebView). The website itself stays the app — login, forms, file uploads,
downloads and the order flow all run in the WebView.

## How the APK is built

Every push to `main` (and any manual run) triggers the GitHub workflow
`.github/workflows/build-apk.yml`, which builds a debug APK:

1. Open the repo on GitHub → **Actions** → **Build APK** → the latest run.
2. At the bottom, under **Artifacts**, download **nagarikseba-debug-apk**.
3. Open the downloaded file on an Android phone and allow "Install unknown
   apps" for the browser/files app when asked. The app is called
   **Nagarik Seba** and opens the site directly.

Artifacts are kept for 30 days; a newer push builds a newer APK.

## Scope notes

- This is a **debug** build: it installs directly on a phone, but it is not
  signed for the Play Store. A Play Store release build (signed with a
  keystore) is a separate step, if ever wanted.
- No Gradle wrapper is committed on purpose (the wrapper jar is a binary):
  the workflow installs Gradle 8.7 itself, so the build needs no wrapper.
- The app needs no extra Android library: it uses only the framework
  WebView, so the build has almost nothing to download except the Android
  Gradle plugin itself.

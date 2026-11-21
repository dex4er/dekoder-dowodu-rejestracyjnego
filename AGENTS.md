# AGENTS.md

This file provides guidance to coding agents when working with code in this repository.

## Project Overview

An Android and iOS app that scans the Aztec code of a Polish vehicle registration
certificate (dowód rejestracyjny) and shows the decoded data. The decoding is
done by `polish-vehicle-registration-certificate-decoder`, a separate library of
the same author; this repository is the app around it.

- **Stack**: Angular 22 (standalone components, zoneless change detection,
  signals), Ionic 9, Capacitor 8, TypeScript 6.0
- **Platforms**: Android and iOS; the browser build is for development
- **Toolchain**: Node.js, pnpm, JDK, Ruby with CocoaPods and yq pinned in
  `mise.toml` with `mise.lock`
- **Lint**: Biome, run directly and through Trunk Check
- **Tests**: Vitest through the unit-test builder of Angular, in jsdom
- **License**: GPL-2.0

The app was a Cordova + Ionic 4 beta project from 2018 and was rebuilt on a
fresh Ionic starter in 2026 (#22). Nothing of Cordova is left.

The tooling follows freelensapp/freelens-example-extension (Trunk, Biome,
Renovate, the GitHub workflows), without the parts that tie versions to
Freelens.

## Layout

- `src/app/home/`: the list of scanned certificates, swipe to delete, and the
  error card that shows the raw scanned text when it does not decode.
- `src/app/details/`: every field of one certificate.
- `src/app/about/`: the about page, one Markdown document rendered with `marked`:
  the text of `src/assets/about.md` (`{version}` becomes the version of
  `package.json`), then `LICENSE.txt` and the licenses of the libraries. Those
  come from `3rdpartylicenses.txt`, which only the production build writes, so
  the development server shows a note instead. License texts stay verbatim in
  code blocks, collapsed in `<details>` elements, which the sanitizer of
  Angular lets through.
- `src/app/scan/`: the scanner service and its modal over the camera preview.
- `src/app/shared/`: the certificate store and the specimen
  certificate the browser build returns instead of scanning.
- `android/`, `ios/`: the native projects of Capacitor (see "Android project"
  and "iOS").
- `resources/`: the sources of the icon and the splash screen, and the store
  graphics.

See "Storage" for how the certificates are kept.

## Toolchain

`mise.toml` pins Node.js, pnpm, the JDK, Ruby with CocoaPods and yq;
`mise.lock` pins a checksum and a URL per tool for every platform. After
changing `mise.toml`, run `mise lock`; `mise install` alone re-locks only the
current platform. `mise lock` keeps an existing locked version, so
`mise lock --bump <tool>` is how a version inside
a range is re-resolved.

**pnpm comes from mise, not Corepack.** Node.js 25 and newer no longer bundle
Corepack, so with Node 26 a shell has no pnpm unless something installs it.
mise installs one, and pnpm switches itself to the exact version in the
`packageManager` field of `package.json`. The workflows take Node and pnpm from
`mise.lock` through `jdx/mise-action` for the same reason; `corepack enable`
would only find the Corepack of the runner image by accident. The two pnpm pins
need not be equal, but Renovate moves them together.

Agent shells may not have mise activated: run the tools as
`mise exec -- pnpm …`.

**Java is the JDK that Capacitor requires**: 21 for Capacitor 8. It is pinned to
an exact Temurin build, and Renovate may update it within 21.0.x only (see
"Renovate"). A Capacitor upgrade that requires a newer JDK changes the major by
hand.

`pnpm-workspace.yaml` sets `allowBuilds` for the dependencies with install
scripts. All of them ship prebuilt binaries in optional dependencies, so their
scripts are off; a new dependency with an install script fails `pnpm install`
until it is added there, with `true` or `false` on purpose.

## Barcode scanner

The Aztec code of the certificate is large and dense, and that decides the
scanner. The original app used a ZXing patched for big Aztec codes
(EddyVerbruggen/barcodescanner-lib-aar#23, a `CornerDetector` that finds the
corners of the whole symbol instead of extrapolating them from the bull's eye).
That patch is in neither ZXing upstream nor zxing-js; zxing-js has a
`CornerDetector.js`, but nothing imports it.

A test on real certificates (2026-11) decided for ML Kit through
`@capacitor-mlkit/barcode-scanning`:

| Scanner                                                 | Result                                           |
| ------------------------------------------------------- | ------------------------------------------------ |
| ML Kit `startScan()`, `Resolution['3840x2160']`         | reads; with 3× zoom almost at once               |
| ML Kit `startScan()`, 1920x1080                         | unreliable                                       |
| ML Kit `startScan()`, 1280x720 (the default)            | does not read                                    |
| ML Kit `scan()` (Google code scanner)                   | does not read                                    |
| zxing-js in the WebView, plain or with the patch ported | does not read; the WebView stream does not focus |

So `ScanModalComponent` asks for `3840x2160`. The plugin passes it to CameraX as
a target with the closest lower fallback, and CameraX serves what the device
can run next to the preview: 1920x1440 on the test phone. Never leave the
resolution at the default.

The modal offers zoom levels (1×, 1.5×, 2×, 3×, up to the maximum of the device;
the last choice is kept in `localStorage`) and a torch, because a print with
low contrast reads better from farther away and with light.

ML Kit renders the camera preview behind the WebView. `global.scss` hides
everything but the modal while the class `barcode-scanner-active` is on
`body`, and makes the backgrounds transparent; the modal gives its own toolbars
a dark background back, or their text would be dark on the camera image.

On a non-native platform `ScannerService.scan()` returns the specimen
certificate of `src/app/shared/mock-certificate.ts` instead.

## Decoder

`polish-vehicle-registration-certificate-decoder` 1.x ships compiled code in
`lib/` with types; import it by its package name, never from `src/`.

It uses `Buffer` of Node.js. `src/polyfills.ts` sets `globalThis.Buffer` from
the npm package `buffer`, imported as `"buffer/"`: the trailing slash names the
npm package. With a bare `"buffer"`, Biome inside Trunk's sandbox, which has no
`package.json` to tell it otherwise, reports `useNodejsImportProtocol` and
wants `node:buffer`, which does not exist in the WebView.

The unit tests run in Node, where `Buffer` is built in, so they do not cover the
polyfill.

## Storage

`CertificatesService` keeps the certificates with
`@aparajita/capacitor-secure-storage` under one key, as
`{ version: 1, certificates: [{ raw, scannedAt }] }`. It stores the text of the Aztec code, not the decoded fields: the text is
decoded again on every start, so a fix of the decoder applies to what was
scanned before, and an entry that no longer decodes is skipped. A new scan of
the same certificate replaces it and moves it to the top; the list is sorted by
`scannedAt`, last first. `main.ts` loads the store with
`provideAppInitializer`, before the first view shows the list.

On Android the plugin encrypts the value with AES-GCM under a key of the
Android Keystore, which never leaves the device, and stores it in
SharedPreferences; in the browser and in the unit tests it falls back to plain
localStorage. If the key is lost, as some devices do after a reset of the lock
screen, the stored value no longer decrypts and the app starts with an empty
list. `capacitor-secure-storage-plugin` was not taken: it encrypts each value
with RSA directly, which holds about 245 bytes, less than one Aztec code.

The certificates carry personal data of their owners, so they never leave the
device: `android:allowBackup="false"` stops the cloud backup, and
`res/xml/data_extraction_rules.xml` stops the device-to-device transfer too,
which `allowBackup` alone no longer does from Android 12.

## Angular

Change detection is zoneless. State that changes after an `await` must be a
signal (or `computed`), as in `CertificatesService`, `HomePage` and
`ScanModalComponent`; a plain field updated after an `await` does not render.

Ionic 9 exports its standalone components from `@ionic/angular` itself. Its
controllers (`ModalController`, `ToastController`) come from
`provideIonicAngular()`, not from the root injector, so a test of a component
that uses one needs `provideIonicAngular()` in its providers.

The details page lists `Object.values()` of the decoded data: every property of
the data classes is a field with `name`, `description`, `value` and an optional
`valueDescription`.

## Android project

`android/` was generated by `cap add android` and is committed. Changes on top
of the template:

- `AndroidManifest.xml`: the `CAMERA` permission and
  `android:screenOrientation="portrait"`, which replaces a screen orientation
  plugin.
- The icons and splash screens, generated from `resources/icon.png` and
  `resources/splash.png`:

  ```sh
  pnpm dlx --allow-build=sharp @capacitor/assets@3 generate --android --assetPath resources
  ```

  `sharp` needs its install script, which `pnpm dlx` blocks without
  `--allow-build`.

The application id `com.github.dex4er.dekoder_dowodu_rejestracyjnego` is the one
of the Play Store listing since 2018. It is in `capacitor.config.ts`,
`android/app/build.gradle` and the Java package of `MainActivity`. It may still
change, so do not build anything on it being fixed.

`capacitor.config.ts` sets `android.minWebViewVersion` to the oldest Chrome of
`.browserslistrc`, so an older WebView gets an error page of Capacitor instead
of a broken app.

Building needs `ANDROID_HOME`. Capacitor logs "Error injecting safe area CSS"
twice at start; the layout is right, so it is left alone.

## iOS

`ios/` was generated by `cap add ios --packagemanager CocoaPods` and is
committed, with `Podfile.lock`; `ios/App/Pods` is not.

- **CocoaPods, not Swift Package Manager.** The ML Kit plugin ships only a
  podspec, as Google publishes ML Kit for iOS as pods. Ruby and CocoaPods come
  from `mise.toml`.
- **iOS 15.5** is the minimum, which ML Kit 8 needs (`Podfile` and
  `IPHONEOS_DEPLOYMENT_TARGET`).
- **Bundle ID** `com.github.dex4er.dekoder-dowodu-rejestracyjnego`: iOS allows no
  underscores, so it differs from the application id of Android. It is set in
  `project.pbxproj` only.
- `Info.plist`: `NSCameraUsageDescription`, portrait only (on iPad too, which
  needs `UIRequiresFullScreen`), development region `pl`.
- **Keychain**: `CertificatesService` sets the access
  `whenUnlockedThisDeviceOnly` before it stores, so the certificates stay out of
  backups and off other devices, as on Android.

**The simulator runs without ML Kit.** Google ships the ML Kit frameworks with
an x86_64 slice for the simulator and an arm64 slice for devices only, no arm64
slice for the simulator, and the pods exclude arm64 from simulator builds. The
app then builds for x86_64 alone, which the simulators of iOS 26 do not run. The
`post_install` of the `Podfile` therefore, for the `iphonesimulator` SDK only:

- drops the `EXCLUDED_ARCHS` of arm64,
- compiles no sources of the scanner plugin
  (`EXCLUDED_SOURCE_FILE_NAMES`),
- moves the frameworks of ML Kit and of the plugin out of the plain
  `OTHER_LDFLAGS` into `OTHER_LDFLAGS[sdk=iphoneos*] = $(inherited) …`. The
  other way round does not work: `$(inherited)` in a conditional setting of an
  xcconfig takes in the plain setting of the same file, so a conditional
  setting for the simulator cannot remove anything.

Without the native plugin, `Capacitor.isPluginAvailable("BarcodeScanner")` is
false, and `ScannerService` returns the specimen certificate, as in the browser.
Check the resolved settings with
`xcodebuild -workspace App.xcworkspace -scheme App -sdk iphonesimulator -showBuildSettings`.
Device builds keep ML Kit; scanning on an iPhone is still to be tested, and
signing is not set up.

`cap sync ios` runs `xcodebuild clean` and refuses a `ios/App/build` that the
build system did not create, so keep `-derivedDataPath` out of `ios/App`.

`pnpm ios:device` runs `scripts/ios-device.sh`: it builds for a device with
`-allowProvisioningUpdates` and the team of `DEVELOPMENT_TEAM`, installs and
starts the app with `xcrun devicectl`, over the network once the device was
paired by cable. The team ID is personal, so it comes from the environment,
usually `.env`, which git ignores and `mise.toml` loads (`_.file`, skipped
when there is none), and never from `project.pbxproj`.
The team ID is the OU of the "Apple Development" certificate in the keychain.
Without `IOS_DEVICE` the script takes the only connected physical iOS device.

## Biome and Trunk

Trunk runs Biome on a copy of the files in a sandbox outside the repository;
`.trunk/trunk.yaml` explains the command line this needs. Anything Biome
decides from `package.json` or `node_modules` can differ between
`pnpm lint:check` and Trunk Check, as the `buffer` import above shows.

The HTML formatter has `whitespaceSensitivity: "ignore"`: Ionic components are
custom elements, which the default mode treats as inline and glues together
with dangling `>`.

The import groups are `:NODE:`, `@angular/**`, Ionic and Capacitor,
`:PACKAGE:` and `:PATH:`. The template's first group, `{ "type": false }`,
is left out: it collected every value import into one block and made the
other groups useless.

`trunk.yaml` ignores `android/` (the Gradle wrapper and generated resources) and
`resources/`.

## Renovate

`.renovaterc.json` follows the template, minus the Freelens datasources. The
rules specific to this repository:

- **Java**: `allowedVersions` lets through plain Temurin 21.0.x builds only.
  Renovate takes Temurin versions from the Adoptium API, which encodes a fourth
  version component as a huge build number: the respin 21.0.13.1+2 became
  `21.0.13+100000002.0.LTS` in `mise.lock`, a version mise does not know. Such
  respins are often built for some platforms only, too (21.0.13.1 has no
  linux-arm64 build).
- **TypeScript** stays on `~6.0.0`, the only version Angular 22 supports.
- **Gradle** managers are off: the Gradle, Android Gradle plugin and AndroidX
  versions of `android/` come with Capacitor.
- **Groups**: `angular`, `ionic`, `capacitor`, `node` (Node in `mise.toml`,
  `.nvmrc` and the Trunk runtime, with `@types/node`) and `pnpm`.

`biome-migrate.yaml` and `trunk-upgrade.yaml` push with the `GH_TOKEN` secret of
the `automated` environment.

## CI

- `trunk-check.yaml`, `type-check.yaml`, `unit-tests.yaml`: on arm runners.
- `ios-simulator.yaml`: builds for the simulator on macOS, without signing,
  through `pnpm ios:simulator`.
- `android-debug.yaml`: builds the debug APK and uploads it as an artifact. It
  runs on x86_64, because the aapt2 that the Android Gradle plugin downloads
  from Maven has no linux-arm64 build. The Android SDK comes with the runner
  image.
- `mise-lock-check.yaml`: installs every tool from `mise.lock` and rejects a
  checksum that changed without a version change.

The default branch is `main`.

## Not done yet

The release to the Play Store is on hold, as the application id may change:
the `versionCode` and `versionName` in `android/app/build.gradle` are still
those of the template, and signing is not set up. `version.sh` (run by
`pnpm version`) only adds the changelog entry; the app reads its version from
`package.json`.

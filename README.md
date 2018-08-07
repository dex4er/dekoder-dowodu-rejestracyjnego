# dekoder-dowodu-rejestracyjnego

<!-- markdownlint-disable MD013 -->
[![Build Status](https://secure.travis-ci.org/dex4er/dekoder-dowodu-rejestracyjnego.svg)](http://travis-ci.org/dex4er/dekoder-dowodu-rejestracyjnego)
<!-- markdownlint-enable MD013 -->

Dekoder dowodu rejestracyjnego

[<img height='62' width='161' src='https://play.google.com/intl/en_us/badges/images/generic/pl_badge_web_generic.png'/>](https://play.google.com/store/apps/details?id=com.github.dex4er.dekoder_dowodu_rejestracyjnego)

<img height='427' width='240' src='https://raw.githubusercontent.com/dex4er/dekoder-dowodu-rejestracyjnego/master/resources/android/store/screenshot-1.png'><img height='427' width='240' src='https://raw.githubusercontent.com/dex4er/dekoder-dowodu-rejestracyjnego/master/resources/android/store/screenshot-2.png'>

## Środowisko

### Android SDK

Ściągnij z <https://developer.android.com/studio/> narzędzia `sdk-tools`.

Rozpakuj w katalogu `$HOME/android-sdk`.

Dodaj do `$HOME/.profile`:

```sh
export ANDROID_HOME=$HOME/android-sdk
export PATH=$ANDROID_HOME/tools:$ANDROID_HOME/tools/bin:$ANDROID_HOME/platform-tools:$PATH
```

Przeloguj się lub przeładuj środowisko:

```sh
. $HOME/.profile
```

Zainstaluj dodatkowe pakiety SDK

```sh
sdkmanager platform-tools 'build-tools;26.0.2' 'platforms;android-27'
```

### Node.js

Jeśli nie masz odpowiednio nowego Node.js, wykorzystaj NVM:

```sh
wget -qO- https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash
```

i instaluj Node.js v10:

```sh
nvm install 10
```

### NPM

Zainstaluj wszystkie biblioteki Node.js:

```sh
npm i
```

Opcjonalnie Ionic i Cordova mogą zostać zainstalowane globalnie:

```sh
npm i -g ionic cordova
```

W takim przypadku można pominąć prefiks `npx` przy wywoływaniu tych narzędzi.

## Testowanie

Uruchom wersję przeglądarkową:

```sh
npx ionic serve
```

Powinno to wystartować przeglądarkę, która otwiera
stronę <http://localhost:8100/>. Wersja przeglądarkowa korzysta z mocków, które
zastępują natywne moduły Androida.

## Uruchomienie

### Urządzenie

Uruchom na domyślnym urządzeniu podpiętym pod ADB:

```sh
npx ionic cordova run android
```

Spowoduje to też utworzenie pliku
`platforms/android/app/build/outputs/apk/debug/app-debug.apk` ze skompilowaną
aplikacją.

### Emulator

Wymaga to utworzenia obrazu dla emulatora:

```sh
sdkmanager 'system-images;android-26;google_apis;x86_64'
avdmanager create avd --force --name testAVD --abi google_apis/x86_64 --package 'system-images;android-26;google_apis;x86_64'
```

Emulator uruchomi się, jeśli przy uruchamianiu nie ma podpiętego fizycznego
urządzenia, bądź zostanie wywołany bezpośrednio:

```sh
npx ionic cordova emulate android
```

## Kompilacja

W celu przygotowania wersji bez informacji dla debuggera:

<!-- markdownlint-disable MD013 -->

```sh
npx ionic cordova build android --prod --release -- -- --keystore=$HOME/.android/debug.keystore --storePassword=android --alias=androiddebugkey --password=android
```

<!-- markdownlint-enable MD013 -->

Opcje `--keystore`, `--storePassword`, `--alias` i `--password` powinny
wskazywać na właściwy klucz do podpisania aplikacji, ewentualnie można je
pominąć, aby wygenerować paczkę niepodpisaną.

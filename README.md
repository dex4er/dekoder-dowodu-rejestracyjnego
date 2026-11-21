# dekoder-dowodu-rejestracyjnego

[![Trunk Check](https://github.com/dex4er/dekoder-dowodu-rejestracyjnego/actions/workflows/trunk-check.yaml/badge.svg)](https://github.com/dex4er/dekoder-dowodu-rejestracyjnego/actions/workflows/trunk-check.yaml)
[![Android debug build](https://github.com/dex4er/dekoder-dowodu-rejestracyjnego/actions/workflows/android-debug.yaml/badge.svg)](https://github.com/dex4er/dekoder-dowodu-rejestracyjnego/actions/workflows/android-debug.yaml)

Aplikacja na Androida i iOS, która skanuje kod Aztec z polskiego dowodu rejestracyjnego
i pokazuje zapisane w nim dane pojazdu i właściciela.

<img height="427" width="240" alt="Skanowanie kodu Aztec z dowodu rejestracyjnego" src="https://raw.githubusercontent.com/dex4er/dekoder-dowodu-rejestracyjnego/main/resources/android/store/screenshot-1.png"><img height="427" width="240" alt="Dane zdekodowanego dowodu" src="https://raw.githubusercontent.com/dex4er/dekoder-dowodu-rejestracyjnego/main/resources/android/store/screenshot-2.png">

## Środowisko

Wersje narzędzi są przypięte w `mise.toml`. Zainstaluj [mise](https://mise.jdx.dev/)
i w katalogu projektu uruchom:

```sh
mise install
pnpm install
```

To instaluje Node.js, pnpm i JDK. Do budowania aplikacji na Androida potrzebny
jest jeszcze Android SDK, na przykład z Android Studio, ze zmienną
`ANDROID_HOME` wskazującą na jego katalog.

## Uruchomienie w przeglądarce

```sh
pnpm start
```

Strona działa pod adresem <http://localhost:4200/>. Wersja przeglądarkowa nie
ma aparatu: przycisk „Skanuj” zwraca dane przykładowego dowodu rejestracyjnego.

## Testy i sprawdzenia

```sh
pnpm test          # testy jednostkowe
pnpm type:check    # sprawdzenie typów
pnpm lint          # Biome
pnpm trunk:check   # wszystkie lintery Trunk
```

## Android

Zbuduj aplikację webową i przenieś ją do projektu Androida:

```sh
pnpm build
pnpm android:sync
```

Potem jedno z poniższych:

```sh
pnpm android:debug   # android/app/build/outputs/apk/debug/app-debug.apk
pnpm android:run     # instalacja i uruchomienie na urządzeniu lub emulatorze
pnpm android:open    # otwarcie projektu w Android Studio
```

Gotowy plik APK w wersji debug jest też artefaktem każdego przebiegu
[Android debug build](https://github.com/dex4er/dekoder-dowodu-rejestracyjnego/actions/workflows/android-debug.yaml).

## iOS

Potrzebny jest Xcode. CocoaPods instaluje `mise install`.

```sh
pnpm build
pnpm ios:sync
```

Potem jedno z poniższych:

```sh
pnpm ios:open        # otwarcie projektu w Xcode i uruchomienie stamtąd
pnpm ios:run         # instalacja i uruchomienie na symulatorze lub urządzeniu
pnpm ios:device      # build, podpisanie, instalacja i start na iPhonie
pnpm ios:simulator   # sam build na symulator
```

`pnpm ios:device` potrzebuje Team ID certyfikatu deweloperskiego. Wpisz go do
`mise.local.toml`, którego nie ma w repo:

```toml
[env]
DEVELOPMENT_TEAM = "XXXXXXXXXX"
# IOS_DEVICE = "UDID z xcrun devicectl list devices", jeśli podłączony jest więcej niż jeden iPhone
```

iPhone musi być sparowany z Xcode (raz przez kabel), potem wystarczy ta sama
sieć Wi-Fi.

Na symulatorze nie ma aparatu ani skanera: przycisk „Skanuj” zwraca dane
przykładowego dowodu rejestracyjnego, jak w przeglądarce.

## Licencja

GPL-2.0, zobacz [LICENSE.txt](LICENSE.txt).

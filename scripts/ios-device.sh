#!/usr/bin/env bash

# Builds the iOS app for a device, signs it, installs it and starts it.
#
#   DEVELOPMENT_TEAM  team ID of the signing certificate (required)
#   IOS_DEVICE        UDID of the device; the only connected iPhone if unset
#   IOS_DERIVED_DATA  build directory; outside ios/App, which `cap sync` cleans

set -euo pipefail

: "${DEVELOPMENT_TEAM:?set DEVELOPMENT_TEAM to the team ID of the signing certificate, for example in .env}"

derived_data="${IOS_DERIVED_DATA:-${TMPDIR:-/tmp}/dekoder-ios}"

if [[ -z ${IOS_DEVICE-} ]]; then
  devices_json="$(mktemp)"
  trap 'rm -f "$devices_json"' EXIT
  xcrun devicectl list devices --quiet --json-output "$devices_json" >/dev/null
  devices="$(yq -pj -oy '[.result.devices[]
    | select(.hardwareProperties.reality == "physical"
      and .hardwareProperties.platform == "iOS"
      and .connectionProperties.tunnelState == "connected")
    | .hardwareProperties.udid] | .[]' "$devices_json")"
  if [[ $(grep -c . <<<"$devices") -ne 1 ]]; then
    echo "Connected iOS devices: ${devices:-none}. Set IOS_DEVICE to one UDID from: xcrun devicectl list devices" >&2
    exit 1
  fi
  IOS_DEVICE="$devices"
fi

cd "$(dirname "$0")/../ios/App"

xcodebuild \
  -workspace App.xcworkspace \
  -scheme App \
  -configuration Debug \
  -destination "id=$IOS_DEVICE" \
  -derivedDataPath "$derived_data" \
  -allowProvisioningUpdates \
  DEVELOPMENT_TEAM="$DEVELOPMENT_TEAM" \
  CODE_SIGN_STYLE=Automatic \
  build

app="$derived_data/Build/Products/Debug-iphoneos/App.app"
bundle_id="$(/usr/libexec/PlistBuddy -c 'Print :CFBundleIdentifier' "$app/Info.plist")"

xcrun devicectl device install app --device "$IOS_DEVICE" "$app"
xcrun devicectl device process launch --device "$IOS_DEVICE" "$bundle_id"

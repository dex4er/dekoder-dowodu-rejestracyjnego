#!/bin/sh

cd `dirname $0`/..

cordova-icon --config=config.xml --icon=resources/icon.png

cp -f platforms/android/app/src/main/res/drawable-ldpi/icon.png resources/android/icon/drawable-ldpi-icon.png
cp -f platforms/android/app/src/main/res/drawable-mdpi/icon.png resources/android/icon/drawable-mdpi-icon.png
cp -f platforms/android/app/src/main/res/drawable-hdpi/icon.png resources/android/icon/drawable-hdpi-icon.png
cp -f platforms/android/app/src/main/res/drawable-xhdpi/icon.png resources/android/icon/drawable-xhdpi-icon.png
cp -f platforms/android/app/src/main/res/drawable-xxhdpi/icon.png resources/android/icon/drawable-xxhdpi-icon.png
cp -f platforms/android/app/src/main/res/drawable-xxxhdpi/icon.png resources/android/icon/drawable-xxxhdpi-icon.png
cp -f platforms/android/app/src/main/res/drawable/icon.png resources/ios/icon/icon.png

cordova-splash --config=config.xml --splash=resources/splash.png

cp -f platforms/android/app/src/main/res/drawable-land-ldpi/screen.png resources/android/splash/drawable-land-ldpi-screen.png
cp -f platforms/android/app/src/main/res/drawable-land-mdpi/screen.png resources/android/splash/drawable-land-mdpi-screen.png
cp -f platforms/android/app/src/main/res/drawable-land-hdpi/screen.png resources/android/splash/drawable-land-hdpi-screen.png
cp -f platforms/android/app/src/main/res/drawable-land-xhdpi/screen.png resources/android/splash/drawable-land-xhdpi-screen.png
cp -f platforms/android/app/src/main/res/drawable-land-xxhdpi/screen.png resources/android/splash/drawable-land-xxhdpi-screen.png
cp -f platforms/android/app/src/main/res/drawable-land-xxxhdpi/screen.png resources/android/splash/drawable-land-xxxhdpi-screen.png
cp -f platforms/android/app/src/main/res/drawable-port-ldpi/screen.png resources/android/splash/drawable-port-ldpi-screen.png
cp -f platforms/android/app/src/main/res/drawable-port-mdpi/screen.png resources/android/splash/drawable-port-mdpi-screen.png
cp -f platforms/android/app/src/main/res/drawable-port-hdpi/screen.png resources/android/splash/drawable-port-hdpi-screen.png
cp -f platforms/android/app/src/main/res/drawable-port-xhdpi/screen.png resources/android/splash/drawable-port-xhdpi-screen.png
cp -f platforms/android/app/src/main/res/drawable-port-xxhdpi/screen.png resources/android/splash/drawable-port-xxhdpi-screen.png
cp -f platforms/android/app/src/main/res/drawable-port-xxxhdpi/screen.png resources/android/splash/drawable-port-xxxhdpi-screen.png

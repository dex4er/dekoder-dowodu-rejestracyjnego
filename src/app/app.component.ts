import { Component } from '@angular/core'

import { Platform } from '@ionic/angular'

import { Market } from '@ionic-native/market/ngx'
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx'
import { SplashScreen } from '@ionic-native/splash-screen/ngx'
import { StatusBar } from '@ionic-native/status-bar/ngx'

import MobileDetect from 'mobile-detect'

declare interface NavigatorApp {
  exitApp (): void
}

declare interface Navigator {
  app: NavigatorApp
}

declare var navigator: Navigator

const ANDROID_VERSION_WITH_CHROME_WEBVIEW = 7
const CHROME_VERSION_WITH_CSS_GRID = 57

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor (
    private market: Market,
    private platform: Platform,
    private screenOrientation: ScreenOrientation,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    void this.initializeApp()
  }

  async initializeApp () {
    await this.platform.ready()

    const md = new MobileDetect(window.navigator.userAgent)

    if (md.is('AndroidOS')) {
      const androidVersion = md.version('Android') || 0
      const chromeVersion = md.version('Chrome') || 0
      if (chromeVersion < CHROME_VERSION_WITH_CSS_GRID) {
        if (androidVersion >= ANDROID_VERSION_WITH_CHROME_WEBVIEW) {
          alert(`Wersja Google Chrome (${chromeVersion}) jest zbyt stara.\n\nProszę spróbować zainstalować nowszą.`)
          this.market.open('com.android.chrome')
        } else {
          alert(`Wersja Android System Webview (${chromeVersion}) jest zbyt stara.\n\nnProszę spróbować zainstalować nowszą.`)
          await this.market.open('com.google.android.webview')
        }
        navigator.app.exitApp()
      }
    }

    await this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT)
    this.statusBar.styleDefault()
    document.addEventListener('backbutton', () => {
      navigator.app.exitApp()
    })
    this.splashScreen.hide()
  }
}

import { Component } from '@angular/core'

import { Platform } from '@ionic/angular'
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx'
import { SplashScreen } from '@ionic-native/splash-screen/ngx'
import { StatusBar } from '@ionic-native/status-bar/ngx'

import { WebviewChecker } from '../lib/webview-checker'

declare interface NavigatorApp {
  exitApp (): void
}

declare interface Navigator {
  app: NavigatorApp
}

declare var navigator: Navigator

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor (
    private platform: Platform,
    private screenOrientation: ScreenOrientation,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private webviewChecker: WebviewChecker
  ) {
    void this.initializeApp()
  }

  async initializeApp () {
    await this.platform.ready()

    if (this.platform.is('android')) {
      const webviewVersion = await this.webviewChecker.getWebViewVersion()
      const webviewMajorVersion = Number(webviewVersion.split('.')[0])
      if (!webviewMajorVersion || webviewMajorVersion < 57) {
        alert(`Android System Webview (${webviewVersion}) jest zbyt stary.\n\Proszę spróbować zainstalować nową wersję.`)
        await this.webviewChecker.openGooglePlayPage()
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

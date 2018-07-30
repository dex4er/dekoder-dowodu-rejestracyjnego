import { Component } from '@angular/core'

import { Platform } from '@ionic/angular'
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx'
import { SplashScreen } from '@ionic-native/splash-screen/ngx'
import { StatusBar } from '@ionic-native/status-bar/ngx'

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor (
    private platform: Platform,
    private screenOrientation: ScreenOrientation,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    void this.initializeApp()
  }

  async initializeApp () {
    await this.platform.ready()
    await this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT)
    this.statusBar.styleDefault()
    document.addEventListener('backbutton', () => {
      (navigator as any).app.exitApp()
    })
    this.splashScreen.hide()
  }
}

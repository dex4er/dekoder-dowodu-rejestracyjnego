import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { IonicModule } from '@ionic/angular'
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx'
import { SplashScreen } from '@ionic-native/splash-screen/ngx'
import { StatusBar } from '@ionic-native/status-bar/ngx'

import { ScreenOrientationMock } from '../mock/screen-orientation-mock'
import { SplashScreenMock } from '../mock/splash-screen-mock'
import { StatusBarMock } from '../mock/status-bar-mock'

import { AppComponent } from './app.component'
import { AppRoutingModule } from './app-routing.module'

import { WebviewChecker } from '../lib/webview-checker'

const isCordova = window.hasOwnProperty('cordova')

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [
    { provide: ScreenOrientation, useClass: isCordova ? ScreenOrientation : ScreenOrientationMock },
    { provide: SplashScreen, useClass: isCordova ? SplashScreen : SplashScreenMock },
    { provide: StatusBar, useClass: isCordova ? StatusBar : StatusBarMock },
    WebviewChecker
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

import { SplashScreen } from '@ionic-native/splash-screen/ngx'

export class SplashScreenMock extends SplashScreen {
  show (): void {/*noop*/}
  hide (): void {/*noop*/}
}

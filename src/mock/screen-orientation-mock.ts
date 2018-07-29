import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx'

export class ScreenOrientationMock extends ScreenOrientation {
  lock (_orientation: string): Promise<any> {
    return new Promise((resolve, _reject) => {
      resolve()
    })
  }
}

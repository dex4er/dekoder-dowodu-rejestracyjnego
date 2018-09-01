import { Injectable } from '@angular/core'

declare interface WebViewChecker {
  getWebViewVersion (): Promise<string>
  isWebViewEnabled (): Promise<boolean>
  openGooglePlayPage (): Promise<void>
}

declare interface CordovaPlugins {
  webViewChecker: WebViewChecker
}

declare var plugins: CordovaPlugins

@Injectable()
export class WebviewChecker {
  getWebViewVersion (): Promise<string> {
    return plugins.webViewChecker.getWebViewVersion()
  }
  isWebViewEnabled (): Promise<boolean> {
    return plugins.webViewChecker.isWebViewEnabled()
  }
  openGooglePlayPage (): Promise<void> {
    return plugins.webViewChecker.openGooglePlayPage()
  }
}

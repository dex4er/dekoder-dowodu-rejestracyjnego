declare interface NavigatorApp {
  exitApp (): void
}

declare interface Navigator {
  app: NavigatorApp
}

declare var navigator: Navigator

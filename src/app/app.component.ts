import { Component, inject, viewChild } from "@angular/core";

import { App } from "@capacitor/app";
import { IonApp, IonRouterOutlet, Platform } from "@ionic/angular";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  private readonly platform = inject(Platform);

  private readonly routerOutlet = viewChild.required(IonRouterOutlet);

  constructor() {
    // The back button on the main view sends the app to the background, as the
    // home button does, rather than finishing it. Open overlays (100) and the
    // router outlet (0) handle the button first, but the outlet passes it on
    // even when it navigates back, hence the check.
    this.platform.backButton.subscribeWithPriority(-1, () => {
      if (!this.routerOutlet().canGoBack()) {
        void App.minimizeApp();
      }
    });
  }
}

/*!
 * Dekoder dowodu rejestracyjnego
 *
 * (c) 2018-2026 Piotr Roszatycki
 *
 * GPL-2.0
 */

import { inject, provideAppInitializer } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import {
  PreloadAllModules,
  provideRouter,
  RouteReuseStrategy,
  withComponentInputBinding,
  withPreloading,
} from "@angular/router";

import { IonicRouteStrategy, provideIonicAngular } from "@ionic/angular";

import { addIcons } from "ionicons";
import {
  chevronBack,
  chevronForward,
  flashlight,
  flashlightOutline,
  informationCircleOutline,
  shareSocial,
  trash,
} from "ionicons/icons";

import { AppComponent } from "./app/app.component";
import { routes } from "./app/app.routes";
import { CertificatesService } from "./app/shared/certificates.service";

addIcons({ chevronBack, chevronForward, flashlight, flashlightOutline, informationCircleOutline, shareSocial, trash });

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules), withComponentInputBinding()),
    // The stored certificates are read before the first view shows the list.
    provideAppInitializer(() => inject(CertificatesService).load()),
  ],
}).catch((err: unknown) => console.error(err));

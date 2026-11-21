/*!
 * Dekoder dowodu rejestracyjnego
 *
 * (c) 2018-2026 Piotr Roszatycki
 *
 * GPL-2.0
 */

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
import { chevronBack, chevronForward, flashlight, flashlightOutline, trash } from "ionicons/icons";

import { AppComponent } from "./app/app.component";
import { routes } from "./app/app.routes";

addIcons({ chevronBack, chevronForward, flashlight, flashlightOutline, trash });

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules), withComponentInputBinding()),
  ],
}).catch((err: unknown) => console.error(err));

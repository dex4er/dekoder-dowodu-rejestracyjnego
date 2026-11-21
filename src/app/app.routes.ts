import type { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "home",
    loadComponent: () => import("./home/home.page").then((m) => m.HomePage),
  },
  {
    path: "details/:serial",
    loadComponent: () => import("./details/details.page").then((m) => m.DetailsPage),
  },
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full",
  },
];

import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { SharedModule } from "../shared/shared.module";
import { DetailsPage } from "./details.page";

const routes: Routes = [
  {
    path: "",
    component: DetailsPage,
  },
];

@NgModule({
  declarations: [DetailsPage],
  imports: [CommonModule, FormsModule, IonicModule, RouterModule.forChild(routes), SharedModule],
  providers: [],
})
export class DetailsPageModule {}

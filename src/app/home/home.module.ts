import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { IonicModule, NavController } from "@ionic/angular";
import { BarcodeScanner } from "@ionic-native/barcode-scanner/ngx";
import { BarcodeScannerMock } from "../../mock/barcode-scanner-mock";
import { SharedModule } from "../shared/shared.module";
import { HomePage } from "./home.page";

const isCordova = window.hasOwnProperty("cordova");

@NgModule({
  declarations: [HomePage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: "",
        component: HomePage,
      },
    ]),
    SharedModule,
  ],
  providers: [
    { provide: BarcodeScanner, useClass: isCordova ? BarcodeScannerMock : BarcodeScannerMock },
    NavController,
  ],
})
export class HomePageModule {}

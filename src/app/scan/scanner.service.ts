import { Injectable, inject } from "@angular/core";

import { Capacitor } from "@capacitor/core";
import { BarcodeScanner } from "@capacitor-mlkit/barcode-scanning";
import { ModalController } from "@ionic/angular";

import { MOCK_CERTIFICATE } from "../shared/mock-certificate";
import { ScanModalComponent } from "./scan.modal";

@Injectable({
  providedIn: "root",
})
export class ScannerService {
  private readonly modalController = inject(ModalController);

  /**
   * Scans an Aztec code and returns its text, or undefined when the user
   * cancels.
   */
  async scan(): Promise<string | undefined> {
    // The browser has no native scanner, and neither has the iOS simulator, whose
    // build leaves out ML Kit (see "iOS" in AGENTS.md).
    if (!Capacitor.isNativePlatform() || !Capacitor.isPluginAvailable("BarcodeScanner")) {
      return MOCK_CERTIFICATE;
    }

    const { camera } = await BarcodeScanner.requestPermissions();
    if (camera !== "granted" && camera !== "limited") {
      throw new Error("Brak zgody na użycie aparatu.");
    }

    const modal = await this.modalController.create({
      component: ScanModalComponent,
      cssClass: "barcode-scanner-modal",
      showBackdrop: false,
    });
    await modal.present();
    const { data } = await modal.onWillDismiss<string>();
    return data;
  }
}

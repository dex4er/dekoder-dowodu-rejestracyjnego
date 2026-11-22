import { Injectable, inject } from "@angular/core";

import { Share } from "@capacitor/share";
import { AlertController, ToastController } from "@ionic/angular";

import type { PolishVehicleRegistrationCertificateData } from "polish-vehicle-registration-certificate-decoder";

import { certificateText } from "./certificate-text";
import { CertificatesService } from "./certificates.service";

/** Share and delete, the same from the list and from the details page. */
@Injectable({
  providedIn: "root",
})
export class CertificateActionsService {
  private readonly certificates = inject(CertificatesService);

  private readonly alertController = inject(AlertController);

  private readonly toastController = inject(ToastController);

  /** Sends the certificate as text through the share sheet of the system. */
  async share(data: PolishVehicleRegistrationCertificateData): Promise<void> {
    try {
      await Share.share({
        title: this.certificates.label(data),
        text: certificateText(data),
        dialogTitle: "Udostępnij dane dowodu rejestracyjnego",
      });
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      // Closing the share sheet without a choice rejects the call too.
      if (message === "Share canceled") {
        return;
      }
      await this.toast(`Nie można udostępnić danych: ${message}`, "danger");
    }
  }

  /**
   * Deletes the certificate once the user confirms it.
   *
   * @returns whether the certificate was deleted
   */
  async delete(data: PolishVehicleRegistrationCertificateData): Promise<boolean> {
    const label = this.certificates.label(data);
    const alert = await this.alertController.create({
      header: "Usunąć dowód rejestracyjny?",
      message: label,
      buttons: [
        { text: "Anuluj", role: "cancel" },
        { text: "Usuń", role: "destructive" },
      ],
    });
    await alert.present();
    const { role } = await alert.onDidDismiss();
    if (role !== "destructive") {
      return false;
    }
    await this.certificates.delete(this.certificates.serial(data));
    await this.toast(`Skasowano dane dowodu rejestracyjnego ${label}`);
    return true;
  }

  private async toast(message: string, color?: string): Promise<void> {
    const toast = await this.toastController.create({ message, duration: 2500, position: "top", color });
    await toast.present();
  }
}

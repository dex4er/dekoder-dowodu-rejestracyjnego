import { Component, computed, inject, input } from "@angular/core";

import { Share } from "@capacitor/share";
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonTitle,
  IonToolbar,
  NavController,
  ToastController,
} from "@ionic/angular";

import { type CertificateField, certificateFields, certificateText, fieldLines } from "../shared/certificate-text";
import { CertificatesService } from "../shared/certificates.service";

@Component({
  selector: "app-details",
  templateUrl: "details.page.html",
  styleUrl: "details.page.scss",
  imports: [
    IonBackButton,
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonTitle,
    IonToolbar,
  ],
})
export class DetailsPage {
  private readonly certificates = inject(CertificatesService);

  private readonly navController = inject(NavController);

  private readonly toastController = inject(ToastController);

  /** The route parameter, bound by withComponentInputBinding. */
  readonly serial = input.required<string>();

  readonly item = computed(() => this.certificates.fetch(this.serial()));

  readonly label = computed(() => {
    const item = this.item();
    return item ? this.certificates.label(item) : "";
  });

  readonly fields = computed(() => {
    const item = this.item();
    return item ? certificateFields(item) : [];
  });

  lines(field: CertificateField): readonly string[] {
    return fieldLines(field);
  }

  /** Sends the certificate as text through the share sheet of the system. */
  async share(): Promise<void> {
    const item = this.item();
    if (!item) {
      return;
    }
    try {
      await Share.share({
        title: this.certificates.label(item),
        text: certificateText(item),
        dialogTitle: "Udostępnij dane dowodu rejestracyjnego",
      });
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      // Closing the share sheet without a choice rejects the call too.
      if (message === "Share canceled") {
        return;
      }
      const toast = await this.toastController.create({
        message: `Nie można udostępnić danych: ${message}`,
        duration: 3000,
        position: "top",
        color: "danger",
      });
      await toast.present();
    }
  }

  async delete(): Promise<void> {
    const item = this.item();
    if (item) {
      await this.certificates.delete(this.serial());
      const toast = await this.toastController.create({
        message: `Skasowano dane dowodu rejestracyjnego ${this.certificates.label(item)}`,
        duration: 2000,
        position: "top",
      });
      await toast.present();
    }
    await this.navController.navigateBack("/home");
  }
}

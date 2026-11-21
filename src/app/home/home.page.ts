import { Component, inject, signal } from "@angular/core";

import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonListHeader,
  IonTitle,
  IonToolbar,
  NavController,
} from "@ionic/angular";

import {
  type PolishVehicleRegistrationCertificateData,
  PolishVehicleRegistrationCertificateDecoder,
} from "polish-vehicle-registration-certificate-decoder";

import { ScannerService } from "../scan/scanner.service";
import { CertificatesService } from "../shared/certificates.service";

interface ScanError {
  message: string;
  text?: string;
}

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrl: "home.page.scss",
  imports: [
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonContent,
    IonFooter,
    IonHeader,
    IonIcon,
    IonItem,
    IonItemOption,
    IonItemOptions,
    IonItemSliding,
    IonLabel,
    IonList,
    IonListHeader,
    IonTitle,
    IonToolbar,
  ],
})
export class HomePage {
  readonly certificates = inject(CertificatesService);

  private readonly navController = inject(NavController);

  private readonly scanner = inject(ScannerService);

  readonly error = signal<ScanError | undefined>(undefined);

  private readonly dragged = signal<ReadonlySet<string>>(new Set());

  async details(item: PolishVehicleRegistrationCertificateData): Promise<void> {
    await this.navController.navigateForward(["/details", this.certificates.serial(item)]);
  }

  async drag(item: PolishVehicleRegistrationCertificateData, event: CustomEvent): Promise<void> {
    const target = event.target as HTMLIonItemSlidingElement | null;
    if (!target) {
      return;
    }
    const serial = this.certificates.serial(item);
    const opened = (await target.getSlidingRatio()) >= 1;
    this.dragged.update((dragged) => {
      const result = new Set(dragged);
      if (opened) {
        result.add(serial);
      } else {
        result.delete(serial);
      }
      return result;
    });
  }

  isDragged(item: PolishVehicleRegistrationCertificateData): boolean {
    return this.dragged().has(this.certificates.serial(item));
  }

  async scan(): Promise<void> {
    this.error.set(undefined);

    let text: string | undefined;
    try {
      text = await this.scanner.scan();
    } catch (e) {
      this.error.set({ message: e instanceof Error ? e.message : String(e) });
      return;
    }
    if (text === undefined) {
      return;
    }

    let data: PolishVehicleRegistrationCertificateData;
    try {
      data = new PolishVehicleRegistrationCertificateDecoder(text.trim()).data;
    } catch (e) {
      console.error("Error", e);
      this.error.set({ message: e instanceof Error ? e.message : String(e), text });
      return;
    }
    this.certificates.add(data);
    await this.details(data);
  }
}

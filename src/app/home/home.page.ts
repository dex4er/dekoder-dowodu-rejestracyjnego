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

import type { PolishVehicleRegistrationCertificateData } from "polish-vehicle-registration-certificate-decoder";

import { ScannerService } from "../scan/scanner.service";
import { type Certificate, CertificatesService } from "../shared/certificates.service";

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

  serial(item: Certificate): string {
    return this.certificates.serial(item.data);
  }

  scannedAt(item: Certificate): string {
    return new Date(item.scannedAt).toLocaleString("pl-PL", { dateStyle: "short", timeStyle: "short" });
  }

  async details(data: PolishVehicleRegistrationCertificateData): Promise<void> {
    await this.navController.navigateForward(["/details", this.certificates.serial(data)]);
  }

  async delete(item: Certificate): Promise<void> {
    await this.certificates.delete(this.serial(item));
  }

  async drag(item: Certificate, event: CustomEvent): Promise<void> {
    const target = event.target as HTMLIonItemSlidingElement | null;
    if (!target) {
      return;
    }
    const serial = this.serial(item);
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

  isDragged(item: Certificate): boolean {
    return this.dragged().has(this.serial(item));
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
      data = await this.certificates.add(text);
    } catch (e) {
      console.error("Error", e);
      this.error.set({ message: e instanceof Error ? e.message : String(e), text });
      return;
    }
    await this.details(data);
  }
}

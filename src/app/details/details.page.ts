import { Component, computed, inject, input } from "@angular/core";

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
} from "@ionic/angular";

import { CertificateActionsService } from "../shared/certificate-actions.service";
import { type CertificateField, certificateFields, fieldLines } from "../shared/certificate-text";
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

  private readonly actions = inject(CertificateActionsService);

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

  async share(): Promise<void> {
    const item = this.item();
    if (item) {
      await this.actions.share(item);
    }
  }

  async delete(): Promise<void> {
    const item = this.item();
    if (item && (await this.actions.delete(item))) {
      await this.navController.navigateBack("/home");
    }
  }
}

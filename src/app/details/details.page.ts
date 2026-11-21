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
  ToastController,
} from "@ionic/angular";

import { CertificatesService } from "../shared/certificates.service";

/** The common shape of every field of the decoded certificate. */
interface Field {
  name: string;
  description: string;
  value: string | readonly string[];
  valueDescription?: string;
}

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
    return item ? (Object.values(item) as Field[]) : [];
  });

  lines(field: Field): readonly string[] {
    if (typeof field.value !== "string") {
      return field.value;
    }
    return [field.valueDescription || field.value];
  }

  async delete(): Promise<void> {
    const item = this.item();
    if (item) {
      this.certificates.delete(this.serial());
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

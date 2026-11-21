import { computed, Injectable, signal } from "@angular/core";

import type { PolishVehicleRegistrationCertificateData } from "polish-vehicle-registration-certificate-decoder";

@Injectable({
  providedIn: "root",
})
export class CertificatesService {
  private readonly certificates = signal<ReadonlyMap<string, PolishVehicleRegistrationCertificateData>>(new Map());

  readonly list = computed(() => [...this.certificates().values()]);

  readonly count = computed(() => this.certificates().size);

  serial(data: PolishVehicleRegistrationCertificateData): string {
    return data.seriaDr.value;
  }

  add(data: PolishVehicleRegistrationCertificateData): void {
    this.certificates.update((certificates) => new Map(certificates).set(this.serial(data), data));
  }

  fetch(serial: string): PolishVehicleRegistrationCertificateData | undefined {
    return this.certificates().get(serial);
  }

  delete(serial: string): void {
    this.certificates.update((certificates) => {
      const result = new Map(certificates);
      result.delete(serial);
      return result;
    });
  }

  label(data: PolishVehicleRegistrationCertificateData): string {
    return [
      data.numerRejestracyjnyPojazdu.value,
      data.markaPojazdu.value,
      data.modelPojazdu.value,
      data.seriaDr.value,
    ].join(" ");
  }
}

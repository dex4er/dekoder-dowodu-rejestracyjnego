import { Injectable } from '@angular/core'

import { PolishVehicleRegistrationCertificateData } from 'polish-vehicle-registration-certificate-decoder/src/polish-vehicle-registration-certificate-decoder'

@Injectable({
  providedIn: 'root'
})
export class CertificatesService {
  private certificates: PolishVehicleRegistrationCertificateData[] = []

  add (data: PolishVehicleRegistrationCertificateData) {
    this.certificates.push(data)
  }

  fetch (serial: string): PolishVehicleRegistrationCertificateData | undefined {
    const data = this.certificates.find((item) => item.seriaDr.value === serial)
    return data || undefined
  }

  list (): PolishVehicleRegistrationCertificateData[] {
    return this.certificates
  }

  label (data: PolishVehicleRegistrationCertificateData): string {
    return [
      data.seriaDr.value,
      data.markaPojazdu.value,
      data.modelPojazdu.value,
      data.numerRejestracyjnyPojazdu.value
    ].join(' ')
  }
}

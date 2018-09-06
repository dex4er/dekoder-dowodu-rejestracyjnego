import { Injectable } from '@angular/core'

import { PolishVehicleRegistrationCertificateData } from 'polish-vehicle-registration-certificate-decoder/src/polish-vehicle-registration-certificate-decoder'

interface Certificates {
  [serial: string]: PolishVehicleRegistrationCertificateData
}

@Injectable({
  providedIn: 'root'
})
export class CertificatesService {
  private certificates: Certificates = {}

  serial (data: PolishVehicleRegistrationCertificateData): string {
    return data.seriaDr.value
  }

  add (data: PolishVehicleRegistrationCertificateData): void {
    const serial = this.serial(data)
    this.certificates[serial] = data
  }

  fetch (serial: string): PolishVehicleRegistrationCertificateData | undefined {
    const data = this.certificates[serial]
    return data || undefined
  }

  delete (serial: string) {
    delete this.certificates[serial]
  }

  list (): PolishVehicleRegistrationCertificateData[] {
    return Object.values(this.certificates)
  }

  count (): number {
    return Object.keys(this.certificates).length
  }

  label (data: PolishVehicleRegistrationCertificateData): string {
    return [
      data.numerRejestracyjnyPojazdu.value,
      data.markaPojazdu.value,
      data.modelPojazdu.value,
      data.seriaDr.value
    ].join(' ')
  }
}

import { Component } from '@angular/core'
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx'
import { PolishVehicleRegistrationCertificateDecoder, PolishVehicleRegistrationCertificateData } from 'polish-vehicle-registration-certificate-decoder'

import { version } from '../../version'

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  data!: PolishVehicleRegistrationCertificateData
  error!: Error
  objectKeys = Object.keys
  version = version

  private hint: { [key: string]: boolean } = {}

  constructor (
    private barcodeScanner: BarcodeScanner
  ) {}

  isHint (key: string): boolean {
    return this.hint[key]
  }

  toggleHint (key: string): void {
    this.hint[key] = !(this.hint[key] || false)
  }

  scan (): void {
    this.barcodeScanner.scan({ formats: 'AZTEC', orientation: 'portrait' }).then((barcodeData) => {
      if (!barcodeData.cancelled && barcodeData.format === 'AZTEC') {
        try {
          const decoder = new PolishVehicleRegistrationCertificateDecoder(barcodeData.text)
          this.data = decoder.data
        } catch (e) {
          console.error('Error', e)
          this.error = e
        }
      }
    }).catch((err) => {
      console.error('Error', err)
    })
  }
}

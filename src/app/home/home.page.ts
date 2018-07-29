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

  constructor (
    private barcodeScanner: BarcodeScanner
  ) {}

  async scan (): Promise<void> {
    try {
      const barcodeData = await this.barcodeScanner.scan({ formats: 'AZTEC', orientation: 'portrait' })
      if (!barcodeData.cancelled && barcodeData.format === 'AZTEC') {
        try {
          const decoder = new PolishVehicleRegistrationCertificateDecoder(barcodeData.text)
          this.data = decoder.data
        } catch (e) {
          console.error('Error', e)
          this.error = e
        }
      }
    } catch(e) {
      console.error('Error', e)
    }
  }
}

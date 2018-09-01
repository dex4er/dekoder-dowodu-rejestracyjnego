import { Component } from '@angular/core'
import { LoadingController } from '@ionic/angular'
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx'

import { PolishVehicleRegistrationCertificateDecoder, PolishVehicleRegistrationCertificateData } from 'polish-vehicle-registration-certificate-decoder'

import { delay } from '../../lib/delay'

import { version } from '../../version'

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  data?: PolishVehicleRegistrationCertificateData
  error?: Error

  version = version

  constructor (
    private barcodeScanner: BarcodeScanner,
    private loadingController: LoadingController
  ) {}

  isArray (object: any): boolean {
    return Array.isArray(object)
  }

  linesForField (key: string): number {
    const data: any = this.data
    return data[key] && data[key].value && data[key].value.length
  }

  async scan (): Promise<void> {
    const loading = await this.loadingController.create()
    await loading.present()

    this.data = undefined
    this.error = undefined

    try {
      const barcodeData = await this.barcodeScanner.scan({ formats: 'AZTEC', orientation: 'portrait' })
      if (!barcodeData.cancelled && barcodeData.format === 'AZTEC') {
        try {
          const decoder = new PolishVehicleRegistrationCertificateDecoder(barcodeData.text)
          this.data = decoder.data
        } catch (e) {
          console.error('Error', e)
          this.error = Object.assign(e, barcodeData)
        }
      }
    } catch (e) {
      console.error('Error', e)
    }

    if (this.data) {
      await delay(2000) // TODO: check if page is rendered
    }
    await loading.dismiss()
  }
}

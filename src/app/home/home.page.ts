import { Component } from '@angular/core'
import { LoadingController, NavController } from '@ionic/angular'
import { BarcodeScanner, BarcodeScanResult } from '@ionic-native/barcode-scanner/ngx'

import { PolishVehicleRegistrationCertificateDecoder, PolishVehicleRegistrationCertificateData } from 'polish-vehicle-registration-certificate-decoder'

import { version } from '../../version'

import { CertificatesService } from '../shared/certificates.service'

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  error?: Error

  version = version

  private barcodeData?: BarcodeScanResult

  constructor (
    private barcodeScanner: BarcodeScanner,
    private certificates: CertificatesService,
    private loadingController: LoadingController,
    private navController: NavController
  ) {}

  async details (item: PolishVehicleRegistrationCertificateData): Promise<void> {
    const serial = item.seriaDr.value
    this.navController.navigateForward(`/details/${serial}`)
  }

  async scan (): Promise<void> {
    const loading = await this.loadingController.create()
    await loading.present()

    this.error = undefined

    try {
      this.barcodeData = await this.barcodeScanner.scan({ formats: 'AZTEC', orientation: 'portrait' })
      if (!this.barcodeData.cancelled && this.barcodeData.format === 'AZTEC') {
        try {
          const decoder = new PolishVehicleRegistrationCertificateDecoder(this.barcodeData.text)
          this.certificates.add(decoder.data)
          const serial = decoder.data.seriaDr.value
          this.navController.navigateForward(`/details/${serial}`)
        } catch (e) {
          console.error('Error', e)
          this.error = Object.assign(e, this.barcodeData)
        }
      }
    } catch (e) {
      console.error('Error', e)
    }

    await loading.dismiss()
  }
}

import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'

import { NavController, ToastController } from '@ionic/angular'

import { PolishVehicleRegistrationCertificateData } from 'polish-vehicle-registration-certificate-decoder/src/polish-vehicle-registration-certificate-decoder'

import { CertificatesService } from '../shared/certificates.service'

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss']
})
export class DetailsPage implements OnInit {
  item?: PolishVehicleRegistrationCertificateData
  serial?: string

  constructor (
    private certificates: CertificatesService,
    private navController: NavController,
    private route: ActivatedRoute,
    private toastController: ToastController
  ) {}

  ngOnInit () {
    this.serial = this.route.snapshot.paramMap.get('serial') || undefined
    if (this.serial) {
      this.item = this.certificates.fetch(this.serial)
    }
  }

  isArray (object: any): boolean {
    return Array.isArray(object)
  }

  linesForField (key: string): number {
    if (this.serial && this.item) {
      const data: any = this.item
      return data[key] && data[key].value && data[key].value.length
    } else {
      return 0
    }
  }

  async delete () {
    if (this.item && this.serial) {
      this.certificates.delete(this.serial)
      const label = this.certificates.label(this.item)
      const toast = await this.toastController.create({
        message: `Skasowano dane dowodu rejestracyjnego ${label}`,
        duration: 2000,
        position: 'top'
      })
      toast.present()
    }
    this.navController.goBack()
  }
}

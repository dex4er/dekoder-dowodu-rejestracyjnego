import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'

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
    private route: ActivatedRoute
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
}

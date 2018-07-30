import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { IonicModule } from '@ionic/angular'
import { FormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx'

import { BarcodeScannerMock } from '../../mock/barcode-scanner-mock'

import { HomePage } from './home.page'
import { KeysPipe } from './keys.pipe'

const isCordova = window.hasOwnProperty('cordova')

@NgModule({
  declarations: [HomePage, KeysPipe],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ])
  ],
  providers: [
    { provide: BarcodeScanner, useClass: isCordova ? BarcodeScanner : BarcodeScannerMock }
  ]
})
export class HomePageModule {}

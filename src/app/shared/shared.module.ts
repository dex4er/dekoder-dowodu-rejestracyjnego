import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { KeysPipe } from './keys.pipe'

@NgModule({
  declarations: [
    KeysPipe
  ],
  exports: [
    KeysPipe
  ],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }

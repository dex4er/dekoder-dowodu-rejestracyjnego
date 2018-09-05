import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { Routes, RouterModule } from '@angular/router'

import { IonicModule } from '@ionic/angular'

import { DetailsPage } from './details.page'

import { SharedModule } from '../shared/shared.module'

const routes: Routes = [
  {
    path: '',
    component: DetailsPage
  }
]

@NgModule({
  declarations: [
    DetailsPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  providers: [
  ]
})
export class DetailsPageModule {}

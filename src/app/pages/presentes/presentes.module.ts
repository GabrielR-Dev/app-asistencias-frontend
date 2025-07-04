import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PresentesPageRoutingModule } from './presentes-routing.module';

import { PresentesPage } from './presentes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PresentesPageRoutingModule
  ],
  declarations: [PresentesPage]
})
export class PresentesPageModule {}

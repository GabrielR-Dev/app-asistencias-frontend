import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PageSecurePageRoutingModule } from './page-secure-routing.module';

import { PageSecurePage } from './page-secure.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PageSecurePageRoutingModule
  ],
  declarations: [PageSecurePage]
})
export class PageSecurePageModule {}

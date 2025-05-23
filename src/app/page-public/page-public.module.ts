import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PagePublicPageRoutingModule } from './page-public-routing.module';

import { PagePublicPage } from './page-public.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PagePublicPageRoutingModule
  ],
  declarations: [PagePublicPage]
})
export class PagePublicPageModule {}

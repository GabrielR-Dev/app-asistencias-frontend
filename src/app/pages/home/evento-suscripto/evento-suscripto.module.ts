import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EventoSuscriptoPageRoutingModule } from './evento-suscripto-routing.module';

import { EventoSuscriptoPage } from './evento-suscripto.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EventoSuscriptoPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [EventoSuscriptoPage]
})
export class EventoSuscriptoPageModule {}
